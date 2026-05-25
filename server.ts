import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Proxy to Railway backend to avoid browser CORS / fetch blocks
  app.post("/api/auth/login", async (req, res) => {
    try {
      const response = await fetch("https://dascon-backend-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { message: text };
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Express proxy authentication failed:", error);
      res.status(500).json({ error: "Express Proxy Failure", message: error.message });
    }
  });

  // API Route - Proxy forgot password endpoint to Railway backend
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const response = await fetch("https://dascon-backend-production.up.railway.app/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { message: text };
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Express proxy forgot-password failed:", error);
      res.status(500).json({ error: "Express Proxy Failure", message: error.message });
    }
  });

  // API Route - Proxy reset password endpoint to Railway backend
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const response = await fetch("https://dascon-backend-production.up.railway.app/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { message: text };
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Express proxy reset-password failed:", error);
      res.status(500).json({ error: "Express Proxy Failure", message: error.message });
    }
  });

  // API Route - Proxy registration endpoint to Railway backend with Bearer Token matching
  app.post("/api/admin/register-user", async (req, res) => {
    try {
      const response = await fetch("https://dascon-backend-production.up.railway.app/api/admin/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization ? { "Authorization": req.headers.authorization } : {}),
        },
        body: JSON.stringify(req.body),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { message: text };
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Express proxy registration failed:", error);
      res.status(500).json({ error: "Express Proxy Failure", message: error.message });
    }
  });

  // API Route - Resilient proxy to fetch user listings from the backend database matching multiple endpoints
  app.get("/api/admin/users", async (req, res) => {
    // Force set cache-disabling headers to completely prevent browser from serving cached standard SPA fallback HTML
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const authHeader = req.headers.authorization;
    // Extract query parameters or fallback to retrieving up to 100 users for flawless complete lists
    const queryString = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "?page=0&size=100";

    const endpoints = [
      `https://dascon-backend-production.up.railway.app/api/admin/users${queryString}`,
      `https://dascon-backend-production.up.railway.app/api/admin/get-all-users${queryString}`,
      `https://dascon-backend-production.up.railway.app/api/admin/get-users${queryString}`,
      `https://dascon-backend-production.up.railway.app/api/admin/all-users${queryString}`,
      `https://dascon-backend-production.up.railway.app/api/admin/employees${queryString}`
    ];

    let lastStatus = 404;
    let lastData = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { "Authorization": authHeader } : {}),
          },
        });

        const text = await response.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (_) {
          parsed = text;
        }

        if (response.ok) {
          return res.status(response.status).json(parsed);
        } else {
          lastStatus = response.status;
          lastData = parsed;
        }
      } catch (err: any) {
        console.error(`Resilient user listing probe failed for: ${url}`, err.message);
      }
    }

    res.status(lastStatus).json(lastData || { message: "No operational backend listing endpoints resolved." });
  });

  // Serve static dist in production, and use Vite Dev middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

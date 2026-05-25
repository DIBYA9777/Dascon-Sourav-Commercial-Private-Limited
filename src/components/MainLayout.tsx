import React, { useState, Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '@/src/components/Sidebar.tsx';
import { Menu, Bell, Search, Globe } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import LoadingSpinner from '@/src/components/LoadingSpinner.tsx';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 border border-slate-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 w-80 group focus-within:border-blue-200 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick Search..." 
                aria-label="Quick Search"
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full placeholder:text-slate-300"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Ops</span>
            </div>
            <button className="relative w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-1" />
            <Link to="/profile" className="flex items-center gap-3 hover:bg-slate-50 p-1 rounded-xl transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-tighter italic group-hover:text-blue-600">{user?.name}</p>
                <p className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-0.5">{user?.role.replace('_', ' ')}</p>
              </div>
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white italic text-xs shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-all">
                {user?.name.charAt(0)}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

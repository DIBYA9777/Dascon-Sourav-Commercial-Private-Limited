import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/src/types.ts';
import { authService } from '@/src/services/authService.ts';
import { Modal } from '@/src/components/Modal.tsx';
import { LogOut, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  registerUser: (userData: any) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('nway_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (_) {
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string, role: UserRole = UserRole.USER) => {
    const backendData = await authService.login(email, password);

    // Map backend response fields to the User interface
    const mappedRole = backendData.role as UserRole;
    const loggedInUser: User = {
      id: backendData.id || String(Math.floor(Math.random() * 10000)),
      userId: backendData.email || email,
      name: `${backendData.firstName || ''} ${backendData.lastName || ''}`.trim() || backendData.email?.split('@')[0] || 'User',
      email: backendData.email || email,
      role: mappedRole,
      modulePermissions: backendData.modulePermissions || [],
      sectionPermissions: backendData.sectionPermissions || [],
      status: 'ACTIVE',
    };

    setUser(loggedInUser);
    localStorage.setItem('nway_user', JSON.stringify(loggedInUser));
    localStorage.setItem('nway_token', backendData.token);
  };

  const registerUser = async (userData: any) => {
    return authService.registerUser(userData);
  };

  const logout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    localStorage.clear();
    setShowLogoutConfirm(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, isAuthenticated: !!user }}>
      {children}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="text-center p-2 space-y-4">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100 shadow-xs">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Terminate Active Session?</h4>
            <p className="text-slate-500 font-bold text-[10px] leading-relaxed uppercase tracking-wider">
              Are you sure you want to log out? All your local session data, active tokens, and cached configurations will be cleared.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Yes, Log Out
            </button>
          </div>
        </div>
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

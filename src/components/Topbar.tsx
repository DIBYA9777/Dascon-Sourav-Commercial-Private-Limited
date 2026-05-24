import { Bell, Search, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { Button } from './Button.tsx';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
          <input
            type="text"
            placeholder="Search data..."
            aria-label="Search data"
            className="w-full bg-slate-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-tighter">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="group relative">
            <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors" aria-label="User actions">
              <User className="h-4 w-4 text-slate-600" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

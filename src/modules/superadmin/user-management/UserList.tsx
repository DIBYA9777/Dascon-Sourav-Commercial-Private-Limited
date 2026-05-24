import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Mail, Shield, UserCheck, UserX, Trash2, ShieldAlert, Loader2 } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { User, UserRole } from '@/src/types.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { AUTH_ENDPOINTS } from '@/src/constants/apiConfig.ts';

export default function UserList() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsersFromApi = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('nway_token');
      // Append cache-busting timestamp and paging parameters to avoid browser caching
      const response = await fetch(`${AUTH_ENDPOINTS.USERS}?_cb=${Date.now()}&page=0&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Resilient parsing logic to handle diverse potential backend list formats
      let rawList: any[] = [];
      if (data) {
        if (data.data?.content && Array.isArray(data.data.content)) {
          rawList = data.data.content;
        } else if (data.content && Array.isArray(data.content)) {
          rawList = data.content;
        } else if (Array.isArray(data.data)) {
          rawList = data.data;
        } else if (Array.isArray(data)) {
          rawList = data;
        } else if (data.users && Array.isArray(data.users)) {
          rawList = data.users;
        } else if (data.employees && Array.isArray(data.employees)) {
          rawList = data.employees;
        }
      }

      const mappedUsers: User[] = rawList.map((item: any, idx: number) => {
        const id = item.id || item._id || String(idx + 1);
        const firstName = item.firstName || '';
        const lastName = item.lastName || '';
        const name = item.name || `${firstName} ${lastName}`.trim() || item.email?.split('@')[0] || `Staff #${id}`;
        const email = item.email || '';
        const userId = item.userId || item.employeeId || item.id || `US-${id}`;
        
        let role = UserRole.USER;
        if (item.role) {
          const r = String(item.role).toUpperCase();
          if (r === 'SUPER_ADMIN' || r === 'SUPERADMIN') {
            role = UserRole.SUPER_ADMIN;
          } else if (r === 'ADMIN') {
            role = UserRole.ADMIN;
          } else if (r === 'SITE_ADMIN' || r === 'SITEADMIN') {
            role = UserRole.SITE_ADMIN;
          } else if (r === 'HO_USER' || r === 'HOUSER') {
            role = UserRole.HO_USER;
          }
        }

        return {
          id,
          userId,
          name,
          email,
          role,
          status: item.isActive === false || item.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
      });

      setUsers(mappedUsers);
    } catch (err: any) {
      console.error('Failed to load real users from API:', err);
      setErrorMsg('Could not fetch registered employees list from server.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersFromApi();
  }, []);

  const handleDelete = (id: string, role: UserRole) => {
    if (role === UserRole.SUPER_ADMIN) {
      alert("Super Admin cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } as User : u));
  };

  const columns = [
    { 
      header: 'Employee Details', 
      accessor: (item: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xs border-2 border-white shadow-sm shrink-0">
            {item.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded-lg italic tracking-tight shadow-sm shrink-0">{item.userId}</span>
              <p className="font-black text-slate-900 text-base truncate uppercase tracking-tight">{item.name}</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Communication', 
      accessor: (item: User) => (
        <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 truncate max-w-[180px]">
          <Mail className="w-4 h-4 text-slate-300" /> {item.email}
        </p>
      )
    },
    { 
      header: 'Authority Level', 
      accessor: (item: User) => (
        <div className="flex items-center gap-2">
          {item.role === UserRole.SUPER_ADMIN && <ShieldAlert className="w-5 h-5 text-rose-500" />}
          <Badge variant={item.role === UserRole.SUPER_ADMIN ? 'danger' : item.role === UserRole.ADMIN ? 'info' : 'default'} className="uppercase text-[11px] tracking-[0.1em] font-black px-3 py-1 rounded-xl">
            {item.role.replace('_', ' ')}
          </Badge>
        </div>
      )
    },
    { 
      header: 'System Status', 
      accessor: (item: User) => (
        <Badge variant={item.status === 'ACTIVE' ? 'success' : 'warning'} className="text-[11px] px-3 py-1 rounded-xl font-black uppercase italic tracking-wider">
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Strategic Actions',
      accessor: (item: User) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/superadmin/user-management/edit/${item.id}`)} className="text-xs h-9 px-3 font-black uppercase tracking-tight hover:bg-slate-50">Edit</Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleStatus(item.id)}
            className={`h-7 px-2 ${item.status === 'ACTIVE' ? 'text-amber-500' : 'text-emerald-500'}`}
          >
            {item.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-red-500"
            onClick={() => handleDelete(item.id, item.role)}
            disabled={item.role === UserRole.SUPER_ADMIN}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Identity Registry</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] italic">Asset & Resource Allocation Control</p>
        </div>
        <Button onClick={() => navigate('/superadmin/user-management/create')} size="sm" className="shadow-lg shadow-blue-100 px-6 rounded-xl font-black italic uppercase text-xs">
          <UserPlus className="h-4 w-4 mr-2" />
          Onboard Staff
        </Button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input 
            type="text"
            placeholder="Search by name, ID or Email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:border-blue-500 outline-none transition-all shadow-inner"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-2xl font-bold tracking-tight uppercase italic flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 gap-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Accessing Secure Registry...</span>
          </div>
        )}
        <DataTable columns={columns} data={users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.userId.toLowerCase().includes(searchTerm.toLowerCase()))} loading={loading} />
      </div>
    </div>
  );
}

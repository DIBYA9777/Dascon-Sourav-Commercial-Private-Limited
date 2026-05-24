import { useState } from 'react';
import { UserCheck, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';
import { UserRole } from '@/src/types.ts';

export default function RoleAssignment() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const users = [
    { id: '1', name: 'Amit Kumar', role: UserRole.SITE_ADMIN, site: 'NH44' },
    { id: '2', name: 'Priya Singh', role: UserRole.USER, site: 'HQ' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Role Assignment</h2>
          <p className="text-slate-500 text-sm">Map users to high-level system roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-900 text-sm">Select User</div>
          <div className="divide-y divide-slate-100">
            {users.map(u => (
              <button 
                key={u.id}
                onClick={() => setSelectedUser(u.id)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedUser === u.id ? 'bg-blue-50/50' : ''}`}
              >
                <div>
                  <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.role.replace('_', ' ')}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            {selectedUser ? (
              <div className="max-w-md mx-auto">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Assign Role to {users.find(u => u.id === selectedUser)?.name}</h3>
                <div className="grid grid-cols-1 gap-2 mt-6">
                  {Object.values(UserRole).map(role => (
                    <button 
                      key={role}
                      className="p-3 border border-slate-200 rounded-xl text-sm font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-700"
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <Button className="w-full mt-8">Confirm Role Change</Button>
              </div>
            ) : (
              <div className="py-12">
                <UserCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Select a user from the left to manage their system role</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { MapPin, UserPlus, Check } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';

export default function SiteAssignment() {
  const [selectedUser, setSelectedUser] = useState('1');
  
  const sites = [
    { id: 'S1', name: 'NH44 Highway Project', location: 'Indore' },
    { id: 'S2', name: 'Metro Line 3', location: 'Section B' },
    { id: 'S3', name: 'Flyover - Terminal 2', location: 'Delhi' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Site Assignment</h2>
        <p className="text-slate-500 text-sm">Assign users to specific operational sites and branches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Select User</h3>
          <select 
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="1">Amit Kumar (Admin)</option>
            <option value="2">Priya Singh (User)</option>
            <option value="3">Rahul Verma (HO User)</option>
          </select>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm italic">Assign Sites to Selected User</h3>
          </div>
          <div className="p-6 space-y-3">
             {sites.map(site => (
                <div key={site.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                         <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                         <p className="font-bold text-slate-900">{site.name}</p>
                         <p className="text-xs text-slate-500">{site.location}</p>
                      </div>
                   </div>
                   <Button variant="outline" size="sm" className="rounded-full">
                      <UserPlus className="w-4 h-4 mr-2" /> Assign
                   </Button>
                </div>
             ))}
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
             <Button>Save Assignments</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

export default function LocationSetup() {
  const [locations] = useState([
    { id: 'LOC-001', site: 'Main Highway Project', name: 'Section A - Kilometer 0-10', type: 'WORK_FRONT' },
    { id: 'LOC-002', site: 'Indore Plant', name: 'Raw Material Yard', type: 'STORAGE' },
  ]);

  const columns = [
    { header: 'Location Code', accessor: 'id' as const, className: 'font-mono text-xs' },
    { header: 'Site Reference', accessor: 'site' as const },
    { header: 'Location Name', accessor: 'name' as const },
    { 
      header: 'Type', 
      accessor: (item: any) => (
        <Badge variant="info">{item.type.replace('_', ' ')}</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Edit2 className="h-3 w-4" /></Button>
          <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Location Setup</h2>
          <p className="text-slate-500 text-sm">Define sub-locations and work-fronts within sites</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <DataTable columns={columns} data={locations} />
      </div>
    </div>
  );
}

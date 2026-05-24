import { useState } from 'react';
import { Truck, Plus, Settings, AlertCircle, FileText } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

export default function MachineList() {
  const [machines] = useState([
    { id: 'EX-201', type: 'Excavator', model: 'JCB 3DX', site: 'Site NH44', health: 'GOOD', meter: '4,520 hrs' },
    { id: 'TR-102', type: 'Tipper', model: 'Tata Primal', site: 'Site NH44', health: 'MAINTENANCE', meter: '18,400 km' },
    { id: 'DG-05', type: 'Generator', model: 'Kirloskar 65kVA', site: 'Indore Plant', health: 'GOOD', meter: '1,200 hrs' },
  ]);

  const columns = [
    { header: 'Asset ID', accessor: 'id' as const, className: 'font-mono' },
    { header: 'Type', accessor: 'type' as const },
    { header: 'Site Assigned', accessor: 'site' as const },
    { header: 'Reading', accessor: 'meter' as const },
    { 
      header: 'Condition', 
      accessor: (item: any) => (
        <Badge variant={item.health === 'GOOD' ? 'success' : 'warning'}>
          {item.health}
        </Badge>
      )
    },
    {
      header: 'History',
      accessor: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="Log Book"><FileText className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" title="Settings"><Settings className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Machinery & Assets</h2>
          <p className="text-slate-500">Resource monitoring, Log Books, and Fleet maintenance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '42' },
          { label: 'Operational', value: '38' },
          { label: 'Breakdown', value: '02', alert: true },
          { label: 'Avg Availability', value: '94%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-2xl font-black ${stat.alert ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
              {stat.alert && <AlertCircle className="h-5 w-5 text-red-500" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <DataTable columns={columns} data={machines} />
      </div>
    </div>
  );
}

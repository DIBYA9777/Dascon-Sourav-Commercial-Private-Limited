import { useState } from 'react';
import { Truck, Plus, CheckCircle2, History } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { formatDate } from '@/src/lib/utils.ts';

export default function MIN() {
  const [issues] = useState([
    { id: 'MIN-0012', date: '2024-10-20', site: 'Site NH44', vehicle: 'EX-201', items: 'Diesel - 200L', issuer: 'Ramesh Singh', status: 'ISSUED' },
    { id: 'MIN-0013', date: '2024-10-21', site: 'Site NH44', vehicle: 'TR-105', items: 'Lubricant - 20L', issuer: 'Ramesh Singh', status: 'PENDING' },
  ]);

  const columns = [
    { header: 'MIN No', accessor: 'id' as const, className: 'font-mono font-bold' },
    { header: 'Date', accessor: (item: any) => formatDate(item.date) },
    { header: 'Vehicle/Asset', accessor: 'vehicle' as const },
    { header: 'Materials', accessor: 'items' as const },
    { header: 'Issuer', accessor: 'issuer' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'ISSUED' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Print',
      accessor: () => <Button variant="ghost" size="sm">Print Slip</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Material Issue Note (MIN)</h2>
          <p className="text-slate-500">Track consumption on machinery and projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><History className="h-4 w-4 mr-2" /> Recent</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> New Issue</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Fuel Issued (24h)</p>
          <p className="text-2xl font-black text-blue-600 mt-1">1,250 Liters</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Pending Verification</p>
          <p className="text-2xl font-black text-amber-500 mt-1">05 Slips</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Usage Efficiency</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">+4.2%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <DataTable columns={columns} data={issues} />
      </div>
    </div>
  );
}

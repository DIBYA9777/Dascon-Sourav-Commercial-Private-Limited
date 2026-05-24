import { useState } from 'react';
import { ShoppingCart, Plus, Filter, FileText } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { formatDate } from '@/src/lib/utils.ts';

export default function MaterialRequisition() {
  const [requisitions] = useState([
    { id: 'MR-2024-001', date: '2024-10-15', site: 'Site NH44', items: 5, status: 'PENDING', total: 45000 },
    { id: 'MR-2024-002', date: '2024-10-14', site: 'Indore Plant', items: 2, status: 'APPROVED', total: 12000 },
  ]);

  const columns = [
    { header: 'MR Number', accessor: 'id' as const, className: 'font-mono' },
    { header: 'Date', accessor: (item: any) => formatDate(item.date) },
    { header: 'Site', accessor: 'site' as const },
    { header: 'Items', accessor: 'items' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'APPROVED' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <Button variant="ghost" size="sm">View Details</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Material Requisition (MR)</h2>
          <p className="text-slate-500">Create and track material requests from sites</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New MR
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100">
        <DataTable columns={columns} data={requisitions} />
      </div>
    </div>
  );
}

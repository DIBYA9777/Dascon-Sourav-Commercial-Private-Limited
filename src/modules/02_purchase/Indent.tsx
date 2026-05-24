import { useState } from 'react';
import { FileText, Plus, FileSearch, ArrowRight } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { formatDate } from '@/src/lib/utils.ts';

export default function Indent() {
  const [indents] = useState([
    { id: 'IND-2024-102', date: '2024-10-18', site: 'Site NH44', mrRef: 'MR-2024-001', vendor: 'Multiple', status: 'PENDING' },
    { id: 'IND-2024-105', date: '2024-10-19', site: 'Indore Plant', mrRef: 'MR-2024-012', vendor: 'UltraTech', status: 'CONVERTED' },
  ]);

  const columns = [
    { header: 'Indent No', accessor: 'id' as const, className: 'font-mono font-bold text-blue-600' },
    { header: 'Date', accessor: (item: any) => formatDate(item.date) },
    { header: 'MR Link', accessor: 'mrRef' as const },
    { header: 'Preferred Vendor', accessor: 'vendor' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'CONVERTED' ? 'success' : 'info'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Action',
      accessor: (item: any) => (
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          Create PO <ArrowRight className="h-3 w-3" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Indents</h2>
          <p className="text-slate-500">Aggregate requirements for vendor selection</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Bulk Indent
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <DataTable columns={columns} data={indents} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Calculator, Plus, FileSpreadsheet, Download } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { formatCurrency, formatDate } from '@/src/lib/utils.ts';

export default function PurchaseBillPage() {
  const [bills] = useState([
    { id: 'PB/2024/045', date: '2024-10-10', vendor: 'UltraTech Cement', site: 'Site NH44', amount: 1250000, status: 'PAID' },
    { id: 'PB/2024/046', date: '2024-10-12', vendor: 'Jindal Steel', site: 'Indore Plant', amount: 850000, status: 'PENDING' },
    { id: 'PB/2024/047', date: '2024-10-15', vendor: 'Aggregates India', site: 'Site NH44', amount: 35000, status: 'AUDITED' },
  ]);

  const columns = [
    { header: 'Bill Number', accessor: 'id' as const, className: 'font-mono' },
    { header: 'Date', accessor: (item: any) => formatDate(item.date) },
    { header: 'Vendor', accessor: 'vendor' as const },
    { header: 'Amount', accessor: (item: any) => formatCurrency(item.amount) },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={
          item.status === 'PAID' ? 'success' : 
          item.status === 'AUDITED' ? 'info' : 'warning'
        }>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Export',
      accessor: () => (
        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Purchase Billing & GST</h2>
          <p className="text-slate-500">Record and verify purchase invoices with GST mapping</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Audit Ledger
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Calculator className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Outstanding</p>
            <p className="text-2xl font-extrabold text-slate-900 uppercase">{formatCurrency(2450000)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Calculator className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paid This Month</p>
            <p className="text-2xl font-extrabold text-slate-900 uppercase">{formatCurrency(8500000)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calculator className="h-6 w-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pending Audit</p>
            <p className="text-2xl font-extrabold text-slate-900 uppercase">12 Bills</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100">
        <DataTable columns={columns} data={bills} />
      </div>
    </div>
  );
}

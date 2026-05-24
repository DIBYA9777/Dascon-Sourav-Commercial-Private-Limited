import { useState } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { formatCurrency } from '@/src/lib/utils.ts';

export default function StockBalance() {
  const [stocks] = useState([
    { id: '1', item: 'Cement (OPC 53)', group: 'Raw Material', stock: 450, unit: 'Bags', value: 180000, site: 'Site NH44' },
    { id: '2', item: 'Crushed Sand', group: 'Aggregates', stock: 120, unit: 'MT', value: 72000, site: 'Site NH44' },
    { id: '3', item: 'Steel - 12mm', group: 'Steel', stock: 15, unit: 'MT', value: 900000, site: 'Indore Plant' },
  ]);

  const columns = [
    { header: 'Item Name', accessor: 'item' as const },
    { header: 'Category', accessor: 'group' as const },
    { header: 'Site', accessor: 'site' as const },
    { 
      header: 'Stock Level', 
      accessor: (item: any) => (
        <div className="flex items-center gap-2">
          <span className="font-bold">{item.stock}</span>
          <span className="text-xs text-slate-400">{item.unit}</span>
        </div>
      )
    },
    { 
      header: 'Valuation', 
      accessor: (item: any) => formatCurrency(item.value)
    },
    {
      header: 'Status',
      accessor: (item: any) => (
        <Badge variant={item.stock < 50 ? 'danger' : 'success'}>
          {item.stock < 50 ? 'Low Stock' : 'In Stock'}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stock Inventory Management</h2>
          <p className="text-slate-500">Real-time stock balance across all sites and plants</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Inventory</Button>
          <Button>Create Adjustment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Stock Value', value: '₹45,20,000', trend: '+12%' },
          { label: 'Low Stock Items', value: '08', trend: '-2' },
          { label: 'Active Sites', value: '05', trend: '0' },
          { label: 'GRNs This Month', value: '42', trend: '+15' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by item code or name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm"
            />
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm">
            <option>All Sites</option>
            <option>Site NH44</option>
            <option>Indore Plant</option>
          </select>
        </div>
        <DataTable columns={columns} data={stocks} />
      </div>
    </div>
  );
}

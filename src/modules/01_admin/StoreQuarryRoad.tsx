import { useState } from 'react';
import { Database, Plus, Map, Drill } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

export default function StoreQuarryRoad() {
  const [assets] = useState([
    { id: 'STR-01', site: 'Indore Plant', name: 'Main Spare Parts Store', type: 'STORE' },
    { id: 'QRY-22', site: 'Site NH44', name: 'Black Diamond Quarry', type: 'QUARRY' },
    { id: 'RD-101', site: 'Site NH44', name: 'Service Road - North', type: 'ROAD' },
  ]);

  const columns = [
    { header: 'Asset ID', accessor: 'id' as const, className: 'font-mono' },
    { header: 'Site', accessor: 'site' as const },
    { header: 'Entity Name', accessor: 'name' as const },
    { 
      header: 'Category', 
      accessor: (item: any) => (
        <div className="flex items-center gap-2">
          {item.type === 'STORE' && <Database className="w-3 h-3 text-blue-500" />}
          {item.type === 'QUARRY' && <Drill className="w-3 h-3 text-emerald-500" />}
          {item.type === 'ROAD' && <Map className="w-3 h-3 text-amber-500" />}
          <Badge variant={item.type === 'STORE' ? 'info' : item.type === 'QUARRY' ? 'success' : 'warning'}>
            {item.type}
          </Badge>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: () => <Button variant="ghost" size="sm">Manage</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Stores, Quarries & Roads</h2>
          <p className="text-slate-500 text-sm">Manage critical operational assets and inventory points</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <DataTable columns={columns} data={assets} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Users, Plus, Download, UserCheck } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

export default function EmployeeCreation() {
  const [employees] = useState([
    { id: 'EMP-001', name: 'John Doe', designation: 'Project Manager', dept: 'Operations', site: 'Site NH44', status: 'ACTIVE' },
    { id: 'EMP-002', name: 'Sarah Khan', designation: 'Site Engineer', dept: 'Civil', site: 'Site NH44', status: 'ACTIVE' },
    { id: 'EMP-003', name: 'Milan Roy', designation: 'Operator', dept: 'Machinery', site: 'Indore Plant', status: 'ON LEAVE' },
  ]);

  const columns = [
    { header: 'Emp Code', accessor: 'id' as const, className: 'font-mono tracking-tighter' },
    { 
      header: 'Employee Name', 
      accessor: (item: any) => (
        <div className="font-semibold text-slate-900">{item.name}</div>
      )
    },
    { header: 'Designation', accessor: 'designation' as const },
    { header: 'Site Assigned', accessor: 'site' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'ACTIVE' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'View',
      accessor: () => <Button variant="ghost" size="sm">Profile</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">Human Resources</h2>
          <p className="text-slate-500">Employee Master and Salary Structures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> ID Cards</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Employee</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <DataTable columns={columns} data={employees} />
      </div>
    </div>
  );
}

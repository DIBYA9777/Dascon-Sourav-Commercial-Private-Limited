import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';
import { Modal } from '@/src/components/Modal.tsx';
import { Site } from '@/src/types.ts';

export default function SitePlantBranch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      companyId: '1',
      name: 'Main Highway Project - NH44',
      type: 'PROJECT',
      location: 'Site A - Section 1',
    },
    {
      id: '2',
      companyId: '1',
      name: 'Indore RMC Plant',
      type: 'PLANT',
      location: 'Industrial Area',
    },
    {
      id: '3',
      companyId: '2',
      name: 'Bhubaneswar Branch',
      type: 'BRANCH',
      location: 'Sector 5',
    },
  ]);

  const [formData, setFormData] = useState<Partial<Site>>({
    name: '',
    type: 'PROJECT',
    companyId: '',
    location: ''
  });

  const handleSave = () => {
    setSites([...sites, { ...formData, id: Math.random().toString(36).substr(2, 9) } as Site]);
    setIsModalOpen(false);
  };

  const columns = [
    { 
      header: 'Site/Branch Name', 
      accessor: (item: Site) => (
        <div className="font-bold text-slate-900">{item.name}</div>
      )
    },
    { 
      header: 'Type', 
      accessor: (item: Site) => (
        <Badge variant={item.type === 'PROJECT' ? 'info' : item.type === 'PLANT' ? 'success' : 'warning'}>
          {item.type}
        </Badge>
      )
    },
    { 
      header: 'Company', 
      accessor: (item: Site) => (
        <span className="text-xs font-bold text-slate-500">
          {item.companyId === '1' ? 'Nway Construction' : 'Nway Infra'}
        </span>
      )
    },
    { header: 'Location', accessor: 'location' as const },
    {
      header: 'Actions',
      accessor: (item: Site) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Edit2 className="h-4 w-4" /></Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600"
            onClick={() => setSites(sites.filter(s => s.id !== item.id))}
          ><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Site & Branch Registry</h2>
          <p className="text-slate-500 text-sm">Define operational hubs, plants, and project boundaries within organizations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Site/Plant
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <DataTable columns={columns} data={sites} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish Site/Plant"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Entity</Button>
          </div>
        }
      >
        <div className="space-y-5">
           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Entity Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700" 
                placeholder="e.g. Site Zeta / RMC Plant B"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Registry Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as Site['type']})}
                >
                  <option value="PROJECT">Project</option>
                  <option value="PLANT">Plant</option>
                  <option value="BRANCH">Branch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assign to Company</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
                  value={formData.companyId}
                  onChange={e => setFormData({...formData, companyId: e.target.value})}
                >
                  <option value="">Select Company...</option>
                  <option value="1">Nway Construction Pvt Ltd</option>
                  <option value="2">Nway Infra Projects</option>
                </select>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Primary Location</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700" 
                placeholder="Region / City"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
           </div>
        </div>
      </Modal>
    </div>
  );
}

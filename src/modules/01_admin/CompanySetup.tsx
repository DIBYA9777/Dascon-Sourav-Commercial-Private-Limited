import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/src/components/DataTable.tsx';
import { Button } from '@/src/components/Button.tsx';
import { Modal } from '@/src/components/Modal.tsx';
import { Company } from '@/src/types.ts';

export default function CompanySetup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Dascon Saurav',
      code: 'DS',
      address: 'Plot 42, Dascon Towers, Bhubaneswar, Odisha',
      pan: 'DASCN1234S',
      gstin: '21DASCN1234S1Z5',
    },
    {
      id: '2',
      name: 'Nway Infra Projects',
      code: 'NIP',
      address: 'Block B, Sector 5, Bhubaneswar, Odisha',
      pan: 'FGHIJ5678K',
      gstin: '21FGHIJ5678K1Z2',
    },
  ]);

  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    code: '',
    pan: '',
    gstin: '',
    address: ''
  });

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingId(company.id);
      setFormData(company);
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '', pan: '', gstin: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setCompanies(companies.map(c => c.id === editingId ? { ...c, ...formData } as Company : c));
    } else {
      setCompanies([...companies, { ...formData, id: Math.random().toString(36).substr(2, 9) } as Company]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { 
      header: 'Company Name', 
      accessor: (item: Company) => (
        <div className="font-bold text-slate-900">{item.name}</div>
      )
    },
    { header: 'Code', accessor: 'code' as const, className: 'font-mono text-blue-600' },
    { header: 'GSTIN', accessor: 'gstin' as const },
    { 
      header: 'Address', 
      accessor: (item: Company) => (
        <span className="text-xs text-slate-500 truncate max-w-[200px] block">{item.address}</span>
      )
    },
    {
      header: 'Actions',
      accessor: (item: Company) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}><Edit2 className="h-4 w-4" /></Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500"
            onClick={() => setCompanies(companies.filter(c => c.id !== item.id))}
          ><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Master</h2>
          <p className="text-slate-500 text-sm">Create and manage legal entities across the ERP system</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Register Company
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <DataTable columns={columns} data={companies} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Update Company Details" : "Register New Company"}
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button onClick={handleSave}>{editingId ? "Update Company" : "Save Company"}</Button>
          </div>
        }
      >
        <div className="space-y-5">
           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Legal Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Code</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 font-mono text-sm" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">GST Number</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 font-mono text-sm" 
                  value={formData.gstin}
                  onChange={e => setFormData({...formData, gstin: e.target.value})}
                />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">PAN Number</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 font-mono text-sm" 
                value={formData.pan}
                onChange={e => setFormData({...formData, pan: e.target.value})}
              />
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Registered Address</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700" 
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              ></textarea>
           </div>
        </div>
      </Modal>
    </div>
  );
}

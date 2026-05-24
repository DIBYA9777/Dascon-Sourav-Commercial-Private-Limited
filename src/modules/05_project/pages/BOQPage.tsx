import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  History, 
  FileText, 
  AlertTriangle, 
  Compass,
  Building2,
  Lock,
  Unlock,
  PlusCircle,
  X
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, BOQ, BOQItem } from '../types';

export default function BOQPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [boq, setBoq] = useState<BOQ | null>(null);

  // New Item state
  const [isAdding, setIsAdding] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('Bag');
  const [newQty, setNewQty] = useState<number>(100);
  const [newRate, setNewRate] = useState<number>(350);

  // Editable row trackers
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editQty, setEditQty] = useState<number>(0);
  const [editRate, setEditRate] = useState<number>(0);

  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadBOQData();
    }
  }, [selectedProjectId]);

  const loadBOQData = () => {
    const existing = projectService.getBOQByProject(selectedProjectId);
    if (existing) {
      setBoq(existing);
    } else {
      // Build a fresh blank draft BOQ for the project so the user has immediate playground
      const proj = projectService.getProjectById(selectedProjectId);
      const code = proj ? proj.code : 'PRJ-000';
      const fallbackBOQ: BOQ = {
        id: `boq-${Date.now()}`,
        projectId: selectedProjectId,
        boqNo: `BOQ/${code}/01`,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        version: 1,
        totalAmount: 0,
        items: []
      };
      setBoq(fallbackBOQ);
    }
  };

  const calculateTotal = (items: BOQItem[]): number => {
    return items.reduce((sum, i) => sum + (Number(i.qty) * Number(i.rate)), 0);
  };

  const handleSaveBOQ = (updatedBOQ: BOQ) => {
    projectService.createOrUpdateBOQ(updatedBOQ);
    setBoq(updatedBOQ);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boq || !newDesc.trim()) return;

    const newItem: BOQItem = {
      id: `bi-${Date.now()}`,
      sNo: boq.items.length + 1,
      description: newDesc.trim(),
      unit: newUnit,
      qty: Number(newQty),
      rate: Number(newRate),
      amount: Number(newQty) * Number(newRate)
    };

    const nextItems = [...boq.items, newItem];
    const total = calculateTotal(nextItems);

    const updated: BOQ = {
      ...boq,
      items: nextItems,
      totalAmount: total
    };

    handleSaveBOQ(updated);
    setIsAdding(false);
    setNewDesc('');
    setNewUnit('Bag');
    setNewQty(0);
    setNewRate(0);
  };

  const handleDeleteItem = (id: string) => {
    if (!boq) return;

    const nextItems = boq.items.filter(i => i.id !== id).map((item, idx) => ({
      ...item,
      sNo: idx + 1
    }));
    const total = calculateTotal(nextItems);

    const updated: BOQ = {
      ...boq,
      items: nextItems,
      totalAmount: total
    };

    handleSaveBOQ(updated);
  };

  const selectRowForEdit = (item: BOQItem) => {
    if (boq?.status === 'Approved') return; // Readonly lock
    setEditingItemId(item.id);
    setEditDesc(item.description);
    setEditUnit(item.unit);
    setEditQty(item.qty);
    setEditRate(item.rate);
  };

  const handleSaveRowEdit = (id: string) => {
    if (!boq) return;

    const nextItems = boq.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          description: editDesc,
          unit: editUnit,
          qty: Number(editQty),
          rate: Number(editRate),
          amount: Number(editQty) * Number(editRate)
        };
      }
      return item;
    });

    const total = calculateTotal(nextItems);
    const updated: BOQ = {
      ...boq,
      items: nextItems,
      totalAmount: total
    };

    handleSaveBOQ(updated);
    setEditingItemId(null);
  };

  // Status transitions
  const transitionStatus = (status: BOQ['status']) => {
    if (!boq) return;
    const isNewRevision = status === 'Revised';
    const nextVersion = isNewRevision ? boq.version + 1 : boq.version;
    const nextBOQNo = isNewRevision 
      ? boq.boqNo.split('/v')[0] + `/v${nextVersion}` 
      : boq.boqNo;

    const updated: BOQ = {
      ...boq,
      status,
      version: nextVersion,
    };
    handleSaveBOQ(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">Estimates & BOQ Console</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Configure item quantities and baseline rates for accurate scheduling</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block">Select Project:</label>
          <select 
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black outline-none cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {boq && (
        <div className="space-y-6">
          {/* BOQ META CONTAINER */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col md:flex-row justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 rounded-md">
                  {boq.boqNo}
                </span>
                <span className={`inline-flex items-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  boq.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                  boq.status === 'Revised' ? 'bg-indigo-50 text-indigo-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {boq.status}
                </span>
                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                  VERSION {boq.version}.0
                </span>
              </div>

              <div>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Baseline Creation Date</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{boq.date}</p>
              </div>
            </div>

            {/* CONTROL PANEL */}
            <div className="flex flex-col sm:flex-row items-stretch justify-end gap-3 self-center sm:self-auto">
              {boq.status !== 'Approved' ? (
                <>
                  <button 
                    onClick={() => transitionStatus('Approved')}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Lock & Approve
                  </button>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add BOQ Item
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-black uppercase p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Lock className="w-3.5 h-3.5" /> Checked & Locked
                  </div>
                  <button 
                    onClick={() => transitionStatus('Revised')}
                    className="p-3 bg-indigo-650 hover:bg-indigo-750 text-indigo-700 bg-indigo-50 border border-indigo-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <History className="w-4 h-4" />
                    Open Revision (Revise BOQ)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TABLE OF ITEMS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider w-16">S.No</th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider md:w-96">Item Description</th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">UOM</th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Quantity</th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Rate (₹)</th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Amount (₹)</th>
                    {boq.status !== 'Approved' && (
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right w-24">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boq.items.length > 0 ? (
                    boq.items.map((item) => {
                      const isEditing = editingItemId === item.id;

                      if (isEditing) {
                        return (
                          <tr key={item.id} className="bg-blue-50/20">
                            <td className="p-4 text-xs font-black text-slate-400">{item.sNo}</td>
                            <td className="p-4">
                              <input 
                                type="text"
                                value={editDesc}
                                onChange={e => setEditDesc(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-1 px-2 font-bold text-xs"
                              />
                            </td>
                            <td className="p-4">
                              <select 
                                value={editUnit}
                                onChange={e => setEditUnit(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg p-1 text-xs"
                              >
                                <option value="Bag">Bag</option>
                                <option value="Ton">Ton</option>
                                <option value="Mtr">Mtr</option>
                                <option value="Sqm">Sqm</option>
                                <option value="Nos">Nos</option>
                                <option value="Cum">Cum</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <input 
                                type="number"
                                value={editQty}
                                onChange={e => setEditQty(Number(e.target.value))}
                                className="w-24 bg-white border border-slate-200 rounded-lg p-1 px-2 font-bold text-xs"
                              />
                            </td>
                            <td className="p-4">
                              <input 
                                type="number"
                                value={editRate}
                                onChange={e => setEditRate(Number(e.target.value))}
                                className="w-24 bg-white border border-slate-200 rounded-lg p-1 px-2 font-bold text-xs"
                              />
                            </td>
                            <td className="p-4 font-black text-xs text-slate-900">
                              ₹{(editQty * editRate).toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleSaveRowEdit(item.id)}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingItemId(null)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr 
                          key={item.id} 
                          className="hover:bg-slate-50/50 transition-colors"
                          onClick={() => selectRowForEdit(item)}
                        >
                          <td className="p-4 text-xs font-black text-slate-400">{item.sNo}</td>
                          <td className="p-4">
                            <p className="font-black text-slate-800 text-xs">{(item.description)}</p>
                          </td>
                          <td className="p-4 text-slate-500 font-bold text-xs">{item.unit}</td>
                          <td className="p-4 text-slate-800 font-bold text-xs">{item.qty.toLocaleString()}</td>
                          <td className="p-4 text-slate-800 font-bold text-xs">₹{item.rate.toLocaleString('en-IN')}</td>
                          <td className="p-4 font-black text-xs text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                          {boq.status !== 'Approved' && (
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => selectRowForEdit(item)}
                                  className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 hover:bg-rose-50 rounded text-slate-350 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400 text-xs font-semibold leading-relaxed">
                        No BOQ baseline items added. Click "Add BOQ Item" above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTALS BAR */}
            <div className="bg-slate-900 text-white p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase mb-0.5">Calculated Base BOQ Aggregate</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-extrabold italic">Total Amount (INR)</span>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                ₹{boq.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW / ADD BOQ ITEM */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsAdding(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5 text-blue-500" /> New Bill Item
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Reinforcement Bars Fe500"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit</label>
                  <select 
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  >
                    <option value="Bag">Bag</option>
                    <option value="Ton">Ton</option>
                    <option value="Mtr">Mtr</option>
                    <option value="Sqm">Sqm</option>
                    <option value="Nos">Nos</option>
                    <option value="Cum">Cum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={newQty}
                    onChange={e => setNewQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Baserate per Unit (₹)</label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={newRate}
                  onChange={e => setNewRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-black text-slate-400 text-2xs uppercase">Amount:</span>
                <span className="font-extrabold text-slate-800">
                  ₹{(newQty * newRate).toLocaleString('en-IN')}
                </span>
              </div>

              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Insert to BOQ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { RABill, Project } from '../types';
import { Trash2, Save, Edit3, ClipboardSignature, MessageSquare, Percent } from 'lucide-react';
import RABillHeader from '../components/RABillHeader';
import RABillTable from '../components/RABillTable';
import RABillTotalBar from '../components/RABillTotalBar';
import RABillApproval from '../components/RABillApproval';

interface RABillDetailPageProps {
  bill: RABill;
  project?: Project;
  userRole?: string;
  onBack: () => void;
  onUpdate: (updated: RABill) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string, status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected', remarks?: string) => void;
}

export default function RABillDetailPage({
  bill,
  project,
  userRole,
  onBack,
  onUpdate,
  onDelete,
  onApprove
}: RABillDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [clientName, setClientName] = useState(bill.clientName);
  const [date, setDate] = useState(bill.date);
  const [remarks, setRemarks] = useState(bill.remarks || '');
  const [gstRate, setGstRate] = useState(bill.gstRate ?? 18);
  const [items, setItems] = useState(bill.items);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `rbi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: '',
        amount: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'description' | 'amount', value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  const handleSaveEdits = () => {
    if (!clientName.trim()) {
      alert('Client Name is required.');
      return;
    }
    if (!date) {
      alert('Date is required.');
      return;
    }
    if (items.length === 0) {
      alert('At least one item is required.');
      return;
    }

    // Validate entries
    for (const item of items) {
      if (!item.description.trim()) {
        alert('Please fill out descriptions for all items.');
        return;
      }
    }

    const calculatedSubtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const calculatedGstAmount = Math.round((calculatedSubtotal * (Number(gstRate) || 0)) / 100);
    const calculatedGrandTotal = calculatedSubtotal + calculatedGstAmount;

    const updatedBill: RABill = {
      ...bill,
      clientName,
      date,
      remarks,
      gstRate: Number(gstRate) || 18,
      items,
      subtotal: calculatedSubtotal,
      gstAmount: calculatedGstAmount,
      grandTotal: calculatedGrandTotal
    };

    onUpdate(updatedBill);
    setIsEditing(false);
  };

  // Approval handlers
  const handleApproveAction = (memo?: string) => {
    onApprove(bill.id, 'Approved', memo);
  };

  const handleRejectAction = (memo?: string) => {
    onApprove(bill.id, 'Rejected', memo);
  };

  const derivedSubtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const derivedGstAmount = Math.round((derivedSubtotal * (Number(gstRate) || 0)) / 100);
  const derivedGrandTotal = derivedSubtotal + derivedGstAmount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left py-4 animate-in fade-in duration-300">
      {/* 1. Dynamic Header */}
      <RABillHeader
        clientName={isEditing ? clientName : bill.clientName}
        billNo={bill.billNo}
        date={isEditing ? date : bill.date}
        status={bill.status}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Bill Details, work items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black uppercase text-slate-800 tracking-tight">
                Bill Specifications & Client Details
              </h2>

              {bill.status === 'Submitted' && (
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveEdits();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    isEditing 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-705'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-3.5 h-3.5 text-emerald-450" /> Save Modifications
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit Invoice Particulars
                    </>
                  )}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Client Organisation / Agency Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Audit Comments & Progress Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white h-20 resize-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-0.5">
                      <Percent className="w-3 h-3" /> GST rate (%)
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                      <input
                        type="number"
                        value={gstRate}
                        onChange={(e) => setGstRate(Math.max(0, parseInt(e.target.value) || 0))}
                        className="bg-transparent text-[10px] font-black w-full focus:outline-none text-slate-800"
                        min="0"
                      />
                      <span className="text-[10px] text-slate-450 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Project Specification:</span>
                  <p className="font-bold text-[10px] text-slate-800 uppercase mt-0.5">{project?.name || 'Kolkata Highway Project Yard 1'}</p>
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Project Yard Code:</span>
                  <p className="font-bold text-[10px] text-slate-800 uppercase mt-0.5">[{project?.code || 'PRJ-001'}]</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Certified Audit Summary:</span>
                  <p className="text-[10px] font-medium text-slate-600 mt-1 leading-normal italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{bill.remarks || 'No specific remarks or site verification logs entered with this running client progress claim.'}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Table list of individual activities */}
          <RABillTable
            items={isEditing ? items : bill.items}
            isEditable={isEditing}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />

          {/* Bottom Grand Total Card */}
          <RABillTotalBar
            subtotal={isEditing ? derivedSubtotal : bill.subtotal}
            gstRate={isEditing ? gstRate : bill.gstRate}
            gstAmount={isEditing ? derivedGstAmount : bill.gstAmount}
            grandTotal={isEditing ? derivedGrandTotal : bill.grandTotal}
          />
        </div>

        {/* Right Column: Administrative Workflow & Sign-offs */}
        <div className="space-y-6">
          <RABillApproval
            status={bill.status}
            userRole={userRole}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
          />

          {/* Audit trail visualization */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight flex items-center gap-1.5">
              <ClipboardSignature className="w-4 h-4 text-slate-400" />
              Progress Audit Logs
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 text-xs items-start font-sans">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 ring-4 ring-emerald-50"></div>
                <div>
                  <p className="font-bold text-[10px] text-slate-800">Progress Bill Certified</p>
                  <p className="text-[9px] text-slate-400 font-medium">Submitted for client review on {bill.date}</p>
                </div>
              </div>

              {bill.status !== 'Submitted' && bill.status !== 'Draft' && (
                <div className="flex gap-3 text-xs items-start font-sans">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ring-4 ${
                    bill.status === 'Approved' ? 'bg-emerald-500 ring-emerald-50' : 'bg-rose-500 ring-rose-50'
                  }`}></div>
                  <div>
                    <p className="font-bold text-[10px] text-slate-850">
                      Settlement Stat Set: {bill.status}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">Logged securely into client-centric audit ledger.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Support deletions for Draft, Submitted, or Rejected bills */}
            {bill.status !== 'Approved' && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely certain you want to destroy this RA client bill? This deletion is permanent.')) {
                    onDelete(bill.id);
                  }
                }}
                className="w-full mt-2 py-2 px-3 text-[9px] font-black uppercase tracking-wider text-rose-605 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete Client Bill Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

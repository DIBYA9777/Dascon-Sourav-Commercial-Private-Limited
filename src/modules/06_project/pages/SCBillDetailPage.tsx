import React, { useState } from 'react';
import { SCBill, Project } from '../types';
import { Calendar, User, Eye, Edit3, Save, Trash2, ArrowLeft, ArrowUpRight, Check, X, ClipboardSignature } from 'lucide-react';
import SCBillHeader from '../components/SCBillHeader';
import SCBillTable from '../components/SCBillTable';
import SCBillTotalBar from '../components/SCBillTotalBar';
import SCBillApproval from '../components/SCBillApproval';

interface SCBillDetailPageProps {
  bill: SCBill;
  project?: Project;
  userRole?: string;
  onBack: () => void;
  onUpdate: (updated: SCBill) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
}

export default function SCBillDetailPage({
  bill,
  project,
  userRole,
  onBack,
  onUpdate,
  onDelete,
  onApprove
}: SCBillDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contractorName, setContractorName] = useState(bill.contractorName);
  const [date, setDate] = useState(bill.date);
  const [remarks, setRemarks] = useState(bill.remarks || '');
  const [items, setItems] = useState(bill.items);

  // Sync edits
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        activityName: '',
        completedQty: 0,
        rate: 0,
        unit: 'Mtr',
        amount: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: any, value: any) => {
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

  // Run dynamic update
  const handleSaveEdits = () => {
    if (!contractorName.trim()) {
      alert('Contractor name is required');
      return;
    }
    
    // Save
    const itemsWithAmounts = items.map(item => ({
      ...item,
      amount: (Number(item.completedQty) || 0) * (Number(item.rate) || 0)
    }));

    const totalAmount = itemsWithAmounts.reduce((sum, item) => sum + item.amount, 0);

    const updatedBill: SCBill = {
      ...bill,
      contractorName,
      date,
      remarks,
      items: itemsWithAmounts,
      totalAmount
    };

    onUpdate(updatedBill);
    setIsEditing(false);
  };

  const handleApproveAction = (cmt?: string) => {
    onApprove(bill.id, 'Approved', cmt);
  };

  const handleRejectAction = (cmt?: string) => {
    onApprove(bill.id, 'Rejected', cmt);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left py-4 animate-in fade-in duration-300">
      {/* 1. Header component */}
      <SCBillHeader
        contractorName={isEditing ? contractorName : bill.contractorName}
        billNo={bill.billNo}
        date={isEditing ? date : bill.date}
        status={bill.status}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Bill details, items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-105 pb-3">
              <h2 className="text-xs font-black uppercase text-slate-800 tracking-tight">
                Bill Specific Details & Scope
              </h2>

              {bill.status === 'Submitted' && (
                <button
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
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-3.5 h-3.5 text-emerald-400" /> Save Modifications
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5 text-slate-505" /> Edit Quantities
                    </>
                  )}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Contractor Name
                    </label>
                    <input
                      type="text"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Bill Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white h-20 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Project Scope:</span>
                  <p className="font-bold text-[10px] text-slate-800 uppercase mt-0.5">{project?.name || 'Kolkata Highway Project Workspace'}</p>
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Client Org:</span>
                  <p className="font-bold text-[10px] text-slate-800 uppercase mt-0.5">{project?.client || 'PWD-WB Authority'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Verification Remarks:</span>
                  <p className="text-[10px] font-medium text-slate-600 mt-1 leading-normal italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{bill.remarks || 'No detailed verification remarks included with the payout invoice.'}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Table Line list */}
          <SCBillTable
            items={isEditing ? items : bill.items}
            isEditable={isEditing}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />

          {/* Total Sum Bar */}
          <SCBillTotalBar totalAmount={isEditing ? items.reduce((sum, item) => sum + (Number(item.completedQty) * Number(item.rate)), 0) : bill.totalAmount} />
        </div>

        {/* Right Column: Flow, approvals, log actions */}
        <div className="space-y-6">
          {/* Approval box */}
          <SCBillApproval
            status={bill.status}
            userRole={userRole}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
          />

          {/* Audit trail card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight flex items-center gap-1.5">
              <ClipboardSignature className="w-4 h-4 text-slate-400" />
              Certificate Audit Trial
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 text-xs items-start font-sans">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 ring-4 ring-emerald-50"></div>
                <div>
                  <p className="font-bold text-[10px] text-slate-800">Bill Raised Successfully</p>
                  <p className="text-[9px] text-slate-400 font-medium">By {bill.contractorName} on {bill.date}</p>
                </div>
              </div>

              {bill.status !== 'Submitted' && (
                <div className="flex gap-3 text-xs items-start font-sans">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ring-4 ${
                    bill.status === 'Approved' ? 'bg-emerald-500 ring-emerald-50' : 'bg-rose-500 ring-rose-50'
                  }`}></div>
                  <div>
                    <p className="font-bold text-[10px] text-slate-850">
                      Authority Status Set to: {bill.status}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">Logged securely with cryptographic ledger signature.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Optional deletion if Submitted */}
            {bill.status === 'Submitted' && (
              <button
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete this Contractor Bill? This is irreversible.')) {
                    onDelete(bill.id);
                  }
                }}
                className="w-full mt-2 py-2 px-3 text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete Bill Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

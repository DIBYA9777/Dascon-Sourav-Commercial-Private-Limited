import React from 'react';
import { ACPosting, Project } from '../types';
import { FileClock, Info, ShieldAlert, ArrowLeft } from 'lucide-react';
import ACPostingHeader from '../components/ACPostingHeader';
import AccountingTable from '../components/AccountingTable';
import ACTotalRow from '../components/ACTotalRow';
import PostButton from '../components/PostButton';

interface ACPostingDetailPageProps {
  posting: ACPosting;
  project?: Project;
  onBack: () => void;
  onPost: (id: string) => void;
  onUnpost: (id: string) => void;
}

export default function ACPostingDetailPage({
  posting,
  project,
  onBack,
  onPost,
  onUnpost
}: ACPostingDetailPageProps) {
  const isBalanced = posting.debitTotal === posting.creditTotal && posting.debitTotal > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left py-4 animate-in fade-in duration-300">
      
      {/* 1. Dynamic Accounting Header */}
      <ACPostingHeader
        referenceType={posting.referenceType}
        referenceNo={posting.referenceNo}
        date={posting.date}
        status={posting.status}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Ledger Specifications & Table entries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-850 tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Info className="w-4 h-4 text-emerald-600" /> Vouchers & Reference Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
              <div>
                <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider block">
                  Reference Unit / Yard
                </span>
                <p className="font-bold text-[10.5px] text-slate-800 uppercase mt-0.5">
                  {project?.name || 'Kolkata Highway Project Yard 1'}
                </p>
              </div>

              <div>
                <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider block">
                  Project Code Identification
                </span>
                <p className="font-mono font-bold text-[10.5px] text-indigo-700 mt-0.5">
                  [{project?.code || 'PRJ-001'}]
                </p>
              </div>

              <div className="md:col-span-2">
                <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider block">
                  Accounting Event Narratives & Remarks
                </span>
                <p className="text-[10px] font-bold text-slate-600 mt-1 leading-normal italic bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase tracking-tight">
                  "{posting.remarks || 'No automatic audit ledger explanations logged.'}"
                </p>
              </div>
            </div>
          </div>

          {/* 2. List of Double-Entry Ledger Mappings */}
          <AccountingTable entries={posting.items} />

          {/* 3. Debit & Credit Totals Balancing compliance indicator */}
          <ACTotalRow debitTotal={posting.debitTotal} creditTotal={posting.creditTotal} />
        </div>

        {/* Right column: Post administrative controllers / Action Logs */}
        <div className="space-y-6 col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight">
              Administrative Control Action
            </h3>

            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Confirming ledger alignment is a non-reversible baseline. Posted logs transmit automatically to primary fiscal registers.
            </p>

            <PostButton
              status={posting.status}
              isBalanced={isBalanced}
              onPost={() => onPost(posting.id)}
              onUnpost={() => onUnpost(posting.id)}
            />
          </div>

          {/* Timeline of events block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight flex items-center gap-1.5">
              <FileClock className="w-4 h-4 text-emerald-600" />
              Journal Posting Timeline logs
            </h3>

            <div className="space-y-4 border-l-2 border-slate-50 pl-4 ml-2 my-2">
              <div className="relative text-xs font-sans">
                <div className="absolute -left-[21px] top-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="font-bold text-[10px] text-slate-800 uppercase">Journal Mapping Compiled</p>
                  <p className="text-[9px] text-slate-400 font-medium">Mapped automatically from bill record calculations.</p>
                </div>
              </div>

              {posting.status === 'Posted' && (
                <div className="relative text-xs font-sans">
                  <div className="absolute -left-[21px] top-1 w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-emerald-55/25"></div>
                  <div>
                    <p className="font-bold text-[10px] text-emerald-600 uppercase">Voucher Posted Status Verified</p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Finalized on {posting.postedAt ? new Date(posting.postedAt).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

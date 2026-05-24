import React from 'react';
import { Check, ClipboardSignature, Lock, Unlock } from 'lucide-react';

interface PostButtonProps {
  status: 'Pending' | 'Posted';
  isBalanced: boolean;
  onPost: () => void;
  onUnpost: () => void;
}

export default function PostButton({
  status,
  isBalanced,
  onPost,
  onUnpost
}: PostButtonProps) {
  const isPosted = status === 'Posted';

  if (isPosted) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to un-post this entry? It will pull the values out from general journal audit ledgers.')) {
              onUnpost();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-rose-600 hover:text-white text-white transition-all cursor-pointer shadow-md shadow-emerald-200/50"
          title="Click to Unpost Transaction"
        >
          <Check className="w-4 h-4 text-emerald-100" />
          Passed to Accounts
        </button>
        <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest text-center">
          Transaction is Passed and Posted. Click button above to Un-post.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={!isBalanced}
      onClick={() => {
        if (confirm('Confirm ledger posting? This will securely record the double-entry accounting configurations.')) {
          onPost();
        }
      }}
      className={`w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${
        isBalanced
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-98 shadow-emerald-200/50'
          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
      }`}
    >
      {isBalanced ? (
        <>
          <Check className="w-4 h-4 text-emerald-100" />
          Pass & Post Entry securely
        </>
      ) : (
        <>
          <Lock className="w-4 h-4 text-slate-400" />
          Unbalanced: Pass locked
        </>
      )}
    </button>
  );
}

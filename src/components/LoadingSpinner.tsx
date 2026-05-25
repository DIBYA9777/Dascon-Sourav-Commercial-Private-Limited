import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-900 animate-spin" />
        
        {/* Inner Ring (Counter-rotating) */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-rose-600 animate-spin [animation-duration:0.8s] [animation-direction:reverse]" />
      </div>
      
      <div className="mt-6 text-center space-y-1 animate-pulse">
        <p className="text-[10px] font-black text-blue-900 tracking-[0.3em] uppercase leading-none italic">
          Dascon Sourav
        </p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Securing Access & Loading Modules...
        </p>
      </div>
    </div>
  );
}

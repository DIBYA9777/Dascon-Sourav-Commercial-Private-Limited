import React from 'react';
import { cn } from '@/src/lib/utils.ts';
import logo from "../assets/logo.jpeg"

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
    <img 
      src={logo}
      alt="DSCPL Logo" 
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
    <div className="relative w-full h-full flex-col items-center justify-center" style={{ display: 'none' }}>
      {/* Recreating the DSCPL Triangle Logo (Fallback) */}
      <div className="relative w-[75%] aspect-square flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-blue-900" 
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        <div 
          className="absolute inset-[12%] bg-rose-600" 
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
      </div>
      <div className="text-[16%] font-black text-blue-900 tracking-[0.25em] mt-1 leading-none text-center">D S C P L</div>
    </div>
  </div>
);

export const LogoWithText = () => (
  <div className="flex items-center gap-2">
    <Logo className="w-10 h-10" />
    <div className="flex flex-col">
      <h1 className="text-[10px] font-black text-blue-900 tracking-tight leading-[1] uppercase">
        Dascon Sourav Commercial<br/>Private Limited
      </h1>
      <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mt-0.5 italic">
        Engineers and Contractors
      </p>
    </div>
  </div>
);

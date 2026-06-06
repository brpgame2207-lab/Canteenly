import React from 'react';
import { ChevronDown } from 'lucide-react';

export const AdminTopNav = () => {
  return (
    <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 px-8 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-xl transition-all">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand to-brand-light p-[1px]">
            <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=000000&color=ffffff" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white leading-tight">Admin Master</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Super Admin</p>
          </div>
          <ChevronDown size={14} className="text-neutral-500 ml-1" />
        </button>
      </div>
    </header>
  );
};

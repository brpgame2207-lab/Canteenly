import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export const AdminTopNav = () => {
  return (
    <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Search orders, users, or food items..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-wider">System Live</span>
        </div>

        <button className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand border-2 border-black" />
        </button>

        <div className="h-8 w-px bg-white/10 mx-2" />

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

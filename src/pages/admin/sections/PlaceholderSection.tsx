import React from 'react';
import { motion } from 'motion/react';
import { Construction } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export const PlaceholderSection = ({ title, description }: PlaceholderSectionProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-3xl max-w-2xl w-full text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-light/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-brand">
          <Construction size={40} />
        </div>
        
        <h2 className="font-display text-3xl font-bold text-white mb-3 tracking-tight">{title}</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          {description} This module is currently a high-fidelity placeholder ready to be populated with data.
        </p>
        
        <div className="flex justify-center gap-4">
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">
            View Documentation
          </button>
          <button className="bg-brand hover:bg-brand-light text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            Initialize Module
          </button>
        </div>
      </motion.div>
    </div>
  );
};

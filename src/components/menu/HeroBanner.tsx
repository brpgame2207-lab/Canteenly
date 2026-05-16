import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Timer } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] mb-12 glass-card border-white/10 group cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-black to-black opacity-80" />
      
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-brand/30 transition-colors duration-700" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-brand" />
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Today's Special</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
              Student Combo
            </span>
          </h1>
          
          <p className="text-neutral-400 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
            Peri Peri Fries, Classic Veg Burger, and a Cold Coffee. Fuel your late-night study sessions.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="premium-gradient shadow-[0_0_40px_rgba(255,107,0,0.3)] rounded-full px-8">
              Order Now @ ₹199
            </Button>
            <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium bg-white/5 px-4 py-3 rounded-full border border-white/10">
              <Timer size={16} className="text-yellow-500" />
              <span>Ends in 02:14:59</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-64 sm:h-80 lg:h-96 w-full flex items-center justify-center">
          {/* Abstract background shapes for the image */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 border border-brand/20 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-80 h-80 border border-white/5 rounded-full"
          />
          
          {/* Main Image */}
          <motion.img 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=1000&auto=format&fit=crop" 
            alt="Burger Combo"
            className="relative z-10 w-full max-w-sm object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl"
          />
          
          {/* Floating discount badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute top-10 right-10 z-20 bg-white text-black font-black px-4 py-2 rounded-xl shadow-2xl rotate-12"
          >
            SAVE 30%
          </motion.div>
        </div>
      </div>
    </div>
  );
};

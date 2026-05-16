import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EmptyCartState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className="relative mb-8 group cursor-default">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-brand/20 blur-[60px] rounded-full group-hover:bg-brand/30 transition-colors duration-700" />
        
        {/* Animated Icon Container */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-32 w-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl"
        >
          <ShoppingBag className="text-neutral-500 group-hover:text-brand transition-colors duration-500" size={48} />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center"
          >
            <Search size={14} className="text-neutral-400" />
          </motion.div>
        </motion.div>
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
        Your cart feels lonely
      </h2>
      <p className="text-neutral-400 mb-10 max-w-sm mx-auto text-sm md:text-base leading-relaxed">
        Hungry? Discover our premium campus menu and add some delicious meals here.
      </p>

      <Link to="/menu">
        <Button size="lg" className="group premium-gradient shadow-[0_0_30px_rgba(255,107,0,0.2)] hover:shadow-[0_0_50px_rgba(255,107,0,0.4)] rounded-full px-8 h-14 transition-all duration-300">
          Explore Menu
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
        </Button>
      </Link>
    </motion.div>
  );
};

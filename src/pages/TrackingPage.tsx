import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, Package, Utensils, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export const TrackingPage = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [
    { label: 'Order Confirmed', description: 'Canteen is verifying your order', icon: CheckCircle2 },
    { label: 'Preparing', description: 'Chef is preparing your delicious meal', icon: Utensils },
    { label: 'Ready for Pickup', description: 'Order ready at Counter 4', icon: Package },
    { label: 'Completed', description: 'Enjoy your meal!', icon: CheckCheck },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
      <div className="relative mb-12">
         {/* Animated Ring */}
         <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="h-40 w-40 rounded-full border border-brand/50 bg-brand/5"
            />
         </div>
         <div className="relative mx-auto h-32 w-32 rounded-full premium-gradient flex items-center justify-center shadow-2xl shadow-brand/40">
             <motion.div
               key={statusIndex}
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-white"
             >
                {React.createElement(statuses[statusIndex].icon, { size: 48 })}
             </motion.div>
         </div>
      </div>

      <div className="mb-12">
         <h1 className="text-3xl font-bold text-white mb-2">{statuses[statusIndex].label}</h1>
         <p className="text-neutral-400">{statuses[statusIndex].description}</p>
      </div>

      <div className="glass-card p-6 rounded-3xl mb-12">
         <div className="flex justify-between items-center mb-8">
            <div className="text-left">
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Token Number</p>
               <h2 className="text-2xl font-bold text-brand">CN-842</h2>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Estimated Wait</p>
               <div className="flex items-center gap-2 text-white font-bold">
                  <Clock size={16} className="text-brand" />
                  <span>8 mins</span>
               </div>
            </div>
         </div>

         {/* Steps Visual */}
         <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 -z-10" />
            <motion.div 
               className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 -z-10"
               initial={{ width: '0%' }}
               animate={{ width: `${(statusIndex / (statuses.length - 1)) * 100}%` }}
               transition={{ duration: 1 }}
            />
            
            {statuses.map((_, i) => (
               <div 
                  key={i}
                  className={cn(
                    "h-4 w-4 rounded-full border-4 transition-colors duration-500",
                    i <= statusIndex ? "bg-brand border-black" : "bg-neutral-800 border-black"
                  )}
               />
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Button variant="outline" className="rounded-2xl">Help Center</Button>
         <Button variant="secondary" className="rounded-2xl">Download Receipt</Button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';

export const SmartAddons = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const addons = [
    { id: 'addon_1', name: 'Extra Chutney', price: 10, image: 'https://images.unsplash.com/photo-1627308595229-7830f5c92f70?q=80&w=200&auto=format&fit=crop' },
    { id: 'addon_2', name: 'Cold Coffee', price: 60, image: 'https://images.unsplash.com/photo-1461023058943-070802277fe7?q=80&w=200&auto=format&fit=crop' },
    { id: 'addon_3', name: 'Peri Peri Fries', price: 80, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=200&auto=format&fit=crop' },
    { id: 'addon_4', name: 'Brownie', price: 50, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=200&auto=format&fit=crop' },
  ];

  const handleAdd = (addon: any) => {
    addToCart({ ...addon, quantity: 1, isVeg: true, prepTime: 2, spiceLevel: 0, rating: 4.5, reviewsCount: 100 });
    setAddedItems(prev => ({ ...prev, [addon.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [addon.id]: false }));
    }, 2000);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-yellow-500" />
        <h3 className="text-lg font-display font-bold text-white">Frequently Added Together</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
        {addons.map((addon) => {
          const isAdded = addedItems[addon.id];
          return (
            <motion.div 
              key={addon.id}
              whileHover={{ y: -4 }}
              className="min-w-[140px] glass-card rounded-[1.5rem] p-3 border border-white/5 flex flex-col gap-2 shrink-0 group"
            >
              <div className="h-20 w-full rounded-xl overflow-hidden relative">
                <img src={addon.image} alt={addon.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{addon.name}</h4>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-black text-brand">₹{addon.price}</span>
                  <button 
                    onClick={() => handleAdd(addon)}
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center transition-colors shadow-lg",
                      isAdded ? "bg-green-500 text-white" : "bg-white/10 text-neutral-300 hover:bg-brand hover:text-white"
                    )}
                  >
                    {isAdded ? <Check size={12} /> : <Plus size={12} />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

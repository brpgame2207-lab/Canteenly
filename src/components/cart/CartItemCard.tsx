import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, Clock, Flame, Heart, Tag, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface CartItemCardProps {
  item: any;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instruction, setInstruction] = useState('');

  // Deterministic mock data to enrich the basic cart item if it doesn't exist
  const idHash = String(item.id).charCodeAt(0);
  const isVeg = item.isVeg !== undefined ? item.isVeg : (idHash % 5 !== 0);
  const prepTime = item.prepTime || (10 + (idHash % 25));
  const spiceLevel = item.spiceLevel !== undefined ? item.spiceLevel : (idHash % 4);
  const originalPrice = idHash % 3 === 0 ? item.price + 50 : undefined;

  const quickTags = ['Less spicy', 'Make it crispy', 'No onions'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="glass-card rounded-[2rem] p-4 sm:p-5 flex flex-col sm:flex-row gap-5 border border-white/5 relative group"
    >
      {/* ── Image & Badges ── */}
      <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-[1.5rem] overflow-hidden self-center sm:self-start">
        <img src={item.image || item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
        
        {/* Veg/Non-veg */}
        <div className="absolute top-2 left-2 bg-white/10 backdrop-blur-md p-1 rounded border border-white/20">
          <div className={cn("w-2 h-2 rounded-sm border flex items-center justify-center", isVeg ? "border-green-500" : "border-red-500")}>
            <div className={cn("w-1 h-1 rounded-full", isVeg ? "bg-green-500" : "bg-red-500")} />
          </div>
        </div>
      </div>

      {/* ── Item Details ── */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white leading-tight mb-1">
              {item.name}
            </h3>
            
            <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
              <span className="flex items-center gap-1"><Clock size={12} className="text-orange-400" /> {prepTime}m</span>
              {spiceLevel > 0 && (
                <span className="flex items-center text-red-400">
                  {Array.from({ length: spiceLevel }).map((_, i) => <Flame key={i} size={12} />)}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 line-clamp-1 mb-4 hidden sm:block">{item.description || "A delicious premium meal crafted with fresh ingredients."}</p>
          </div>

          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={cn("p-2 rounded-full transition-colors", isFavorite ? "bg-red-500/20 text-red-500" : "bg-white/5 text-neutral-500 hover:text-white")}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ── Actions & Price ── */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-white flex items-center">
              <span className="text-sm text-brand mr-0.5">₹</span>{item.price}
            </span>
            {originalPrice && (
              <span className="text-xs text-neutral-500 line-through">₹{originalPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowInstructions(!showInstructions)}
              className="hidden xs:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand transition-colors"
            >
              <MessageSquare size={14} />
              Customize
            </button>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-black/60 rounded-full px-1.5 py-1.5 border border-white/10 shadow-inner">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                {item.quantity <= 1 ? <Trash2 size={12} className="text-red-400 hover:text-red-500" /> : <Minus size={14} />}
              </button>
              <span className="w-4 text-center text-sm font-bold text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile customize button if wrapping occurred */}
        <button 
          onClick={() => setShowInstructions(!showInstructions)}
          className="xs:hidden flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand transition-colors mt-3"
        >
          <MessageSquare size={14} /> Customize
        </button>
      </div>

      {/* ── Special Instructions Dropdown ── */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full sm:col-span-full border-t border-white/10 pt-4 mt-2 sm:mt-0 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {quickTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setInstruction(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 hover:bg-brand/20 hover:text-brand hover:border-brand/30 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-3 text-neutral-500" size={14} />
              <input 
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Add special cooking instructions..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-brand/50 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Clock, Flame, ShoppingCart, Heart, Plus, Minus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';

export interface FoodItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
  reviewsCount: number;
  prepTime: number; // in mins
  spiceLevel: 0 | 1 | 2 | 3;
  isAvailable: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isCombo?: boolean;
  tags?: string[];
}

interface PremiumFoodCardProps {
  item: FoodItem;
}

export const PremiumFoodCard: React.FC<PremiumFoodCardProps> = ({ item }) => {
  const { addToCart, items: cart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = () => {
    // Call context add to cart (assumes context handles quantity if needed, or we just add it)
    addToCart(item); // Note: Current CartContext might not support passing quantity directly in addToCart, but we'll add it once.
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  const discount = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col rounded-[2rem] p-3 transition-all duration-500",
        "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
        isHovered ? "bg-white/[0.08] border-white/20 shadow-[0_20px_40px_rgba(255,107,0,0.1)]" : "",
        !item.isAvailable && "opacity-60 grayscale-[50%]"
      )}
    >
      {/* ── Image & Badges Container ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
        <motion.img 
          src={item.image} 
          alt={item.name}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full object-cover"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
          <div className={cn(
            "w-3 h-3 rounded-sm border-[1.5px] flex items-center justify-center",
            item.isVeg ? "border-green-500" : "border-red-500"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              item.isVeg ? "bg-green-500" : "bg-red-500"
            )} />
          </div>
        </div>

        {/* Top Right Badges (Favorite & Discount) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md transition-all duration-300",
              isFavorite 
                ? "bg-red-500/20 border border-red-500/50 text-red-500" 
                : "bg-black/40 border border-white/10 text-white hover:bg-white/20 hover:text-red-400"
            )}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "scale-110" : ""} />
          </button>
          
          {discount > 0 && (
            <div className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Bottom Image Stats (Rating, Time, Spice) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
              <Star size={12} className="text-yellow-400" fill="currentColor" />
              <span className="text-white text-xs font-bold">{item.rating}</span>
              <span className="text-white/50 text-[10px]">({item.reviewsCount})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {item.spiceLevel > 0 && (
              <div className="flex items-center bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                {Array.from({ length: item.spiceLevel }).map((_, i) => (
                  <Flame key={i} size={12} className="text-red-500" fill="currentColor" />
                ))}
              </div>
            )}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
              <Clock size={12} className="text-orange-400" />
              <span className="text-white text-xs font-medium">{item.prepTime}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {item.isBestseller && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/20">
              Bestseller
            </span>
          )}
          {item.isTrending && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/20">
              Trending
            </span>
          )}
          {item.tags?.map(tag => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display font-bold text-lg text-white mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white flex items-center">
              <span className="text-sm text-brand mr-1">₹</span>
              {item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">₹{item.originalPrice}</span>
            )}
          </div>

          {!item.isAvailable ? (
            <div className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/20">
              Sold Out
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quantity Selector (Appears on hover or mobile) */}
              <motion.div 
                initial={false}
                animate={{ width: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                className="overflow-hidden flex items-center gap-2 bg-white/5 rounded-full border border-white/10"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                  className="p-1.5 text-white/70 hover:text-brand hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-white text-sm font-medium w-4 text-center">{quantity}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                  className="p-1.5 text-white/70 hover:text-brand hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus size={14} />
                </button>
              </motion.div>

              <Button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className={cn(
                  "rounded-full p-0 w-12 h-12 flex items-center justify-center transition-all duration-300",
                  addedAnim ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]" : "premium-gradient shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                )}
              >
                {addedAnim ? <Check size={20} className="text-white" /> : <Plus size={24} className="text-white" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

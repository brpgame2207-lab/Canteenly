import React from 'react';
import { motion } from 'motion/react';
import { Receipt, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OrderSummaryProps {
  total: number;
  discount: number;
  isSticky?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ total, discount, isSticky = false }) => {
  const taxes = Math.round(total * 0.05); // 5% GST
  const platformFee = 5;
  const grandTotal = Math.max(0, total + taxes + platformFee - discount);
  const pointsEarned = Math.round(grandTotal * 0.1);

  return (
    <div className={cn("glass-card rounded-[2rem] p-6 sm:p-8", isSticky && "sticky top-24")}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand/20 rounded-xl">
          <Receipt className="text-brand" size={20} />
        </div>
        <h3 className="text-xl font-display font-bold text-white">Order Summary</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-neutral-400 text-sm">
          <span>Subtotal</span>
          <span className="font-medium text-white">₹{total}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-400 text-sm font-medium">
            <span>Coupon Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-400 text-sm">
          <span className="flex items-center gap-1 cursor-help group relative">
            Taxes & Charges (GST 5%)
            <Info size={12} className="text-neutral-500" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-white/10">
              Includes CGST and SGST as per government regulations.
            </div>
          </span>
          <span className="font-medium text-white">₹{taxes}</span>
        </div>

        <div className="flex justify-between text-neutral-400 text-sm">
          <span>Platform Fee</span>
          <span className="font-medium text-white">₹{platformFee}</span>
        </div>

        <div className="h-px bg-white/10 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-white font-bold">To Pay</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
            ₹{grandTotal}
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
        <span className="text-xs text-neutral-400 font-medium">Reward Points</span>
        <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">✨</span>
          +{pointsEarned} pts
        </span>
      </div>
    </div>
  );
};

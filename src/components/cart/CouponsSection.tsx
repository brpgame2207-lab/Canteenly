import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Tag, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface CouponsSectionProps {
  appliedCoupon: string | null;
  setAppliedCoupon: (coupon: string | null) => void;
  setDiscount: (amount: number) => void;
}

export const CouponsSection: React.FC<CouponsSectionProps> = ({ appliedCoupon, setAppliedCoupon, setDiscount }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  const offers = [
    { code: 'STUDENT50', desc: 'Flat ₹50 off on orders above ₹200', amount: 50 },
    { code: 'COMBO20', desc: 'Save 20% on any combos', amount: 30 }
  ];

  const handleApply = (code: string) => {
    const offer = offers.find(o => o.code === code);
    if (offer || code === 'TEST10') {
      const discountAmt = offer ? offer.amount : 10;
      setAppliedCoupon(code);
      setDiscount(discountAmt);
      setError('');
      setInputCode('');
    } else {
      setError('Invalid coupon code');
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <Ticket className="text-blue-400" size={20} />
        </div>
        <h3 className="text-xl font-display font-bold text-white">Coupons & Offers</h3>
      </div>

      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={24} />
              <div>
                <p className="text-green-400 font-bold text-sm">'{appliedCoupon}' applied</p>
                <p className="text-neutral-400 text-xs">You saved money on this order!</p>
              </div>
            </div>
            <button 
              onClick={handleRemove}
              className="text-neutral-400 hover:text-red-400 transition-colors p-2"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative flex items-center">
              <input 
                type="text"
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Enter coupon code"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-24 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand/50 transition-all uppercase"
              />
              <Button 
                size="sm" 
                onClick={() => handleApply(inputCode)}
                disabled={!inputCode}
                className="absolute right-2 h-8 px-4 text-xs font-bold rounded-lg"
              >
                Apply
              </Button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

            <div className="space-y-3 mt-6">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Available Offers</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offers.map(offer => (
                  <button 
                    key={offer.code}
                    onClick={() => handleApply(offer.code)}
                    className="flex flex-col items-start bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand/30 transition-all rounded-xl p-4 text-left group"
                  >
                    <span className="flex items-center gap-1.5 text-brand font-bold text-sm mb-1 group-hover:scale-105 transition-transform">
                      <Tag size={14} /> {offer.code}
                    </span>
                    <span className="text-xs text-neutral-400">{offer.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

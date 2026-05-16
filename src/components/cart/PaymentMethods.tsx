import React from 'react';
import { Wallet, Smartphone, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export type PaymentMethod = 'upi' | 'wallet' | 'cash';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  setSelectedMethod: (method: PaymentMethod) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, setSelectedMethod }) => {
  const methods = [
    { id: 'wallet', name: 'Campus Wallet', icon: Wallet, balance: '₹450' },
    { id: 'upi', name: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe' },
    { id: 'cash', name: 'Cash', icon: Banknote, desc: 'Pay at counter' },
  ] as const;

  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8 mt-6">
      <h3 className="text-xl font-display font-bold text-white mb-6">Payment Method</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as PaymentMethod)}
              className={cn(
                "relative flex items-center p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden group",
                isSelected 
                  ? "bg-brand/10 border-brand/50 shadow-[0_0_20px_rgba(255,107,0,0.1)]" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
            >
              {/* Animated background glow for selected state */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand/0 via-brand/5 to-brand/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              )}
              
              <div className={cn(
                "p-3 rounded-xl mr-4 transition-colors",
                isSelected ? "bg-brand/20 text-brand" : "bg-black/40 text-neutral-400 group-hover:text-white"
              )}>
                <Icon size={20} />
              </div>
              
              <div>
                <h4 className={cn("text-sm font-bold", isSelected ? "text-brand" : "text-white")}>
                  {method.name}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {method.balance || method.desc}
                </p>
              </div>

              {/* Radio Circle */}
              <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-neutral-600">
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-neutral-500 uppercase tracking-widest bg-white/5 py-2 rounded-xl border border-white/5">
        <ShieldCheck size={14} className="text-green-500" />
        100% Secure Transaction
      </div>
    </div>
  );
};

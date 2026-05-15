import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Wallet, Smartphone, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const CartPage = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-neutral-900 flex items-center justify-center mb-8 border border-white/5">
           <ShoppingBag className="text-neutral-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Your bag is empty</h1>
        <p className="text-neutral-400 mb-10 max-w-sm mx-auto">Hungry? Add some delicious meals from the menu to see them here.</p>
        <Link to="/menu">
          <Button size="lg">Explore Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
         <h1 className="text-4xl font-bold text-white">Your Selection</h1>
         <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="h-24 w-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-brand font-medium">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-brand transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-brand transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-500 hover:text-red-500 rounded-2xl"
                >
                  <Trash2 size={18} />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl sticky top-24">
             <h3 className="text-xl font-bold text-white mb-8">Order Summary</h3>
             <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-400 text-sm">
                   <span>Subtotal</span>
                   <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-sm">
                   <span>Preparation Charge</span>
                   <span>₹15</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-sm">
                   <span>Student Discount</span>
                   <span className="text-green-500">-₹5</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between text-white font-bold text-xl">
                   <span>Total</span>
                   <span>₹{total + 10}</span>
                </div>
             </div>

             <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Payment Method</h4>
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <button className="glass-card p-4 rounded-2xl border-brand/50 bg-brand/10 flex flex-col items-center gap-2">
                       <Wallet className="text-brand" size={20} />
                       <span className="text-[10px] font-bold uppercase">Wallet</span>
                   </button>
                   <button className="glass-card p-4 rounded-2xl border-white/5 bg-white/5 flex flex-col items-center gap-2">
                       <Smartphone className="text-neutral-400" size={20} />
                       <span className="text-[10px] font-bold uppercase text-neutral-400">UPI</span>
                   </button>
                </div>

                <Link to="/tracking">
                   <Button size="lg" className="w-full h-14" onClick={() => clearCart()}>
                      Checkout
                      <ArrowRight className="ml-2" size={18} />
                   </Button>
                </Link>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-neutral-500 uppercase tracking-widest">
                   <ShieldCheck size={14} className="text-green-500" />
                   Secure Campus Payment
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { ShoppingBag } from 'lucide-react';

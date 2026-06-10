import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Wallet, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';

// Modular Components
import { CartItemCard } from '../components/cart/CartItemCard';
import { OrderSummary } from '../components/cart/OrderSummary';
import { CouponsSection } from '../components/cart/CouponsSection';
import { PaymentMethods, PaymentMethod } from '../components/cart/PaymentMethods';
import { SmartAddons } from '../components/cart/SmartAddons';
import { EmptyCartState } from '../components/cart/EmptyCartState';

export const CartPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    const token = localStorage.getItem('canteenly_token');
    try {
      // 1. Synchronize the client's React cart to Supabase
      const syncRes = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      const syncData = await syncRes.json();
      if (!syncData.success) {
        console.error("Cart synchronization failed");
        setIsCheckingOut(false);
        return;
      }

      // 2. Place the order on the backend
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const orderData = await orderRes.json();
      if (orderData.success) {
        clearCart();
        navigate('/tracking');
      } else {
        console.error("Failed to place order:", orderData.message);
      }
    } catch (err) {
      console.error("Checkout network error:", err);
    }
    setIsCheckingOut(false);
  };

  // Calculate live order insights
  const maxPrepTime = items.reduce((max, item) => {
    const itemPrep = item.prepTime || 15; // mock default if not present
    return itemPrep > max ? itemPrep : max;
  }, 0);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white font-sans selection:bg-brand/30 selection:text-brand pb-32 pt-16">
      
      {/* ── Sticky Top Header ── */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link to="/menu" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-light">
                Checkout
              </h1>
              <p className="text-xs text-neutral-400 font-medium hidden sm:block">{cartItemCount} items in your bag</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Wallet Balance Chip */}
            <div className="hidden sm:flex items-center gap-2 bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full">
              <Wallet size={14} className="text-brand" />
              <span className="text-xs font-bold text-brand">₹450</span>
            </div>

            <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Bell size={20} className="text-neutral-300" />
            </button>
            
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-black overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="User" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ── Left Column (Items & Addons) ── */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">Your Items</h2>
              <span className="text-sm font-bold text-brand bg-brand/10 px-3 py-1 rounded-full">{cartItemCount} items</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Smart Addons Carousel */}
            <SmartAddons />

            {/* Coupons Section (Placed here on mobile, or right column on desktop) */}
            <div className="lg:hidden">
              <CouponsSection 
                appliedCoupon={appliedCoupon} 
                setAppliedCoupon={setAppliedCoupon} 
                setDiscount={setDiscount} 
              />
              <PaymentMethods selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
            </div>
          </div>

          {/* ── Right Column (Summary & Payment) ── */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-40 space-y-6">
              
              {/* Live Kitchen Insights */}
              <div className="glass-card rounded-[2rem] p-5 border border-white/5 bg-gradient-to-br from-black/60 to-brand/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <Clock size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Estimated Wait Time</h4>
                      <p className="text-xs text-neutral-400">Current kitchen load: <span className="text-green-400 font-medium">Moderate</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{maxPrepTime}</span>
                    <span className="text-sm text-neutral-400 ml-1">mins</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <OrderSummary total={total} discount={discount} />

              <div className="hidden lg:block">
                <CouponsSection 
                  appliedCoupon={appliedCoupon} 
                  setAppliedCoupon={setAppliedCoupon} 
                  setDiscount={setDiscount} 
                />
                <PaymentMethods selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Floating Checkout Panel (Mobile) ── */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden border-t border-white/10 bg-black/80 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1">To Pay</p>
            <p className="text-2xl font-black text-white">₹{Math.max(0, total + Math.round(total * 0.05) + 5 - discount)}</p>
          </div>
          <Button 
            size="lg" 
            className="premium-gradient shadow-[0_0_30px_rgba(255,107,0,0.3)] h-14 px-8 rounded-full"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Checkout'} <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Checkout Button (Desktop) - Appended to summary area */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-50">
        <Button 
          size="lg" 
          className="premium-gradient shadow-[0_0_40px_rgba(255,107,0,0.4)] hover:shadow-[0_0_60px_rgba(255,107,0,0.6)] h-16 px-10 rounded-full text-lg group transition-all"
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? 'Processing securely...' : 'Checkout securely'}
          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items: cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  // Assuming cart items have quantity. If CartContext doesn't, we'll map them by ID.
  // For standard CartContext, if it only has `cart` array, we'll display what's there.
  
  // Aggregate items by ID to show quantities properly if context doesn't do it
  const aggregatedCart = cart.reduce((acc: any[], item: any) => {
    const existing = acc.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const taxes = Math.round(total * 0.05); // 5% GST
  const grandTotal = total + taxes;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0c0c0c] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand/20 rounded-xl">
                  <ShoppingBag className="text-brand" size={20} />
                </div>
                <h2 className="font-display text-xl font-bold text-white">Your Order</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {aggregatedCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={48} className="mb-4 text-neutral-500" />
                  <p className="text-neutral-400 font-medium">Your cart is empty</p>
                  <p className="text-sm text-neutral-600 mt-2">Add some delicious items to get started!</p>
                </div>
              ) : (
                aggregatedCart.map((item: any) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="flex gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl"
                  >
                    <img src={item.image || item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-white font-bold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-brand font-bold text-sm mt-1">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-black/50 rounded-lg px-2 py-1 border border-white/10">
                          <button 
                            onClick={() => removeFromCart(item.id)} // Will remove one instance
                            className="text-neutral-400 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold text-white w-3 text-center">{item.quantity}</span>
                          <button className="text-neutral-400 hover:text-white">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {aggregatedCart.length > 0 && (
              <div className="p-6 bg-white/5 border-t border-white/10 backdrop-blur-xl">
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Taxes & Fees (GST 5%)</span>
                    <span className="text-white font-medium">₹{taxes}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Time</span>
                    <span className="text-green-400 font-medium tracking-wide">12-15 mins</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-end">
                    <span className="text-neutral-300 font-medium">Total to pay</span>
                    <span className="text-2xl font-black text-white">₹{grandTotal}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => { onClose(); navigate('/tracking'); }} // Assuming navigation to tracking/checkout
                  className="w-full premium-gradient shadow-[0_0_30px_rgba(255,107,0,0.3)] h-14 text-lg rounded-2xl flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Checkout
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

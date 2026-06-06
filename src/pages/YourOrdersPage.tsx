import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ClipboardList, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export const YourOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('canteenly_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await res.json();
        if (resData.success && Array.isArray(resData.data)) {
          setOrders(resData.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500', label: 'Pending' };
      case 'preparing':
        return { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', label: 'Preparing' };
      case 'ready':
      case 'ready for pickup':
        return { bg: 'bg-green-500/10 border-green-500/20 text-green-400', label: 'Ready' };
      case 'delivered':
      case 'completed':
        return { bg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400', label: 'Completed' };
      default:
        return { bg: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400', label: status };
    }
  };

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white font-sans selection:bg-brand/30 selection:text-brand pb-32 pt-16">
      {/* ── Sticky Top Header ── */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
          <Link to="/menu" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-light">
              Your Orders
            </h1>
            <p className="text-xs text-neutral-400 font-medium">{orders.length} orders placed so far</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        {isLoading ? (
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card h-48 rounded-3xl animate-pulse bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => {
                const date = new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const statusStyle = getStatusStyle(order.status);
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-[2rem] p-6 border border-white/5 bg-gradient-to-br from-black/60 to-white/[0.02] hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-neutral-400 font-medium">{date}</span>
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusStyle.bg)}>
                            {statusStyle.label}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Token:</span>
                          <span className="text-lg font-black text-brand">CN-{order.tokenNumber || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Total Paid</span>
                        <span className="text-2xl font-black text-white">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => {
                        const menuItem = item.menuItemId || {};
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {menuItem.image && (
                                <img src={menuItem.image} alt={menuItem.name} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                              )}
                              <div>
                                <span className="font-bold text-white text-sm">{menuItem.name || 'Delicious Meal'}</span>
                                <span className="text-xs text-neutral-500 ml-2">x{item.quantity}</span>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-neutral-300">₹{item.price * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ClipboardList size={40} className="text-neutral-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No orders placed yet</h2>
            <p className="text-neutral-400 max-w-sm mb-8">
              Looks like you haven't ordered anything yet. Browse our menu to grab your favorite food!
            </p>
            <Link to="/menu">
              <Button className="premium-gradient px-8 py-3 rounded-full font-bold">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

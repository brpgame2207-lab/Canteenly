import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  AlertCircle, 
  MoreHorizontal, 
  Timer,
  XCircle,
  Flame
} from 'lucide-react';
import { cn } from '../../../lib/utils';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

interface Order {
  id: string;
  user: string;
  items: { name: string; qty: number }[];
  total: number;
  status: OrderStatus;
  time: string;
  isPriority?: boolean;
  completedAt?: number;
}

const DUMMY_ORDERS: Order[] = [
  { id: '#ORD-4821', user: 'Rahul Kumar', items: [{ name: 'Masala Dosa', qty: 2 }, { name: 'Filter Coffee', qty: 2 }], total: 160, status: 'pending', time: '2m ago', isPriority: true },
  { id: '#ORD-4822', user: 'Priya Singh', items: [{ name: 'Paneer Butter Masala', qty: 1 }, { name: 'Naan', qty: 3 }], total: 250, status: 'pending', time: '5m ago' },
  { id: '#ORD-4819', user: 'Amit Patel', items: [{ name: 'Veg Biryani', qty: 1 }], total: 120, status: 'preparing', time: '12m ago' },
  { id: '#ORD-4818', user: 'Neha Gupta', items: [{ name: 'Cold Coffee', qty: 1 }, { name: 'Grilled Sandwich', qty: 1 }], total: 150, status: 'ready', time: '18m ago' },
  { id: '#ORD-4817', user: 'Vikram Sharma', items: [{ name: 'Chole Bhature', qty: 2 }], total: 180, status: 'completed', time: '25m ago' },
];

export const LiveOrdersSection = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState(DUMMY_ORDERS);

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
  ];

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: newStatus, completedAt: newStatus === 'completed' ? Date.now() : undefined } : o
    ));
  };

  // Timer for disappearing completed orders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const THREE_MINUTES = 3 * 60 * 1000;
      
      setOrders(currentOrders => 
        currentOrders.filter(order => {
          if (order.status === 'completed' && order.completedAt) {
            return now - order.completedAt < THREE_MINUTES;
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Live Order Queue
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h1>
          <p className="text-neutral-400 mt-1">Manage kitchen queue and order statuses in real-time.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border",
              activeTab === tab.id 
                ? "bg-brand text-white border-brand shadow-[0_0_15px_rgba(255,107,0,0.3)]" 
                : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px]",
              activeTab === tab.id ? "bg-black/20 text-white" : "bg-white/10 text-neutral-300"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.id}
                className={cn(
                  "glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col group",
                  order.isPriority ? "border-brand/40 shadow-[0_0_20px_rgba(255,107,0,0.1)]" : ""
                )}
              >
                {order.isPriority && (
                  <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 z-10">
                    <Flame size={12} /> PRIORITY
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{order.id}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{order.user}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1",
                    order.status === 'pending' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                    order.status === 'preparing' ? "bg-brand/10 text-brand border border-brand/20" :
                    order.status === 'ready' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                    "bg-neutral-800 text-neutral-400 border border-white/10"
                  )}>
                    {order.status === 'pending' && <Clock size={12} />}
                    {order.status === 'preparing' && <ChefHat size={12} />}
                    {order.status === 'ready' && <CheckCircle2 size={12} />}
                    {order.status}
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4 mb-6 flex-1">
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-start text-sm">
                        <span className="text-white"><span className="text-neutral-500 mr-2">{item.qty}x</span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Timer size={16} />
                    <span>{order.time}</span>
                  </div>

                  {order.status === 'completed' && order.completedAt && (
                    <div className="flex items-center gap-1.5 text-brand text-[10px] font-bold bg-brand/10 px-2 py-1 rounded-lg animate-pulse">
                      <Timer size={12} />
                      <span>{Math.ceil((3 * 60 * 1000 - (Date.now() - order.completedAt)) / 1000)}s</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center gap-2"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                      >
                        Complete
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button className="h-9 w-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/10 flex items-center justify-center text-neutral-400 transition-all">
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredOrders.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-neutral-500">
               <CheckCircle2 size={48} className="mb-4 opacity-50" />
               <p className="text-lg font-medium">No orders in this queue.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

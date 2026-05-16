import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Clock, 
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const data = [
  { name: '08 AM', sales: 400 },
  { name: '10 AM', sales: 1200 },
  { name: '12 PM', sales: 3000 },
  { name: '02 PM', sales: 2500 },
  { name: '04 PM', sales: 1800 },
  { name: '06 PM', sales: 2200 },
  { name: '08 PM', sales: 1000 },
];

const revenueData = [
  { day: 'Mon', amount: 45000 },
  { day: 'Tue', amount: 52000 },
  { day: 'Wed', amount: 48000 },
  { day: 'Thu', amount: 61000 },
  { day: 'Fri', amount: 55000 },
  { day: 'Sat', amount: 42000 },
  { day: 'Sun', amount: 38000 },
];

export const AdminDashboard = () => {
  return (
    <div className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Canteen Analytics</h1>
          <p className="text-neutral-400">Manage operations, track revenue, and monitor live orders.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-xl">Export Report</Button>
          <Button className="rounded-xl">Update Inventory</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '₹2.4L', change: '+12.5%', icon: IndianRupee, trend: 'up' },
          { label: 'Today\'s Orders', value: '842', change: '+18.2%', icon: ShoppingBag, trend: 'up' },
          { label: 'Active Users', value: '3.2k', change: '-2.4%', icon: Users, trend: 'down' },
          { label: 'Inventory Alert', value: '12 Items', change: 'Restock needed', icon: AlertCircle, trend: 'alert' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <stat.icon className={cn(
                  stat.trend === 'up' ? "text-green-500" : stat.trend === 'alert' ? "text-red-500" : "text-brand"
                )} size={24} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500">
                <MoreVertical size={16} />
              </Button>
            </div>
            <p className="text-neutral-500 text-sm mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <span className={cn(
                "text-xs font-semibold mb-1 flex items-center",
                stat.trend === 'up' ? "text-green-500" : "text-neutral-500"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : null}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Peak Hours Activity</h3>
            <select className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-neutral-400">
              <option>Today</option>
              <option>Yesterday</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                   itemStyle={{ color: '#ff6b00' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#ff6b00" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Orders Queue */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Live Queue</h3>
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded border border-green-500/20">Active Now</span>
          </div>
          <div className="space-y-6">
            {[
              { id: '#4821', time: '2m ago', items: 3, status: 'Preparing' },
              { id: '#4820', time: '5m ago', items: 1, status: 'Preparing' },
              { id: '#4819', time: '8m ago', items: 2, status: 'Ready' },
              { id: '#4818', time: '12m ago', items: 5, status: 'Completed' },
            ].map((order, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-brand">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{order.id}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{order.items} items • {order.time}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                  order.status === 'Preparing' ? "bg-brand/10 text-brand" : 
                  order.status === 'Ready' ? "bg-green-500/10 text-green-500" : 
                  "bg-neutral-800 text-neutral-400"
                )}>
                  {order.status}
                </div>
              </div>
            ))}
            <Button variant="secondary" className="w-full rounded-2xl group py-6">
               View All Orders
               <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

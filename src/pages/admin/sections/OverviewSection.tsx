import React from 'react';
import { motion } from 'motion/react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical,
  Wallet,
  Activity,
  Package
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '../../../lib/utils';

const salesData = [
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

export const OverviewSection = () => {
  const stats = [
    { label: "Today's Revenue", value: "₹45,231", change: "+12.5%", trend: "up", icon: IndianRupee },
    { label: "Total Orders", value: "842", change: "+18.2%", trend: "up", icon: ShoppingBag },
    { label: "Active Users", value: "3.2k", change: "-2.4%", trend: "down", icon: Users },
    { label: "Pending Orders", value: "24", change: "Requires Action", trend: "alert", icon: Clock },
    { label: "Monthly Revenue", value: "₹12.4L", change: "+8.1%", trend: "up", icon: TrendingUp },
    { label: "Orders in Queue", value: "18", change: "Live", trend: "neutral", icon: Activity },
    { label: "Wallet Recharges", value: "₹1.2L", change: "+5.4%", trend: "up", icon: Wallet },
    { label: "Total Items Sold", value: "1,245", change: "+14.2%", trend: "up", icon: Package },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <button className="bg-brand hover:bg-brand-light text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-brand/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <stat.icon size={80} />
            </div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <stat.icon className={cn(
                  stat.trend === 'up' ? "text-green-500" : 
                  stat.trend === 'down' ? "text-red-500" : 
                  stat.trend === 'alert' ? "text-orange-500" : "text-brand"
                )} size={22} />
              </div>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="relative z-10">
              <p className="text-neutral-400 text-sm font-medium mb-1">{stat.label}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</h3>
                <span className={cn(
                  "text-xs font-bold mb-1.5 flex items-center px-2 py-0.5 rounded-full",
                  stat.trend === 'up' ? "bg-green-500/10 text-green-500" : 
                  stat.trend === 'down' ? "bg-red-500/10 text-red-500" : 
                  stat.trend === 'alert' ? "bg-orange-500/10 text-orange-500" : 
                  "bg-brand/10 text-brand"
                )}>
                  {stat.trend === 'up' && <ArrowUpRight size={12} className="mr-1" />}
                  {stat.trend === 'down' && <ArrowDownRight size={12} className="mr-1" />}
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Sales Activity</h3>
              <p className="text-sm text-neutral-400 mt-1">Real-time hourly sales tracking</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                   itemStyle={{ color: '#ff6b00', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#ff6b00" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart / Weekly Revenue */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Weekly Revenue</h3>
              <p className="text-sm text-neutral-400 mt-1">Last 7 days performance</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                   itemStyle={{ color: '#ff9e5e', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" fill="#ff6b00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

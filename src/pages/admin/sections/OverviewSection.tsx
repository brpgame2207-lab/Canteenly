import React, { useState, useEffect } from 'react';
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


export const OverviewSection = () => {
  const [dbStats, setDbStats] = useState<{
    todayRevenue: number;
    totalOrders: number;
    activeUsers: number;
    pendingOrders: number;
    ordersInQueue: number;
    totalItemsSold: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      const token = localStorage.getItem('canteenly_token');
      fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            setDbStats(resData.data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch admin stats", err);
        });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 1500);
    return () => clearInterval(interval);
  }, []);

  const formatActiveUsers = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toString();
  };

  const stats = [
    { 
      label: "Today's Revenue", 
      value: dbStats !== null ? `₹${dbStats.todayRevenue.toLocaleString('en-IN')}` : "₹0", 
      change: dbStats !== null ? (dbStats.todayRevenue > 0 ? "+12.5%" : "0%") : "0%", 
      trend: "up", 
      icon: IndianRupee 
    },
    { 
      label: "Total Orders", 
      value: dbStats !== null ? dbStats.totalOrders.toLocaleString() : "0", 
      change: dbStats !== null ? (dbStats.totalOrders > 0 ? "+18.2%" : "0%") : "0%", 
      trend: "up", 
      icon: ShoppingBag 
    },
    { 
      label: "Active Users", 
      value: dbStats !== null ? formatActiveUsers(dbStats.activeUsers) : "0", 
      change: dbStats !== null ? (dbStats.activeUsers > 0 ? "+5.0%" : "0%") : "0%", 
      trend: dbStats !== null ? "up" : "down", 
      icon: Users 
    },
    { 
      label: "Pending Orders", 
      value: dbStats !== null ? dbStats.pendingOrders.toString() : "0", 
      change: dbStats !== null && dbStats.pendingOrders > 0 ? "Requires Action" : "Live", 
      trend: dbStats !== null && dbStats.pendingOrders > 0 ? "alert" : "neutral", 
      icon: Clock 
    },
    { 
      label: "Monthly Revenue", 
      value: "₹12.4L", 
      change: "+8.1%", 
      trend: "up", 
      icon: TrendingUp 
    },
    { 
      label: "Orders in Queue", 
      value: dbStats !== null ? dbStats.ordersInQueue.toString() : "0", 
      change: "Live", 
      trend: "neutral", 
      icon: Activity 
    },
    { 
      label: "Wallet Recharges", 
      value: "₹1.2L", 
      change: "+5.4%", 
      trend: "up", 
      icon: Wallet 
    },
    { 
      label: "Total Items Sold", 
      value: dbStats !== null ? dbStats.totalItemsSold.toLocaleString() : "0", 
      change: dbStats !== null ? (dbStats.totalItemsSold > 0 ? "+14.2%" : "0%") : "0%", 
      trend: "up", 
      icon: Package 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-400 mt-1">Welcome back. Here's what's happening today.</p>
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

    </div>
  );
};

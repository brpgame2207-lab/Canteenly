import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Layers, 
  PackageSearch, 
  Users, 
  UserSquare2, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type AdminTab = 
  | 'overview' | 'orders' | 'food' | 'inventory' 
  | 'staff' 
  | 'feedback' | 'notifications' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
  { id: 'food', label: 'Food Menu', icon: Utensils },
  { id: 'inventory', label: 'Inventory', icon: PackageSearch },
  { id: 'staff', label: 'Staff', icon: UserSquare2 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-6 z-20">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
          <Utensils size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl tracking-tight text-white leading-none">CanteenLY</h2>
          <span className="text-[10px] uppercase tracking-widest text-brand font-bold">Admin Portal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminTab)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden",
              activeTab === item.id 
                ? "text-white bg-white/10" 
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="sidebar-active" 
                className="absolute inset-0 bg-brand/10 border border-brand/20 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon size={18} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-brand" : "group-hover:text-neutral-300"
            )} />
            {item.label}
            {item.id === 'inventory' && (
              <span className="ml-auto bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                3
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:text-red-500 transition-colors" />
          Logout
        </button>
      </div>
    </aside>
  );
};

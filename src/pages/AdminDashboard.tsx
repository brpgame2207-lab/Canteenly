import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminTopNav } from './admin/AdminTopNav';
import { OverviewSection } from './admin/sections/OverviewSection';
import { LiveOrdersSection } from './admin/sections/LiveOrdersSection';
import { PlaceholderSection } from './admin/sections/PlaceholderSection';
import { FoodMenuSection } from './admin/sections/FoodMenuSection';
import { StaffManagementSection } from './admin/sections/StaffManagementSection';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const renderSection = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'orders':
        return <LiveOrdersSection />;
      case 'food':
        return <FoodMenuSection />;
      case 'staff':
        return <StaffManagementSection />;
      case 'settings':
        return <PlaceholderSection title="System Settings" description="Configure global canteen timings, tax rates, and security policies." />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0c0c0c] text-white overflow-hidden selection:bg-brand/30 selection:text-brand">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopNav />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full max-w-[1600px] mx-auto"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

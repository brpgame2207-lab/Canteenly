import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, Clock, Calendar, 
  CheckCircle2, XCircle, MoreVertical, Edit3, Trash2, 
  Shield, ShieldOff, Phone, Mail, BadgeCheck, Activity,
  AlertCircle, Bell, History, ShoppingBag
} from 'lucide-react';
import { cn } from '../../../lib/utils';

type StaffRole = 'Cook' | 'Helper' | 'Cashier' | 'Server' | 'Cleaner';
type ShiftTiming = 'Morning (6AM - 2PM)' | 'Afternoon (2PM - 10PM)' | 'Night (10PM - 6AM)';

interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  shift: ShiftTiming;
  joiningDate: string;
  isActive: boolean;
  attendanceStatus: 'Present' | 'Absent' | 'Late';
  ordersHandled: number;
  lastActive: string;
}

const ROLES: StaffRole[] = ['Cook', 'Helper', 'Cashier', 'Server', 'Cleaner'];
const SHIFTS: ShiftTiming[] = ['Morning (6AM - 2PM)', 'Afternoon (2PM - 10PM)', 'Night (10PM - 6AM)'];

const DUMMY_STAFF: StaffMember[] = [
  { 
    id: '1', staffId: 'STF-001', name: 'John Doe', role: 'Cook', 
    phone: '9876543210', email: 'john@canteen.com', 
    shift: 'Morning (6AM - 2PM)', joiningDate: '2023-10-15', 
    isActive: true, attendanceStatus: 'Present', ordersHandled: 145, lastActive: '2 mins ago'
  },
  { 
    id: '2', staffId: 'STF-002', name: 'Jane Smith', role: 'Cashier', 
    phone: '9876543211', email: 'jane@canteen.com', 
    shift: 'Afternoon (2PM - 10PM)', joiningDate: '2023-11-20', 
    isActive: true, attendanceStatus: 'Present', ordersHandled: 89, lastActive: '5 mins ago'
  },
  { 
    id: '3', staffId: 'STF-003', name: 'Mike Johnson', role: 'Server', 
    phone: '9876543212', email: 'mike@canteen.com', 
    shift: 'Morning (6AM - 2PM)', joiningDate: '2024-01-05', 
    isActive: false, attendanceStatus: 'Absent', ordersHandled: 34, lastActive: 'Yesterday'
  }
];

export const StaffManagementSection = () => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'shifts' | 'attendance' | 'activity'>('directory');
  const [staff, setStaff] = useState<StaffMember[]>(DUMMY_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: ROLES[0],
    phone: '',
    email: '',
    shift: SHIFTS[0]
  });

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
    } else {
      const newStaff: StaffMember = {
        id: Math.random().toString(36).substr(2, 9),
        staffId: `STF-${(staff.length + 1).toString().padStart(3, '0')}`,
        ...formData,
        joiningDate: new Date().toISOString().split('T')[0],
        isActive: true,
        attendanceStatus: 'Absent',
        ordersHandled: 0,
        lastActive: 'Never'
      };
      setStaff([...staff, newStaff]);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Staff Management</h1>
          <p className="text-neutral-400 mt-1">Manage, monitor and schedule your canteen team.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl border border-white/10 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-[#0c0c0c]" />
          </button>
          <button 
            onClick={() => {
              setEditingStaff(null);
              setFormData({ name: '', role: ROLES[0], phone: '', email: '', shift: SHIFTS[0] });
              setIsModalOpen(true);
            }}
            className="bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center gap-2"
          >
            <UserPlus size={18} /> Add New Staff
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        {[
          { id: 'directory', label: 'Directory', icon: Users },
          { id: 'shifts', label: 'Shifts', icon: Clock },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'activity', label: 'Activity', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeSubTab === tab.id 
                ? "bg-brand text-white shadow-lg" 
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'directory' && (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative col-span-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or staff ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="All">All Roles</option>
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-neutral-400 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4">Staff Member</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Shift</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStaff.map(member => (
                    <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{member.name}</div>
                            <div className="text-xs text-neutral-500">{member.staffId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-300">{member.role}</td>
                      <td className="px-6 py-4 text-sm text-neutral-300">{member.shift.split(' ')[0]}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          member.isActive 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        )}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStatus(member.id)}
                            className={cn(
                              "p-2 rounded-lg border transition-all",
                              member.isActive 
                                ? "bg-white/5 border-white/10 text-neutral-400 hover:text-yellow-500" 
                                : "bg-green-500/10 border-green-500/20 text-green-500"
                            )}
                          >
                            {member.isActive ? <ShieldOff size={16} /> : <Shield size={16} />}
                          </button>
                          <button 
                            onClick={() => {
                              setEditingStaff(member);
                              setFormData({
                                name: member.name,
                                role: member.role,
                                phone: member.phone,
                                email: member.email,
                                shift: member.shift
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-white/5 border border-white/10 text-neutral-400 hover:text-white rounded-lg transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStaff(member.id)}
                            className="p-2 bg-white/5 border border-white/10 text-neutral-400 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'shifts' && (
          <motion.div key="shifts" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHIFTS.map(shift => (
              <div key={shift} className="glass-card p-6 rounded-3xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand/10 text-brand">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{shift.split(' ')[0]} Shift</h3>
                      <p className="text-xs text-neutral-500">{shift.split('(')[1].replace(')', '')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-400">
                    {staff.filter(s => s.shift === shift && s.isActive).length} Assigned
                  </span>
                </div>
                <div className="space-y-3">
                  {staff.filter(s => s.shift === shift && s.isActive).map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-[10px] font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{member.name}</div>
                          <div className="text-[10px] text-neutral-500">{member.role}</div>
                        </div>
                      </div>
                      <button className="p-1.5 text-neutral-500 hover:text-white transition-colors">
                        <Edit3 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeSubTab === 'attendance' && (
          <motion.div key="attendance" className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-brand" />
                Today's Attendance Records
              </h3>
              <div className="text-xs text-neutral-400">May 16, 2026</div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-3">Staff Member</th>
                  <th className="px-6 py-3">In Time</th>
                  <th className="px-6 py-3">Out Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.filter(s => s.isActive).map(member => (
                  <tr key={member.id} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{member.name}</div>
                      <div className="text-[10px] text-neutral-500">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400">06:02 AM</td>
                    <td className="px-6 py-4 text-xs text-neutral-400">Pending</td>
                    <td className="px-6 py-4">
                      <select 
                        className={cn(
                          "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:outline-none",
                          member.attendanceStatus === 'Present' ? "text-green-400" : 
                          member.attendanceStatus === 'Absent' ? "text-red-400" : "text-yellow-400"
                        )}
                        defaultValue={member.attendanceStatus}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-brand hover:underline">View History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeSubTab === 'activity' && (
          <motion.div key="activity" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{staff.filter(s => s.isActive && s.attendanceStatus === 'Present').length}</div>
                  <div className="text-xs text-neutral-500">Currently On Duty</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-2xl">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">268</div>
                  <div className="text-xs text-neutral-500">Orders Handled Today</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/5 col-span-1 lg:col-span-2">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <History size={18} className="text-brand" />
                Recently Active
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {staff.filter(s => s.isActive).map(member => (
                  <div key={member.id} className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c0c0c]" />
                    </div>
                    <div className="text-[10px] font-bold text-white">{member.name.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 rounded-3xl w-full max-w-lg relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">Fill in the details for the staff profile.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddOrEdit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Role / Position</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as StaffRole})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    >
                      {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Shift Timing</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({...formData, shift: e.target.value as ShiftTiming})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    >
                      {SHIFTS.map(shift => <option key={shift} value={shift}>{shift}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Phone size={12} /> Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="9876543210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Mail size={12} /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@canteen.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] flex items-center justify-center gap-2 mt-4"
                >
                  {editingStaff ? <><Edit3 size={18} /> Update Profile</> : <><UserPlus size={18} /> Register Staff</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

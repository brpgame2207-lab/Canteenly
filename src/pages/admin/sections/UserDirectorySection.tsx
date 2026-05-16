import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, X, Search, Edit3, Trash2, User, Phone, Mail, 
  Hash, Building, GraduationCap, Shield, ShieldOff, 
  Filter, UserPlus, Briefcase, Users
} from 'lucide-react';
import { cn } from '../../../lib/utils';

type UserRole = 'Student' | 'Teacher';

interface UserEntry {
  id: string;
  userId: string; // Internal system ID
  name: string;
  idNumber: string; // USN for students, Employee ID for teachers
  type: UserRole;
  department: string;
  yearSemester?: string; // Student only
  designation?: string; // Teacher only
  phone: string;
  email: string;
  isActive: boolean;
}

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Science', 'Electrical', 'Biotech', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const DESIGNATIONS = ['Professor', 'Assistant Professor', 'Associate Professor', 'HOD', 'Lecturer', 'Staff'];

const DUMMY_USERS: UserEntry[] = [
  { id: '1', userId: 'USR-001', name: 'Rahul Kumar', idNumber: '1MS21CS045', type: 'Student', department: 'Computer Science', yearSemester: '3rd Year', phone: '9876543210', email: 'rahul@canteenly.com', isActive: true },
  { id: '2', userId: 'USR-002', name: 'Dr. Smitha Rao', idNumber: 'EMP-102', type: 'Teacher', department: 'Electronics', designation: 'Professor', phone: '9876543211', email: 'smitha.rao@college.com', isActive: true },
  { id: '3', userId: 'USR-003', name: 'Amit Patel', idNumber: '1MS22ME018', type: 'Student', department: 'Mechanical', yearSemester: '2nd Year', phone: '9876543212', email: 'amit@canteenly.com', isActive: false },
  { id: '4', userId: 'USR-004', name: 'Prof. Vikram', idNumber: 'EMP-105', type: 'Teacher', department: 'Computer Science', designation: 'Assistant Professor', phone: '9876543213', email: 'vikram@college.com', isActive: true },
  { id: '5', userId: 'USR-005', name: 'Neha Gupta', idNumber: '1MS21IS027', type: 'Student', department: 'Information Science', yearSemester: '3rd Year', phone: '9876543214', email: 'neha@canteenly.com', isActive: true },
];

export const UserDirectorySection = () => {
  const [users, setUsers] = useState<UserEntry[]>(DUMMY_USERS);
  const [activeTab, setActiveTab] = useState<'All' | 'Student' | 'Teacher'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserEntry | null>(null);
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string | null>(null);

  // Form state
  const [fType, setFType] = useState<UserRole>('Student');
  const [fName, setFName] = useState('');
  const [fIdNum, setFIdNum] = useState('');
  const [fDept, setFDept] = useState(DEPARTMENTS[0]);
  const [fYear, setFYear] = useState(YEARS[0]);
  const [fDesignation, setFDesignation] = useState(DESIGNATIONS[0]);
  const [fPhone, setFPhone] = useState('');
  const [fEmail, setFEmail] = useState('');

  const resetForm = () => { 
    setFType('Student'); setFName(''); setFIdNum(''); 
    setFDept(DEPARTMENTS[0]); setFYear(YEARS[0]); 
    setFDesignation(DESIGNATIONS[0]); setFPhone(''); setFEmail(''); 
    setEditingUser(null); 
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };

  const openEditModal = (u: UserEntry) => {
    setEditingUser(u);
    setFType(u.type);
    setFName(u.name);
    setFIdNum(u.idNumber);
    setFDept(u.department);
    if (u.type === 'Student') setFYear(u.yearSemester || YEARS[0]);
    else setFDesignation(u.designation || DESIGNATIONS[0]);
    setFPhone(u.phone);
    setFEmail(u.email);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fIdNum.trim()) return;
    
    const userData: Partial<UserEntry> = {
      name: fName,
      idNumber: fIdNum,
      type: fType,
      department: fDept,
      phone: fPhone,
      email: fEmail,
      yearSemester: fType === 'Student' ? fYear : undefined,
      designation: fType === 'Teacher' ? fDesignation : undefined,
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
      setUsers([...users, { 
        id: `u-${Date.now()}`, 
        userId: newId, 
        isActive: true,
        ...userData as any
      }]);
    }
    setIsModalOpen(false); resetForm();
  };

  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));
  const toggleActive = (id: string) => setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));

  const filtered = users.filter(u => {
    if (activeTab !== 'All' && u.type !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.idNumber.toLowerCase().includes(q) && !u.userId.toLowerCase().includes(q)) return false;
    }
    if (filterDept && u.department !== filterDept) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">User Directory</h1>
          <p className="text-neutral-400 mt-1">{users.length} registered users · {users.filter(u=>u.type==='Student').length} students · {users.filter(u=>u.type==='Teacher').length} teachers</p>
        </div>
        <button onClick={openAddModal} className="bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center gap-2">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {(['All', 'Student', 'Teacher'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", 
                  activeTab === tab ? "bg-brand text-white shadow-lg" : "text-neutral-400 hover:text-white hover:bg-white/5")}>
                {tab}s
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search name or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
            </div>
            <select value={filterDept || ''} onChange={e => setFilterDept(e.target.value || null)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none min-w-[160px]">
              <option value="" className="bg-[#1a1a1a]">All Depts</option>
              {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar rounded-2xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white/5 backdrop-blur-xl border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">User ID</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Name</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Type</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden md:table-cell">ID Number</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden lg:table-cell">Dept / Info</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
              <th className="text-right px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((u) => (
                <motion.tr key={u.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={cn("border-b border-white/5 transition-colors hover:bg-white/[0.03]", !u.isActive && "opacity-50")}>
                  <td className="px-5 py-4 font-mono text-brand text-xs font-bold">{u.userId}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0", 
                        u.type === 'Student' ? "bg-brand/10 border-brand/20 text-brand" : "bg-sky-500/10 border-sky-500/20 text-sky-400")}>
                        {u.type === 'Student' ? <GraduationCap size={14} /> : <Briefcase size={14} />}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{u.name}</p>
                        <p className="text-neutral-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase", 
                      u.type === 'Student' ? "bg-brand/10 text-brand" : "bg-sky-500/10 text-sky-400")}>
                      {u.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-neutral-300 font-mono text-xs hidden md:table-cell">{u.idNumber}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-col">
                      <span className="text-neutral-300 text-xs">{u.department}</span>
                      <span className="text-neutral-500 text-[10px]">{u.type === 'Student' ? u.yearSemester : u.designation}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                      u.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => setViewUser(u)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><User size={14} /></button>
                      <button onClick={() => openEditModal(u)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => toggleActive(u.id)} className={cn("h-8 w-8 rounded-lg border flex items-center justify-center transition-all", u.isActive ? "bg-white/5 hover:bg-yellow-500/10 border-white/10 text-neutral-400 hover:text-yellow-500" : "bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-500")}>{u.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}</button>
                      <button onClick={() => deleteUser(u.id)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      <AnimatePresence>
        {viewUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="glass-card p-8 rounded-3xl w-full max-w-md relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-display">User Profile</h2>
                <button onClick={() => setViewUser(null)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("h-14 w-14 rounded-2xl border flex items-center justify-center text-xl font-bold", 
                  viewUser.type === 'Student' ? "bg-brand/10 border-brand/20 text-brand" : "bg-sky-500/10 border-sky-500/20 text-sky-400")}>
                  {viewUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{viewUser.name}</h3>
                  <p className="text-sm text-neutral-400">{viewUser.type} · {viewUser.userId}</p>
                </div>
                <span className={cn("ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", viewUser.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>{viewUser.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: viewUser.type === 'Student' ? 'USN / Roll No' : 'Employee ID', value: viewUser.idNumber, icon: Hash },
                  { label: 'Department', value: viewUser.department, icon: Building },
                  viewUser.type === 'Student' 
                    ? { label: 'Year / Semester', value: viewUser.yearSemester, icon: GraduationCap }
                    : { label: 'Designation', value: viewUser.designation, icon: Briefcase },
                  { label: 'Phone', value: viewUser.phone, icon: Phone },
                  { label: 'Email', value: viewUser.email, icon: Mail },
                ].map((row, idx) => row && (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <row.icon size={16} className="text-brand shrink-0" />
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">{row.label}</p>
                      <p className="text-sm text-white font-medium">{row.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => { setViewUser(null); openEditModal(viewUser); }} className="flex-1 bg-brand hover:bg-brand-light text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"><Edit3 size={14} /> Edit</button>
                <button onClick={() => { toggleActive(viewUser.id); setViewUser({ ...viewUser, isActive: !viewUser.isActive }); }} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border", viewUser.isActive ? "bg-white/5 text-yellow-500 border-yellow-500/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>{viewUser.isActive ? 'Deactivate' : 'Activate'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setIsModalOpen(false); resetForm(); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="glass-card p-8 rounded-3xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                  <p className="text-neutral-400 text-sm mt-1">Select type and fill details.</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                  {(['Student', 'Teacher'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setFType(t)}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", 
                        fType === t ? "bg-brand text-white shadow-md" : "text-neutral-500 hover:text-white")}>
                      {t}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">{fType === 'Student' ? 'USN / Roll No' : 'Employee ID'}</label>
                    <input type="text" value={fIdNum} onChange={e => setFIdNum(e.target.value)} placeholder="ID Number" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Department</label>
                    <select value={fDept} onChange={e => setFDept(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none">
                      {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
                    </select>
                  </div>
                </div>

                {fType === 'Student' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Year / Semester</label>
                    <select value={fYear} onChange={e => setFYear(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none">
                      {YEARS.map(y => <option key={y} value={y} className="bg-[#1a1a1a]">{y}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Designation</label>
                    <select value={fDesignation} onChange={e => setFDesignation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none">
                      {DESIGNATIONS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Phone</label>
                    <input type="tel" value={fPhone} onChange={e => setFPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Email</label>
                    <input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-all mt-2 shadow-lg">
                  {editingUser ? 'Update User' : 'Register User'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

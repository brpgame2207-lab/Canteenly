import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Search, Edit3, Trash2, User, Phone, Mail, Hash, Building, GraduationCap, Shield, ShieldOff, Filter, UserPlus, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Student {
  id: string;
  studentId: string;
  name: string;
  usn: string;
  department: string;
  yearSemester: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Science', 'Electrical', 'Biotech', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const DUMMY_STUDENTS: Student[] = [
  { id: '1', studentId: 'STU-001', name: 'Rahul Kumar', usn: '1MS21CS045', department: 'Computer Science', yearSemester: '3rd Year', phone: '9876543210', email: 'rahul@canteenly.com', isActive: true },
  { id: '2', studentId: 'STU-002', name: 'Priya Singh', usn: '1MS21EC032', department: 'Electronics', yearSemester: '3rd Year', phone: '9876543211', email: 'priya@canteenly.com', isActive: true },
  { id: '3', studentId: 'STU-003', name: 'Amit Patel', usn: '1MS22ME018', department: 'Mechanical', yearSemester: '2nd Year', phone: '9876543212', email: 'amit@canteenly.com', isActive: false },
  { id: '4', studentId: 'STU-004', name: 'Neha Gupta', usn: '1MS21IS027', department: 'Information Science', yearSemester: '3rd Year', phone: '9876543213', email: 'neha@canteenly.com', isActive: true },
  { id: '5', studentId: 'STU-005', name: 'Vikram Sharma', usn: '1MS23CV011', department: 'Civil', yearSemester: '1st Year', phone: '9876543214', email: 'vikram@canteenly.com', isActive: true },
];

export const UserDirectorySection = () => {
  const [students, setStudents] = useState<Student[]>(DUMMY_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string | null>(null);

  // Form state
  const [fName, setFName] = useState('');
  const [fUsn, setFUsn] = useState('');
  const [fDept, setFDept] = useState(DEPARTMENTS[0]);
  const [fYear, setFYear] = useState(YEARS[0]);
  const [fPhone, setFPhone] = useState('');
  const [fEmail, setFEmail] = useState('');

  const resetForm = () => { setFName(''); setFUsn(''); setFDept(DEPARTMENTS[0]); setFYear(YEARS[0]); setFPhone(''); setFEmail(''); setEditingStudent(null); };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };

  const openEditModal = (s: Student) => {
    setEditingStudent(s); setFName(s.name); setFUsn(s.usn); setFDept(s.department); setFYear(s.yearSemester); setFPhone(s.phone); setFEmail(s.email); setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fUsn.trim()) return;
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, name: fName, usn: fUsn, department: fDept, yearSemester: fYear, phone: fPhone, email: fEmail } : s));
    } else {
      const newId = `STU-${String(students.length + 1).padStart(3, '0')}`;
      setStudents([...students, { id: `s-${Date.now()}`, studentId: newId, name: fName, usn: fUsn, department: fDept, yearSemester: fYear, phone: fPhone, email: fEmail, isActive: true }]);
    }
    setIsModalOpen(false); resetForm();
  };

  const deleteStudent = (id: string) => setStudents(students.filter(s => s.id !== id));
  const toggleActive = (id: string) => setStudents(students.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));

  const filtered = students.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.usn.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q)) return false;
    }
    if (filterDept && s.department !== filterDept) return false;
    if (filterYear && s.yearSemester !== filterYear) return false;
    return true;
  });

  const activeCount = students.filter(s => s.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">User Directory</h1>
          <p className="text-neutral-400 mt-1">{students.length} students · {activeCount} active · {students.length - activeCount} inactive</p>
        </div>
        <button onClick={openAddModal} className="bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center gap-2">
          <UserPlus size={18} /> Add Student
        </button>
      </div>

      {/* Search & Filters */}
      <div className="shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, USN, or Student ID..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
          </div>
          {/* Department filter */}
          <select value={filterDept || ''} onChange={e => setFilterDept(e.target.value || null)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none min-w-[180px]">
            <option value="" className="bg-[#1a1a1a]">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
          </select>
          {/* Year filter */}
          <select value={filterYear || ''} onChange={e => setFilterYear(e.target.value || null)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none min-w-[140px]">
            <option value="" className="bg-[#1a1a1a]">All Years</option>
            {YEARS.map(y => <option key={y} value={y} className="bg-[#1a1a1a]">{y}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar rounded-2xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white/5 backdrop-blur-xl border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Student ID</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Name</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden lg:table-cell">USN</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden md:table-cell">Department</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden xl:table-cell">Year</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden xl:table-cell">Phone</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
              <th className="text-right px-5 py-3.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((s) => (
                <motion.tr key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={cn("border-b border-white/5 transition-colors hover:bg-white/[0.03]", !s.isActive && "opacity-50")}>
                  <td className="px-5 py-4 font-mono text-brand text-xs font-bold">{s.studentId}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-xs font-bold shrink-0">{s.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-white text-sm">{s.name}</p>
                        <p className="text-neutral-500 text-xs">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-300 font-mono text-xs hidden lg:table-cell">{s.usn}</td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-300">{s.department}</span></td>
                  <td className="px-5 py-4 text-neutral-400 text-xs hidden xl:table-cell">{s.yearSemester}</td>
                  <td className="px-5 py-4 text-neutral-400 text-xs hidden xl:table-cell">{s.phone}</td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                      s.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => setViewStudent(s)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all" title="View"><User size={14} /></button>
                      <button onClick={() => openEditModal(s)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all" title="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => toggleActive(s.id)} className={cn("h-8 w-8 rounded-lg border flex items-center justify-center transition-all", s.isActive ? "bg-white/5 hover:bg-yellow-500/10 border-white/10 text-neutral-400 hover:text-yellow-500" : "bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-500")} title={s.isActive ? 'Deactivate' : 'Activate'}>{s.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}</button>
                      <button onClick={() => deleteStudent(s.id)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-500">
            <Search size={40} className="mb-4 opacity-40" />
            <p className="font-medium">No students found.</p>
            <p className="text-sm mt-1">Try a different search or filter.</p>
          </div>
        )}
      </div>

      {/* View Student Detail Modal */}
      <AnimatePresence>
        {viewStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewStudent(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="glass-card p-8 rounded-3xl w-full max-w-md relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-display">Student Details</h2>
                <button onClick={() => setViewStudent(null)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-xl font-bold">{viewStudent.name.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{viewStudent.name}</h3>
                  <p className="text-sm text-neutral-400">{viewStudent.studentId}</p>
                </div>
                <span className={cn("ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", viewStudent.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20")}>{viewStudent.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'USN / Roll No', value: viewStudent.usn, icon: Hash },
                  { label: 'Department', value: viewStudent.department, icon: Building },
                  { label: 'Year / Semester', value: viewStudent.yearSemester, icon: GraduationCap },
                  { label: 'Phone', value: viewStudent.phone, icon: Phone },
                  { label: 'Email', value: viewStudent.email, icon: Mail },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <row.icon size={16} className="text-brand shrink-0" />
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">{row.label}</p>
                      <p className="text-sm text-white font-medium">{row.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => { setViewStudent(null); openEditModal(viewStudent); }} className="flex-1 bg-brand hover:bg-brand-light text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"><Edit3 size={14} /> Edit</button>
                <button onClick={() => { toggleActive(viewStudent.id); setViewStudent({ ...viewStudent, isActive: !viewStudent.isActive }); }} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border", viewStudent.isActive ? "bg-white/5 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10" : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20")}>{viewStudent.isActive ? <><ShieldOff size={14} /> Deactivate</> : <><Shield size={14} /> Activate</>}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setIsModalOpen(false); resetForm(); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="glass-card p-8 rounded-3xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
                  <p className="text-neutral-400 text-sm mt-1">{editingStudent ? 'Update student details.' : 'Register a new student.'}</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><User size={12} /> Full Name</label>
                  <input type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Rahul Kumar" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Hash size={12} /> USN / Roll No</label>
                    <input type="text" value={fUsn} onChange={e => setFUsn(e.target.value)} placeholder="1MS21CS045" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Building size={12} /> Department</label>
                    <select value={fDept} onChange={e => setFDept(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                      {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1a1a1a] text-white">{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><GraduationCap size={12} /> Year / Semester</label>
                  <select value={fYear} onChange={e => setFYear(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                    {YEARS.map(y => <option key={y} value={y} className="bg-[#1a1a1a] text-white">{y}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Phone size={12} /> Phone</label>
                    <input type="tel" value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Mail size={12} /> Email</label>
                    <input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="name@college.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] flex items-center justify-center gap-2 mt-2">
                  {editingStudent ? <><Edit3 size={18} /> Update Student</> : <><UserPlus size={18} /> Add Student</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

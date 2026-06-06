import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Utensils, Trash2, Edit3, IndianRupee, Tag, FileText, Leaf, Drumstick, Egg, Filter, PackageCheck, Coffee } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  mealType: string;
  cuisineStyle: string;
  dietType: 'Veg' | 'Non-Veg' | 'Egg';
  beverageType: string;
  image: string;
  isAvailable: boolean;
  isComboOffer: boolean;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
const CUISINE_STYLES = ['South Indian', 'North Indian', 'Chinese', 'Fast Food', 'Continental', 'Other'];
const BEVERAGE_OPTIONS = ['None', 'Tea', 'Coffee', 'Juice', 'Shake', 'Lassi', 'Other'];

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=400&auto=format&fit=crop',
];

// All possible filter options — each is its own button
const FILTER_OPTIONS = [
  { id: 'All', type: 'all' },
  { id: 'Breakfast', type: 'meal' }, { id: 'Lunch', type: 'meal' }, { id: 'Dinner', type: 'meal' }, { id: 'Snacks', type: 'meal' }, { id: 'Desserts', type: 'meal' },
  { id: 'South Indian', type: 'style' }, { id: 'North Indian', type: 'style' }, { id: 'Chinese', type: 'style' }, { id: 'Fast Food', type: 'style' }, { id: 'Continental', type: 'style' },
  { id: 'Veg', type: 'diet' }, { id: 'Non-Veg', type: 'diet' }, { id: 'Egg', type: 'diet' },
  { id: 'Beverages', type: 'bev' },
  { id: 'Combo Offers', type: 'combo' },
];

export const FoodMenuSection = () => {
  const [items, setItems] = useState<FoodMenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodMenuItem | null>(null);
  const [filterMeal, setFilterMeal] = useState<string | null>(null);
  const [filterStyle, setFilterStyle] = useState<string | null>(null);
  const [filterDiet, setFilterDiet] = useState<string | null>(null);
  const [filterBev, setFilterBev] = useState(false);
  const [filterCombo, setFilterCombo] = useState(false);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formMeal, setFormMeal] = useState(MEAL_TYPES[0]);
  const [formStyle, setFormStyle] = useState(CUISINE_STYLES[0]);
  const [formDiet, setFormDiet] = useState<'Veg'|'Non-Veg'|'Egg'>('Veg');
  const [formBev, setFormBev] = useState('None');
  const [formIsCombo, setFormIsCombo] = useState(false);

  // Fetch items from DB
  const fetchItems = () => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(resData => {
        const data = resData.data || resData;
        if (Array.isArray(data)) {
          const mapped = data.map(item => ({
            id: item._id || item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            mealType: item.mealType || item.category || 'Snacks',
            cuisineStyle: item.cuisineStyle || 'South Indian',
            dietType: (item.dietType || 'Veg') as 'Veg' | 'Non-Veg' | 'Egg',
            beverageType: item.beverageType || 'None',
            image: item.image || PLACEHOLDER_IMAGES[0],
            isAvailable: item.available !== false,
            isComboOffer: item.isComboOffer || false
          }));
          setItems(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch menu items", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormName(''); setFormDesc(''); setFormPrice('');
    setFormMeal(MEAL_TYPES[0]); setFormStyle(CUISINE_STYLES[0]);
    setFormDiet('Veg'); setFormBev('None'); setFormIsCombo(false);
    setEditingItem(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };

  const openEditModal = (item: FoodMenuItem) => {
    setEditingItem(item);
    setFormName(item.name); setFormDesc(item.description); setFormPrice(String(item.price));
    setFormMeal(item.mealType); setFormStyle(item.cuisineStyle);
    setFormDiet(item.dietType); setFormBev(item.beverageType);
    setFormIsCombo(item.isComboOffer); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;

    const token = localStorage.getItem('canteenly_token');
    const payload = {
      name: formName,
      description: formDesc || 'A delicious dish freshly prepared.',
      price: Number(formPrice),
      category: formMeal,
      mealType: formMeal,
      cuisineStyle: formStyle,
      dietType: formDiet,
      beverageType: formBev,
      isComboOffer: formIsCombo,
      image: editingItem ? editingItem.image : PLACEHOLDER_IMAGES[items.length % PLACEHOLDER_IMAGES.length],
      available: editingItem ? editingItem.isAvailable : true
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) {
          fetchItems();
        }
      } else {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) {
          fetchItems();
        }
      }
    } catch (err) {
      console.error("Failed to save menu item", err);
    }

    setIsModalOpen(false); resetForm();
  };

  const deleteItem = (id: string) => {
    const token = localStorage.getItem('canteenly_token');
    fetch(`/api/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setItems(items.filter(i => i.id !== id));
        }
      })
      .catch(err => console.error("Failed to delete item", err));
  };

  const toggleAvailability = (id: string) => {
    const itemToToggle = items.find(i => i.id === id);
    if (!itemToToggle) return;

    const token = localStorage.getItem('canteenly_token');
    fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        available: !itemToToggle.isAvailable
      })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setItems(items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
        }
      })
      .catch(err => console.error("Failed to toggle availability", err));
  };

  const filteredItems = items.filter(i => {
    if (filterMeal && i.mealType !== filterMeal) return false;
    if (filterStyle && i.cuisineStyle !== filterStyle) return false;
    if (filterDiet && i.dietType !== filterDiet) return false;
    if (filterBev && i.beverageType === 'None') return false;
    if (filterCombo && !i.isComboOffer) return false;
    return true;
  });

  const toggleFilter = (current: string | null, value: string, setter: (v: string | null) => void) => {
    setter(current === value ? null : value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Food Menu Management</h1>
          <p className="text-neutral-400 mt-1">{items.length === 0 ? 'No items yet. Start building your menu.' : `${items.length} item${items.length > 1 ? 's' : ''} in menu`}</p>
        </div>
        <button onClick={openAddModal} className="bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center gap-2">
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Filter rows — each line independent, pick one from each */}
      {items.length > 0 && (
        <div className="shrink-0 space-y-2">
          {/* Meal Type */}
          <div className="flex flex-wrap gap-1.5">
            {MEAL_TYPES.map(m => (
              <button key={m} onClick={() => toggleFilter(filterMeal, m, setFilterMeal)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                  filterMeal === m ? "bg-brand text-white border-brand shadow-[0_0_12px_rgba(255,107,0,0.3)]" : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white")}>
                {m}
              </button>
            ))}
          </div>

          {/* Cuisine Style */}
          <div className="flex flex-wrap gap-1.5">
            {CUISINE_STYLES.map(s => (
              <button key={s} onClick={() => toggleFilter(filterStyle, s, setFilterStyle)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                  filterStyle === s ? "bg-brand text-white border-brand shadow-[0_0_12px_rgba(255,107,0,0.3)]" : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white")}>
                {s}
              </button>
            ))}
          </div>

          {/* Diet Type */}
          <div className="flex flex-wrap gap-1.5">
            {(['Veg', 'Non-Veg', 'Egg'] as const).map(d => (
              <button key={d} onClick={() => toggleFilter(filterDiet, d, setFilterDiet)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                  filterDiet === d
                    ? d === 'Veg' ? "bg-green-500/20 text-green-400 border-green-500/30" : d === 'Egg' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white")}>
                <div className={cn("w-1.5 h-1.5 rounded-full", d === 'Veg' ? "bg-green-500" : d === 'Egg' ? "bg-yellow-500" : "bg-red-500")} />
                {d}
              </button>
            ))}
          </div>

          {/* Beverages + Combo */}
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setFilterBev(!filterBev)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                filterBev ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white")}>
              <Coffee size={12} /> Beverages
            </button>
            <button onClick={() => setFilterCombo(!filterCombo)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                filterCombo ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white")}>
              <PackageCheck size={12} /> Combo Offers
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id}
                className={cn("glass-card rounded-3xl relative overflow-hidden flex flex-col group", !item.isAvailable && "opacity-60")}>
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Diet badge */}
                  <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 backdrop-blur-md border",
                    item.dietType === 'Veg' ? "bg-green-500/20 text-green-400 border-green-500/30" : item.dietType === 'Egg' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30")}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.dietType === 'Veg' ? "bg-green-500" : item.dietType === 'Egg' ? "bg-yellow-500" : "bg-red-500")} />
                    {item.dietType}
                  </div>
                  {/* Meal + Style badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    <div className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">{item.mealType}</div>
                    <div className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-bold text-neutral-300 border border-white/10">{item.cuisineStyle}</div>
                  </div>
                  {/* Combo badge */}
                  {item.isComboOffer && <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-purple-500/20 backdrop-blur-md text-[10px] font-bold text-purple-400 border border-purple-500/30 flex items-center gap-1"><PackageCheck size={10} /> COMBO</div>}
                  {/* Beverage badge */}
                  {item.beverageType !== 'None' && <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-sky-500/20 backdrop-blur-md text-[10px] font-bold text-sky-400 border border-sky-500/30 flex items-center gap-1"><Coffee size={10} /> {item.beverageType}</div>}
                  {!item.isAvailable && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-sm font-bold text-neutral-300 bg-black/60 px-4 py-2 rounded-xl border border-white/10">Unavailable</span></div>}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{item.name}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-xl font-bold text-brand flex items-center"><IndianRupee size={16} className="mr-0.5" />{item.price}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleAvailability(item.id)} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all text-xs font-bold border", item.isAvailable ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" : "bg-neutral-800 text-neutral-400 border-white/10 hover:bg-white/10")} title={item.isAvailable ? "Mark Unavailable" : "Mark Available"}>{item.isAvailable ? '✓' : '✗'}</button>
                      <button onClick={() => openEditModal(item)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => deleteItem(item.id)} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setIsModalOpen(false); resetForm(); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="glass-card p-8 rounded-3xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                  <p className="text-neutral-400 text-sm mt-1">{editingItem ? 'Update the details below.' : 'Fill in the details to add a new dish.'}</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Utensils size={12} /> Dish Name</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Masala Dosa" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                </div>
                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><FileText size={12} /> Description</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="A short description..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none" />
                </div>
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><IndianRupee size={12} /> Price (₹)</label>
                  <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="120" required min="1" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                </div>

                {/* Meal Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Meal Type</label>
                  <select value={formMeal} onChange={e => setFormMeal(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                    {MEAL_TYPES.map(m => <option key={m} value={m} className="bg-[#1a1a1a] text-white">{m}</option>)}
                  </select>
                </div>

                {/* Cuisine Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Cuisine Style</label>
                  <select value={formStyle} onChange={e => setFormStyle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                    {CUISINE_STYLES.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>)}
                  </select>
                </div>

                {/* Diet Type — Veg / Non-Veg / Egg */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Diet Type</label>
                  <div className="flex gap-2">
                    {(['Veg', 'Non-Veg', 'Egg'] as const).map(d => (
                      <button key={d} type="button" onClick={() => setFormDiet(d)}
                        className={cn("flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all",
                          formDiet === d
                            ? d === 'Veg' ? "bg-green-500/10 text-green-400 border-green-500/30" : d === 'Egg' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10"
                        )}>
                        {d === 'Veg' && <Leaf size={16} />}{d === 'Non-Veg' && <Drumstick size={16} />}{d === 'Egg' && <Egg size={16} />} {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beverage Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><Coffee size={12} /> Beverage <span className="text-neutral-600 normal-case">(optional)</span></label>
                  <select value={formBev} onChange={e => setFormBev(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                    {BEVERAGE_OPTIONS.map(b => <option key={b} value={b} className="bg-[#1a1a1a] text-white">{b}</option>)}
                  </select>
                </div>

                {/* Combo Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><PackageCheck size={12} /> Combo Offer</label>
                  <button type="button" onClick={() => setFormIsCombo(!formIsCombo)}
                    className={cn("w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 border transition-all",
                      formIsCombo ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10")}>
                    <div className={cn("w-10 h-5 rounded-full relative transition-all", formIsCombo ? "bg-purple-500" : "bg-neutral-700")}>
                      <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm", formIsCombo ? "left-[22px]" : "left-0.5")} />
                    </div>
                    {formIsCombo ? 'Combo Offer ON' : 'Combo Offer OFF'}
                  </button>
                </div>

                <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] flex items-center justify-center gap-2 mt-2">
                  {editingItem ? <><Edit3 size={18} /> Update Item</> : <><Plus size={18} /> Add to Menu</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

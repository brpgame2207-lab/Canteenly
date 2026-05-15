import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingPlus, Star, Info, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const MenuPage = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  const categories = ['All', 'Fast Food', 'Healthy', 'Drinks', 'Desserts', 'Indian'];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setIsLoading(false);
      });
  }, []);

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Campus Canteen Menu</h1>
          <p className="text-neutral-400">Discover delicious meals prepared fresh just for you.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-full pl-10 pr-6 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all w-full md:w-64"
            />
          </div>
          <Button variant="secondary" className="rounded-full">
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === cat 
                ? "premium-gradient text-white shadow-lg" 
                : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Section (AI Feature Placeholder) */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-brand" size={20} />
          <h2 className="text-xl font-bold text-white">AI Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.slice(0, 4).map((item) => (
            <motion.div
              layout
              key={`rec-${item.id}`}
              className="glass-card rounded-2xl overflow-hidden group border-brand/20 bg-brand/5"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-brand text-[10px] font-bold text-white rounded uppercase tracking-tighter">85% Match</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1">{item.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-brand font-medium">₹{item.price}</span>
                    <Button size="sm" variant="ghost" onClick={() => addToCart(item)}>Add</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="glass-card h-80 rounded-3xl animate-pulse bg-white/5" />
            ))
          ) : filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="glass-card rounded-3xl overflow-hidden group hover:bg-white/10 transition-colors"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-8 group-hover:translate-y-0 transition-transform">
                     <span className="bg-brand text-white px-3 py-1 rounded-full text-xs font-bold leading-none">
                        ₹{item.price}
                     </span>
                     <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span>{item.rating}</span>
                     </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded-full">{item.category}</span>
                  </div>
                  <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-2xl">
                      <Info size={18} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center">
                <p className="text-neutral-500">No dishes found matching your search.</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

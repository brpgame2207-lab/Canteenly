import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

// Import new premium components
import { HeroBanner } from '../components/menu/HeroBanner';
import { FilterBar } from '../components/menu/FilterBar';
import { PremiumFoodCard, FoodItem } from '../components/menu/PremiumFoodCard';
import { CartSidebar } from '../components/menu/CartSidebar';

export const MenuPage = () => {
  const [rawMenu, setRawMenu] = useState<any[]>([]);
  const [enrichedMenu, setEnrichedMenu] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    diet: null as 'veg' | 'non-veg' | null,
    bestseller: false,
    fastPrep: false,
    spicy: false,
    healthy: false,
  });

  const { items: cart, total } = useCart();
  const cartItemCount = cart.length; // Or aggregate quantity if items repeat

  const categories = [
    'All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 
    'Beverages', 'Desserts', 'South Indian', 'North Indian', 
    'Chinese', 'Fast Food', 'Healthy Meals'
  ];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(resData => {
        // Handle both { success: true, data: [] } and raw [] array responses
        const data = resData.data || resData; 
        if (Array.isArray(data)) {
          setRawMenu(data);
          
          // Enrich data with premium UI fields since the backend might not have them yet
          const enriched = data.map((item, index) => {
            // Deterministic mock generation based on index/id for consistency
            const idHash = String(item._id || item.id || index).charCodeAt(0);
            
            return {
              id: item._id || item.id,
              name: item.name,
              description: item.description || "A delicious premium meal crafted with fresh ingredients.",
              price: item.price,
              originalPrice: idHash % 3 === 0 ? item.price + 50 : undefined, // Random discount for some
              image: item.image || item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
              category: item.category,
              isVeg: item.category?.toLowerCase() === 'non-veg' ? false : (idHash % 5 !== 0), // Mostly veg mock
              rating: Number((4.0 + (idHash % 10) * 0.1).toFixed(1)),
              reviewsCount: 20 + (idHash % 200),
              prepTime: 10 + (idHash % 25), // 10 to 35 mins
              spiceLevel: (idHash % 4) as 0|1|2|3,
              isAvailable: item.available !== false, // Default true
              isBestseller: idHash % 7 === 0,
              isTrending: idHash % 6 === 0,
              tags: item.tags || [],
            } as FoodItem;
          });
          
          setEnrichedMenu(enriched);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu", err);
        setIsLoading(false);
      });
  }, []);

  const filteredMenu = enrichedMenu.filter(item => {
    // Category Filter
    if (activeCategory !== 'All') {
      // Basic matching logic — can be enhanced
      const catLower = item.category?.toLowerCase() || '';
      const activeLower = activeCategory.toLowerCase();
      if (!catLower.includes(activeLower)) return false;
    }

    // Search Filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Advanced Filters
    if (filters.diet === 'veg' && !item.isVeg) return false;
    if (filters.diet === 'non-veg' && item.isVeg) return false;
    if (filters.bestseller && !item.isBestseller) return false;
    if (filters.fastPrep && item.prepTime > 15) return false;
    if (filters.spicy && item.spiceLevel === 0) return false;
    if (filters.healthy && !item.category?.toLowerCase().includes('health')) return false; // Mock logic

    return true;
  });

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white font-sans selection:bg-brand/30 selection:text-brand pb-24 pt-16">
      
      {/* ── Sticky Top Header ── */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Logo / Title (Mobile hidden, shown on large) */}
          <div className="hidden md:block">
            <h1 className="font-display text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-light">
              Menu
            </h1>
          </div>

          {/* Smart Search Bar */}
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search for your favorite meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-24 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white/10 transition-all shadow-inner"
            />
            <button className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full premium-gradient text-white text-[10px] font-bold uppercase tracking-wider shadow-lg transition-all duration-300",
              searchQuery ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:pointer-events-auto"
            )}>
              Search
            </button>
          </div>

          {/* Veg/Non-Veg Toggle in Header */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-0.5 sm:gap-1 scale-90 sm:scale-100">
            <button 
              onClick={() => setFilters({ ...filters, diet: null })}
              className={cn(
                "px-2.5 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all",
                filters.diet === null ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setFilters({ ...filters, diet: 'veg' })}
              className={cn(
                "px-2.5 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                filters.diet === 'veg' ? "bg-green-500/20 text-green-400" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
              <span className="hidden xs:inline">Veg</span>
            </button>
            <button 
              onClick={() => setFilters({ ...filters, diet: 'non-veg' })}
              className={cn(
                "px-2.5 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                filters.diet === 'non-veg' ? "bg-red-500/20 text-red-400" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
              <span className="hidden xs:inline">Non-Veg</span>
            </button>
          </div>

          {/* Icons: Notifications & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hidden sm:block">
              <Bell size={20} className="text-neutral-300" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand rounded-full border-2 border-[#0c0c0c]"></span>
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2.5 sm:px-5 sm:py-2.5 rounded-full premium-gradient shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all duration-300"
            >
              <ShoppingBag size={20} className="text-white" />
              <span className="hidden sm:block font-bold text-white text-sm">₹{total}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-white text-brand text-[10px] sm:text-xs font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* ── Hero Banner ── */}
        <HeroBanner />

        {/* ── Filter Bar & Categories ── */}
        <FilterBar 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filters={filters}
          setFilters={setFilters}
        />

        {/* ── Main Menu Grid ── */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            {activeCategory === 'All' ? 'Explore All' : activeCategory}
          </h2>
          <span className="text-neutral-500 font-medium text-sm">
            {filteredMenu.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={`skel-${i}`} className="glass-card h-[400px] rounded-[2rem] animate-pulse bg-white/5 border border-white/5" />
              ))
            ) : filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <PremiumFoodCard key={item.id} item={item} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Search size={40} className="text-neutral-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No meals found</h3>
                <p className="text-neutral-400 max-w-sm">
                  We couldn't find any dishes matching your current filters. Try tweaking your search or clearing filters.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ diet: null, bestseller: false, fastPrep: false, spicy: false, healthy: false });
                    setActiveCategory('All');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-medium text-sm"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Floating Cart Sidebar ── */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Filter, Flame, Clock, Leaf, Star, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  filters,
  setFilters
}) => {
  
  const toggleFilter = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* ── Categories Scroll ── */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
              activeCategory === cat 
                ? "premium-gradient text-white border-transparent shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105" 
                : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Advanced Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2 text-neutral-500 font-medium text-sm hidden sm:flex">
          <Filter size={16} />
          Filters:
        </div>



        {/* Bestseller Toggle */}
        <button
          onClick={() => toggleFilter('bestseller', true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
            filters.bestseller
              ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
              : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <TrendingUp size={14} />
          Bestsellers
        </button>

        {/* Fast Prep Toggle */}
        <button
          onClick={() => toggleFilter('fastPrep', true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
            filters.fastPrep
              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
              : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <Clock size={14} />
          <span className="hidden sm:inline">Fast Prep</span>
          <span className="sm:hidden">&lt; 10m</span>
        </button>

        {/* Spicy Toggle */}
        <button
          onClick={() => toggleFilter('spicy', true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
            filters.spicy
              ? "bg-red-500/20 border-red-500/50 text-red-400"
              : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <Flame size={14} />
          Spicy
        </button>
        
        {/* Healthy Toggle */}
        <button
          onClick={() => toggleFilter('healthy', true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border",
            filters.healthy
              ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
              : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <Leaf size={14} />
          Healthy
        </button>
      </div>
    </div>
  );
};

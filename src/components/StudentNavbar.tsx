import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, User, LayoutDashboard, UtensilsCrossed, History, CreditCard, Settings, Search, Bell, Menu, X, ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const StudentNavbar = () => {
  const location = useLocation();
  const { items } = useCart();
  const { logout, user } = useAuth();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl premium-gradient">
            <UtensilsCrossed className="text-white" size={20} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">Canteenly</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </Link>
          {user ? (
            <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={logout}>
              <User size={16} className="mr-2" />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <User size={16} className="mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

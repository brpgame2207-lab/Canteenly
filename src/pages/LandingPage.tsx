import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Utensils, Zap, Clock, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="relative overflow-hidden pt-24">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-30">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-brand-light/10 blur-[100px]" />
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center rounded-full bg-brand/10 border border-brand/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            The Future of Canteen Management
          </span>
          <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            Smarter Food, <br />
            <span className="text-gradient">Zero Queues.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-400 md:text-xl">
            Order your favorite meals, track live queue status, and pay seamlessly with your student wallet. Powered by AI for the ultimate dining experience.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link to="/menu">
              <Button size="lg" className="group h-16 px-12">
                Order Now
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="lg" className="h-16 px-12">
                Admin Portal
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mt-24"
        >
          <div className="glass-card mx-auto max-w-5xl overflow-hidden rounded-3xl p-4 shadow-2xl">
            <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 relative">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop" 
                alt="Premium Food" 
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Floating Widgets */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-white">Live Queue: 2 mins</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Star className="text-yellow-500" size={16} fill="currentColor" />
                  <span className="text-sm font-medium text-white">Chef's Choice: Spicy Paneer</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div> section with stats
      </section>

      {/* Features Bento Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center font-display text-4xl font-bold text-white mb-16">Designed for Modern Campuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl group">
             <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-brand" size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Instant Ordering</h3>
             <p className="text-neutral-400">Skip the line and place orders with a single tap from anywhere on campus.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl md:col-span-2 group">
             <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                <div>
                   <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Clock className="text-brand" size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Live Tracking</h3>
                   <p className="text-neutral-400">Real-time status updates on your meal preparation and estimated pickup time.</p>
                </div>
                <div className="bg-neutral-900/50 rounded-2xl p-4 border border-white/5 space-y-3">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-neutral-800" />
                            <div className="h-2 w-24 bg-neutral-700 rounded" />
                         </div>
                         <div className="h-2 w-12 bg-brand/40 rounded" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

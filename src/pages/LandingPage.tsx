import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowRight, Zap, Clock, Star, QrCode, Smartphone, Sparkles, ChefHat, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL = 'https://res.cloudinary.com/dqz9fw80j/video/upload/q_auto/f_auto/v1778871642/Breakfast_transformation_animati__202605152345_r30f8g.mp4';

export const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── Lenis smooth scroll, wired into GSAP's ticker ────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });
    lenisRef.current = lenis;

    // Wire Lenis into GSAP ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ─── GSAP hero pin + RAF-based video scrub ─────────────────────────────────
  useGSAP(() => {
    const video = videoRef.current;

    // Smoothly interpolated progress value (avoids frame jumps)
    let currentProgress = 0;
    let targetProgress = 0;
    let rafId: number;

    const updateVideo = () => {
      // Lerp toward target progress at a rate that feels cinematic
      currentProgress += (targetProgress - currentProgress) * 0.08;
      if (video && video.readyState >= 2 && video.duration) {
        video.currentTime = currentProgress * video.duration;
      }
      rafId = requestAnimationFrame(updateVideo);
    };
    rafId = requestAnimationFrame(updateVideo);

    // Pin the hero section and capture scroll progress
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=400%',
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    // Fade out hero text in first 15% of scroll
    gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=60%',
        scrub: 2,
        invalidateOnRefresh: true,
      }
    }).to(heroTextRef.current, {
      y: -80,
      opacity: 0,
      ease: 'power2.inOut',
    });

    // Staggered reveal for below sections
    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((elem) => {
      gsap.fromTo(elem,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => cancelAnimationFrame(rafId);
  }, { scope: containerRef });

  return (
    <>
      <div ref={containerRef} className="text-white selection:bg-brand/30 bg-black">

        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative h-screen w-full flex items-center justify-center overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Fullscreen video – GPU layer */}
          <video
            ref={videoRef}
            src={VIDEO_URL}
            preload="auto"
            muted
            playsInline
            style={{ willChange: 'transform' }}
            // Scale *only* horizontally to push side white bars off screen without zooming vertical height
            className="absolute inset-0 w-full h-full object-cover scale-x-[1.06]"
          />

          {/* Hero text – positioned above video */}
          <div
            ref={heroTextRef}
            className="relative z-10 mx-auto max-w-7xl px-6 text-center"
            style={{ willChange: 'opacity, transform' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 backdrop-blur-md mb-8">
                Smart Canteen Experience
              </span>
              <h1 className="font-display text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-[6rem] leading-[1.08]">
                Skip Queues.
                <br />
                <span className="bg-gradient-to-r from-orange-300 via-brand to-orange-600 bg-clip-text text-transparent">
                  Order Faster.
                </span>
                <br />
                Eat Smarter.
              </h1>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/menu">
                  <Button size="lg" className="group h-14 px-10 text-base rounded-full transition-all duration-300">
                    Order Now
                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-base rounded-full bg-white/5 border-white/15 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2-7. Below content ──────────────────────────────────────────── */}
        <div className="relative z-20 bg-black">

          {/* 2. Bento-grid features */}
          <section className="mx-auto max-w-7xl px-6 py-32">
            <div className="text-center mb-20 reveal-up">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Reimagining Campus Dining
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                A unified ecosystem designed to eliminate wait times and elevate your daily meals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-10 rounded-[2rem] group reveal-up relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="text-brand" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Place orders with a single tap. Our optimized kitchen routing ensures your food starts preparing instantly.
                </p>
              </div>

              <div className="glass-card p-10 rounded-[2rem] md:col-span-2 group reveal-up relative overflow-hidden bg-neutral-900/40 border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-opacity duration-700 translate-x-1/4 -translate-y-8">
                  <Smartphone size={140} className="text-brand rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full max-w-md">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="text-brand" size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Wallet Integration</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed">
                    Top up your student ID, split bills with friends, and enjoy zero-fee microtransactions directly on campus.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Dashboard showcase */}
          <section className="py-32 relative overflow-hidden border-y border-white/5 bg-neutral-950/60">
            <div className="mx-auto max-w-7xl px-6 text-center mb-16 reveal-up">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Control at your fingertips</h2>
              <p className="text-xl text-neutral-400">Manage orders, track spending, and discover new favorites.</p>
            </div>
            <div className="mx-auto max-w-5xl px-6 reveal-up">
              <div className="glass-card rounded-t-[2.5rem] border-b-0 overflow-hidden pt-8 px-8 relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/10 rounded-full" />
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop"
                  alt="Dashboard Interface"
                  loading="lazy"
                  className="w-full rounded-t-[1.5rem] border border-white/10 border-b-0 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              </div>
            </div>
          </section>

          {/* 4. Live queue cards */}
          <section className="mx-auto max-w-7xl px-6 py-32">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="reveal-up order-2 md:order-1">
                <div className="relative">
                  <div className="glass-card p-6 rounded-3xl border border-white/10 relative z-10 shadow-xl hover:-translate-y-1 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-white font-medium">Order #4092</span>
                      <span className="px-3 py-1 bg-brand/20 text-brand rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">Preparing</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                          <ChefHat className="text-neutral-400" size={24} />
                        </div>
                        <div>
                          <p className="text-white font-medium">Spicy Paneer Tikka Wrap</p>
                          <p className="text-sm text-neutral-400">Est. 4 mins remaining</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand to-orange-400 w-2/3 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal-up order-1 md:order-2">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Clock className="text-brand" size={28} />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">Never wait blindly again.</h2>
                <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                  Our AI engine predicts queue times with 95% accuracy. Know exactly when to leave your dorm so your food is hot and ready the second you arrive.
                </p>
                <ul className="space-y-4 text-neutral-300">
                  <li className="flex items-center gap-3"><ArrowRight className="text-brand shrink-0" size={18} /> Live push notifications</li>
                  <li className="flex items-center gap-3"><ArrowRight className="text-brand shrink-0" size={18} /> Kitchen load balancing</li>
                  <li className="flex items-center gap-3"><ArrowRight className="text-brand shrink-0" size={18} /> Historical wait time charts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5 & 6. QR + AI */}
          <section className="py-32 bg-neutral-900/30 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-12 rounded-[2.5rem] reveal-up relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 translate-x-1/4 translate-y-1/4">
                    <QrCode size={200} className="text-white" />
                  </div>
                  <div className="relative z-10">
                    <QrCode size={48} className="text-brand mb-8" />
                    <h3 className="text-3xl font-bold text-white mb-4">Table-side QR</h3>
                    <p className="text-lg text-neutral-400 mb-8 max-w-sm">Sit down, scan the table code, and order directly. No lines, no shouting over loud crowds.</p>
                    <Button variant="outline" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white">Learn More</Button>
                  </div>
                </div>

                <div className="glass-card p-12 rounded-[2.5rem] reveal-up relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 translate-x-1/4 -translate-y-1/4">
                    <Star size={200} className="text-yellow-500" />
                  </div>
                  <div className="relative z-10">
                    <Star size={48} className="text-yellow-500 mb-8" />
                    <h3 className="text-3xl font-bold text-white mb-4">AI Taste Match</h3>
                    <p className="text-lg text-neutral-400 mb-8 max-w-sm">Our recommendation engine learns your palate and suggests new daily specials you're guaranteed to love.</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-300">Spicy</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-300">High Protein</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Footer */}
          <footer className="border-t border-white/10 bg-black pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-orange-600 flex items-center justify-center">
                      <Utensils size={18} className="text-white" />
                    </div>
                    <span className="font-display text-xl font-bold text-white">Canteenly</span>
                  </div>
                  <p className="text-neutral-400 max-w-sm">Elevating the campus dining experience through intelligent technology, seamless payments, and beautiful design.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-6">Product</h4>
                  <ul className="space-y-4 text-neutral-400">
                    <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                    <li><Link to="/wallet" className="hover:text-white transition-colors">Student Wallet</Link></li>
                    <li><Link to="/history" className="hover:text-white transition-colors">Order History</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-6">Legal</h4>
                  <ul className="space-y-4 text-neutral-400">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-neutral-500 text-sm">
                <p>&copy; 2026 Canteenly Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </footer>
        </div>

      </div>
    </>
  );
};

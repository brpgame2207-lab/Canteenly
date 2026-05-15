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

const VIDEO_URL =
  'https://res.cloudinary.com/dqz9fw80j/video/upload/q_auto/f_auto/v1778871642/Breakfast_transformation_animati__202605152345_r30f8g.mp4';

export const LandingPage = () => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const heroRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  // ── Lenis → GSAP ticker sync ────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75,
    });
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(onTick); lenis.destroy(); };
  }, []);

  // ── All GSAP / ScrollTrigger setup lives here ────────────────────────────────
  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    // lerp state for butter-smooth video scrubbing
    let targetTime = 0;
    let currentTime = 0;

    // RAF loop — lerps video.currentTime toward targetTime every frame
    const rafTick = () => {
      if (video.readyState >= 2 && video.duration) {
        currentTime += (targetTime - currentTime) * 0.1;
        if (Math.abs(currentTime - video.currentTime) > 0.001) {
          video.currentTime = currentTime;
        }
      }
      rafRef.current = requestAnimationFrame(rafTick);
    };
    rafRef.current = requestAnimationFrame(rafTick);

    // ── Single pinned ScrollTrigger — drives BOTH video scrub & text fade ──
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=400%',
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      onUpdate: (self) => {
        // Video scrub (RAF loop reads targetTime)
        if (video.duration) {
          targetTime = self.progress * video.duration;
        }

        // Text fade: fade out in first 12.5% of pinned scroll
        const textProgress = Math.min(self.progress / 0.125, 1);
        if (textRef.current) {
          textRef.current.style.opacity = String(1 - textProgress);
          textRef.current.style.transform = `translate3d(0, ${-textProgress * 70}px, 0)`;
        }
      },
    });

    // ── Section reveal animations ────────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className="bg-black text-white selection:bg-orange-500/20">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[100svh] w-full overflow-hidden"
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          preload="auto"
          muted
          playsInline
          // Mobile: 1.015 trim | Desktop: 1.06 trim to remove encoded white padding
          className="absolute inset-0 w-full h-full object-cover scale-x-[1.015] sm:scale-x-[1.06]"
          style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        />
        {/* Lightweight vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)' }}
        />

        {/* Hero text — faded out by onUpdate above */}
        <div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-6 sm:mb-10 backdrop-blur-sm">
                Smart Canteen Experience
              </span>
              <h1 className="font-display text-[2.2rem] leading-[1.1] sm:text-5xl sm:leading-[1.05] md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white">
                Skip Queues.
                <br />
                <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent">
                  Order Faster.
                </span>
                <br />
                Eat Smarter.
              </h1>
              <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto h-12 sm:h-13 px-8 text-sm rounded-full transition-all duration-300 hover:scale-[1.03]">
                    Order Now
                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-0.5" size={16} />
                  </Button>
                </Link>
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-13 px-8 text-sm rounded-full border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BELOW CONTENT ─────────────────────────────────────────────────────── */}
      <div className="relative bg-black">

        {/* 2. Bento features */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="text-center mb-12 sm:mb-20 reveal-up">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Reimagining Campus Dining
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto">
              A unified ecosystem designed to eliminate wait times and elevate your daily meals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="glass-card p-7 sm:p-9 rounded-3xl group reveal-up relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 sm:mb-7 group-hover:scale-110 transition-transform duration-500">
                <Zap className="text-orange-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                Place orders with a single tap. Our optimized kitchen routing ensures your food starts preparing instantly.
              </p>
            </div>
            <div className="glass-card p-7 sm:p-9 rounded-3xl md:col-span-2 group reveal-up relative overflow-hidden border border-white/5 bg-neutral-900/40">
              <div className="absolute top-0 right-0 p-6 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-700 translate-x-8 -translate-y-4">
                <Smartphone size={130} className="text-orange-400 rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col justify-center h-full max-w-sm">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 sm:mb-7 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="text-orange-400" size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Wallet Integration</h3>
                <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                  Top up your student ID, split bills with friends, and enjoy zero-fee microtransactions on campus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Dashboard */}
        <section className="py-16 sm:py-24 lg:py-32 border-y border-white/5 bg-neutral-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center mb-10 sm:mb-14 reveal-up">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Control at your fingertips</h2>
            <p className="text-base sm:text-lg text-neutral-400">Manage orders, track spending, and discover new favorites.</p>
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 reveal-up">
            <div className="glass-card rounded-t-3xl border-b-0 overflow-hidden pt-5 sm:pt-7 px-5 sm:px-7 relative">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/10 rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop"
                alt="Dashboard Interface"
                loading="lazy"
                className="w-full rounded-t-2xl border border-white/10 border-b-0 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* 4. Live queue */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="reveal-up order-2 md:order-1">
              <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 hover:-translate-y-1 transition-transform duration-500">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-white font-medium text-sm sm:text-base">Order #4092</span>
                  <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-pulse">Preparing</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                      <ChefHat className="text-neutral-400" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Spicy Paneer Tikka Wrap</p>
                      <p className="text-xs sm:text-sm text-neutral-400">Est. 4 mins remaining</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-300 w-2/3 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal-up order-1 md:order-2">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Clock className="text-orange-400" size={24} />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">Never wait blindly again.</h2>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-7">
                Our AI engine predicts queue times with 95% accuracy. Know exactly when to leave so your food is hot when you arrive.
              </p>
              <ul className="space-y-3 text-neutral-300 text-sm sm:text-base">
                {['Live push notifications', 'Kitchen load balancing', 'Historical wait time charts'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <ArrowRight className="text-orange-400 shrink-0" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5 & 6. QR + AI */}
        <section className="py-16 sm:py-24 lg:py-32 bg-neutral-900/30 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="glass-card p-8 sm:p-10 rounded-3xl reveal-up relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-6 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-700 translate-x-6 translate-y-6">
                  <QrCode size={160} className="text-white" />
                </div>
                <div className="relative z-10">
                  <QrCode size={36} className="text-orange-400 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Table-side QR</h3>
                  <p className="text-neutral-400 mb-6 max-w-xs text-sm sm:text-base">Sit down, scan the table code, and order directly. No lines, no shouting.</p>
                  <Button variant="outline" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm">Learn More</Button>
                </div>
              </div>
              <div className="glass-card p-8 sm:p-10 rounded-3xl reveal-up relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-6 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-700 translate-x-6 -translate-y-6">
                  <Star size={160} className="text-yellow-500" />
                </div>
                <div className="relative z-10">
                  <Star size={36} className="text-yellow-400 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Taste Match</h3>
                  <p className="text-neutral-400 mb-6 max-w-xs text-sm sm:text-base">Our recommendation engine learns your palate and suggests new daily specials you'll love.</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">Spicy</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">High Protein</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black pt-14 sm:pt-20 pb-8 sm:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
                    <Utensils size={16} className="text-white" />
                  </div>
                  <span className="font-display text-lg font-bold text-white">Canteenly</span>
                </div>
                <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                  Elevating the campus dining experience through intelligent technology and beautiful design.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 sm:mb-5 text-sm">Product</h4>
                <ul className="space-y-3 text-neutral-500 text-sm">
                  <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                  <li><Link to="/wallet" className="hover:text-white transition-colors">Student Wallet</Link></li>
                  <li><Link to="/history" className="hover:text-white transition-colors">Order History</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 sm:mb-5 text-sm">Legal</h4>
                <ul className="space-y-3 text-neutral-500 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-white/5 text-neutral-600 text-xs gap-3 sm:gap-0">
              <p>&copy; 2026 Canteenly Inc. All rights reserved.</p>
              <div className="flex gap-5">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

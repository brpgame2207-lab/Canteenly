import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight, Zap, Clock, Star, QrCode,
  Smartphone, Sparkles, ChefHat, Utensils,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL =
  'https://res.cloudinary.com/dqz9fw80j/video/upload/q_auto/f_auto/v1778871642/Breakfast_transformation_animati__202605152345_r30f8g.mp4';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Kill stale triggers (HMR safety) ─────────────────────────────────
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.ticker.lagSmoothing(0);

    // ── Lenis — momentum-based smooth scroll ─────────────────────────────
    // Official Lenis + GSAP integration:
    // GSAP ticker gives `time` in SECONDS since init.
    // Lenis.raf() expects an absolute timestamp in MILLISECONDS.
    // So we pass `time * 1000`.  This is the ONLY correct way.
    const lenis = new Lenis({
      lerp: 0.07,          // 0.07 = ultra-floaty, max momentum feel
    });

    // Feed Lenis the timestamp every GSAP frame
    const lenisRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);

    // Keep ScrollTrigger in sync with Lenis virtual scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // ── Video scrub via seeking gate ──────────────────────────────────────
    // Browsers serialize seeks — spamming currentTime drops frames.
    // Queue only the latest desired time, apply on 'seeked'.
    const video = videoRef.current;
    const hero = heroRef.current;
    const text = textRef.current;
    const scene2 = scene2Ref.current;
    const scene3 = scene3Ref.current;
    if (!video || !hero || !text || !scene2 || !scene3) return;

    // Helper: clamp a progress range [a,b] → [0,1]
    const clamp = (p: number, a: number, b: number) =>
      Math.min(1, Math.max(0, (p - a) / (b - a)));

    video.pause();
    video.currentTime = 0;

    // ── Triple-layer smoothing for ultra-cinematic video scrub ────────────
    // Layer 1: Lenis lerp smooths the scroll wheel input
    // Layer 2: scrub:2 smooths the scroll→progress mapping
    // Layer 3: RAF lerp below smooths the progress→currentTime mapping

    let targetTime = 0;   // driven by ScrollTrigger progress
    let smoothTime = 0;   // lerped toward targetTime each frame
    let rafId = 0;

    // Seeking gate — prevents browser seek-spam drops
    let isSeeking = false;
    let pendingTime: number | null = null;

    const doSeek = (t: number) => {
      if (isSeeking) { pendingTime = t; return; }
      isSeeking = true;
      video.currentTime = t;
    };
    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        doSeek(t);
      }
    };
    video.addEventListener('seeked', onSeeked);

    // RAF loop: lerp smoothTime → targetTime at 8% per frame (~60fps)
    const rafTick = () => {
      if (video.readyState >= 2 && video.duration) {
        smoothTime += (targetTime - smoothTime) * 0.08;
        if (Math.abs(smoothTime - video.currentTime) > 0.008) {
          doSeek(smoothTime);
        }
      }
      rafId = requestAnimationFrame(rafTick);
    };
    rafId = requestAnimationFrame(rafTick);

    // ── Hero pinned scroll scene ──────────────────────────────────────────
    let heroST: ScrollTrigger | null = null;

    const buildScene = () => {
      heroST?.kill();
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;

      heroST = ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '+=250%', // Halved the scroll distance required to complete the video
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        scrub: 2,              // 2s lag = slow, cinematic camera feel
        onUpdate: (self) => {
          const p = self.progress;

          // Set target — RAF lerp will ease toward it
          targetTime = p * dur;

          // ── Scene 1: hero text — fade out 0→0.20
          const s1Out = clamp(p, 0.10, 0.20);
          text.style.opacity = String(1 - s1Out);
          text.style.transform = `translate3d(0,${-s1Out * 50}px,0)`;

          // ── Scene 2: Reimagining — fade IN 0.22→0.35, fade OUT 0.58→0.68
          const s2In = clamp(p, 0.22, 0.35);
          const s2Out = clamp(p, 0.58, 0.68);
          const s2Op = s2In * (1 - s2Out);
          scene2.style.opacity = String(s2Op);
          scene2.style.transform = `translate3d(0,${(1 - s2In) * 40 - s2Out * 40}px,0)`;

          // ── Scene 3: Control — fade IN 0.68→0.78, fade OUT 0.95→1.00
          const s3In = clamp(p, 0.68, 0.78);
          const s3Out = clamp(p, 0.95, 1.00);
          const s3Op = s3In * (1 - s3Out);
          scene3.style.opacity = String(s3Op);
          scene3.style.transform = `translate3d(0,${(1 - s3In) * 40 - s3Out * 40}px,0)`;
        },
      });

      ScrollTrigger.refresh();
    };

    // Build immediately if metadata already loaded, otherwise wait
    if (video.readyState >= 1 && isFinite(video.duration)) {
      buildScene();
    } else {
      video.addEventListener('loadedmetadata', buildScene, { once: true });
    }

    // ── Section reveal animations ─────────────────────────────────────────
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal-up');
    revealEls.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: (i % 3) * 0.07,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', buildScene);
      heroST?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-black text-white selection:bg-orange-500/20">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      >
        {/* Scroll-scrubbed video — scale-x trims encoded white edge padding */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          preload="auto"
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-x-[1.015] sm:scale-x-[1.06]"
          style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', willChange: 'transform' }}
        />

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 20%, rgba(0,0,0,0.45) 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-black/70 to-transparent" />

        {/* ── Scene 1: Hero copy — GSAP dissolves via textRef ── */}
        <div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 44, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.8, ease: EASE_OUT }}
            >
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-7 sm:mb-11 backdrop-blur-sm">
                Smart Canteen Experience
              </span>
              <h1 className="font-display text-[2.2rem] leading-[1.08] sm:text-5xl sm:leading-[1.05] md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
                Skip Queues.
                <br />
                <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent">
                  Order Faster.
                </span>
                <br />
                Eat Smarter.
              </h1>
              <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto h-12 sm:h-14 px-9 text-sm rounded-full shadow-[0_0_40px_rgba(255,107,0,0.35)] hover:shadow-[0_0_60px_rgba(255,107,0,0.55)] transition-shadow duration-500">
                    Order Now
                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1 duration-300" size={16} />
                  </Button>
                </Link>
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-9 text-sm rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/12 transition-all duration-300">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Scene 2: Reimagining Campus Dining ── */}
        <div
          ref={scene2Ref}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
          style={{ opacity: 0, willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-5xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-7 sm:mb-11 backdrop-blur-sm">
              Our Mission
            </span>
            <h2 className="font-display text-[2.2rem] leading-[1.08] sm:text-5xl sm:leading-[1.05] md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
              Reimagining<br />
              <span className="text-white drop-shadow-[0_4px_32px_rgba(0,0,0,1)] [text-stroke:1px_rgba(0,0,0,0.5)]" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}>
                Campus Dining.
              </span><br />
              Elevated.
            </h2>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {[
                { label: '95%', sub: 'Queue accuracy' },
                { label: '< 30s', sub: 'Order time' },
                { label: '5,000+', sub: 'Daily orders' },
              ].map(s => (
                <div key={s.label} className="px-6 py-4 rounded-2xl premium-gradient backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,107,0,0.35)]">
                  <p className="text-white font-black text-xl sm:text-2xl">{s.label}</p>
                  <p className="text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scene 3: Control at your fingertips ── */}
        <div
          ref={scene3Ref}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
          style={{ opacity: 0, willChange: 'opacity, transform' }}
        >
          <div className="w-full max-w-5xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-7 sm:mb-11 backdrop-blur-sm">
              Smart Dashboard
            </span>
            <h2 className="font-display text-[2.2rem] leading-[1.08] sm:text-5xl sm:leading-[1.05] md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
              Control at<br />
              <span className="text-white drop-shadow-[0_4px_32px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}>
                Your Fingertips.
              </span><br />
              Effortlessly.
            </h2>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {['Live order tracking', 'Smart wallet', 'AI recommendations'].map(f => (
                <div key={f} className="flex items-center gap-3 px-6 py-3 rounded-full premium-gradient backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,107,0,0.35)]">
                  <ArrowRight className="text-white shrink-0" size={16} />
                  <span className="text-white text-sm font-bold tracking-wide">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BELOW-FOLD CONTENT ────────────────────────────────────────────── */}
      <div className="relative bg-black">

        {/* Features Bento */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-10 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="glass-card p-7 sm:p-9 rounded-3xl group reveal-up relative overflow-hidden cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-7 transition-transform duration-500 group-hover:scale-110">
                <Zap className="text-orange-400" size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                Place orders with a single tap. Optimized kitchen routing starts your food instantly.
              </p>
            </div>

            <div className="glass-card p-7 sm:p-9 rounded-3xl md:col-span-2 group reveal-up relative overflow-hidden border border-white/5 bg-neutral-900/40 cursor-default">
              <div className="absolute top-0 right-0 p-6 opacity-[0.06] group-hover:opacity-[0.13] transition-opacity duration-700 translate-x-8 -translate-y-4 pointer-events-none">
                <Smartphone size={130} className="text-orange-400 rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col justify-center h-full max-w-sm">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-7 transition-transform duration-500 group-hover:scale-110">
                  <Sparkles className="text-orange-400" size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Wallet Integration</h3>
                <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                  Top up your student ID, split bills, and enjoy zero-fee microtransactions on campus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Queue */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-10 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div className="reveal-up order-2 md:order-1">
              <div className="glass-card p-6 rounded-3xl border border-white/10 hover:-translate-y-1 transition-transform duration-500 cursor-default">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-white font-medium text-sm sm:text-base">Order #4092</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-pulse">
                    Preparing
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
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

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
                Never wait blindly again.
              </h2>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-7">
                Our AI engine predicts queue times with 95% accuracy. Know exactly when to leave so your food is hot when you arrive.
              </p>
              <ul className="space-y-3 text-neutral-300 text-sm sm:text-base">
                {['Live push notifications', 'Kitchen load balancing', 'Historical wait time charts'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <ArrowRight className="text-orange-400 shrink-0" size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* QR + AI Cards */}
        <section className="pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36 bg-neutral-900/30 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-card p-8 sm:p-10 rounded-3xl reveal-up relative overflow-hidden group cursor-default">
                <div className="absolute right-0 bottom-0 p-6 opacity-[0.06] group-hover:opacity-[0.13] transition-opacity duration-700 translate-x-6 translate-y-6 pointer-events-none">
                  <QrCode size={160} className="text-white" />
                </div>
                <div className="relative z-10">
                  <QrCode size={34} className="text-orange-400 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Table-side QR</h3>
                  <p className="text-neutral-400 mb-6 max-w-xs text-sm sm:text-base leading-relaxed">
                    Sit down, scan the table code, and order directly. No lines, no shouting.
                  </p>
                  <Button variant="outline" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm">
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="glass-card p-8 sm:p-10 rounded-3xl reveal-up relative overflow-hidden group cursor-default">
                <div className="absolute right-0 top-0 p-6 opacity-[0.06] group-hover:opacity-[0.13] transition-opacity duration-700 translate-x-6 -translate-y-6 pointer-events-none">
                  <Star size={160} className="text-yellow-500" />
                </div>
                <div className="relative z-10">
                  <Star size={34} className="text-yellow-400 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Taste Match</h3>
                  <p className="text-neutral-400 mb-6 max-w-xs text-sm sm:text-base leading-relaxed">
                    Our recommendation engine learns your palate and suggests new daily specials you'll love.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">Spicy</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">High Protein</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">Vegetarian</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black pt-16 sm:pt-24 pb-8 sm:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-14 mb-14">
              <div className="col-span-2">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
                    <Utensils size={15} className="text-white" />
                  </div>
                  <span className="font-display text-lg font-bold text-white">Canteenly</span>
                </div>
                <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                  Elevating the campus dining experience through intelligent technology and beautiful design.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-5 text-sm">Product</h4>
                <ul className="space-y-3 text-neutral-500 text-sm">
                  <li><Link to="/menu" className="hover:text-white transition-colors duration-200">Menu</Link></li>
                  <li><Link to="/wallet" className="hover:text-white transition-colors duration-200">Student Wallet</Link></li>
                  <li><Link to="/history" className="hover:text-white transition-colors duration-200">Order History</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-5 text-sm">Legal</h4>
                <ul className="space-y-3 text-neutral-500 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between pt-7 border-t border-white/5 text-neutral-600 text-xs gap-3">
              <p>&copy; 2026 Canteenly Inc. All rights reserved.</p>
              <div className="flex gap-5">
                <a href="#" className="hover:text-white transition-colors duration-200">Twitter</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Instagram</a>
                <a href="#" className="hover:text-white transition-colors duration-200">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { markIntroDone } from "@/lib/motion";
import { EASE } from "./ui/primitives";

/**
 * Counts to 100, then the counter rises out while the curtain lifts — and the
 * hero's entrance is triggered at that same moment so the two overlap.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let seen = false;
    try { seen = !!sessionStorage.getItem("seen-preloader"); } catch {}
    // Deep links (#section or ?nointro) go straight to content
    if (location.hash || new URLSearchParams(location.search).has("nointro")) seen = true;
    if (seen) {
      const t = setTimeout(() => { setDone(true); markIntroDone(); }, 0);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      setProgress(100);
      setDone(true);
      markIntroDone();
      document.documentElement.style.overflow = "";
      try { sessionStorage.setItem("seen-preloader", "1"); } catch {}
    };
    // Timer fallback: rAF is paused in background tabs, so never let the loader block the page
    const fallback = setTimeout(finish, 2400);
    const start = performance.now();
    const DURATION = 1300;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(fallback); document.documentElement.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="preloader" className="fixed inset-0 z-[200] pointer-events-none" exit={{ opacity: 1 }} transition={{ duration: 1.1 }}>
          {/* Two curtain panels: the back one trails the front for depth */}
          <motion.div
            className="absolute inset-0 bg-accent/70"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
          />
          <motion.div
            className="absolute inset-0 bg-ink flex flex-col justify-between p-6 md:p-10 pointer-events-auto"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-between eyebrow">
              <span>{profile.name}</span>
              <span>Portfolio © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-end justify-between gap-6">
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="text-2xl md:text-4xl font-medium tracking-tight text-muted"
                >
                  Engineering <span className="serif-i text-grad">intelligent</span> software
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="block text-7xl md:text-[10rem] leading-none font-semibold tracking-[-0.05em] tabular-nums"
                >
                  {progress}
                </motion.span>
              </div>
            </div>
            <div className="absolute left-0 bottom-0 h-[2px]" style={{ width: `${progress}%`, background: "var(--grad)" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

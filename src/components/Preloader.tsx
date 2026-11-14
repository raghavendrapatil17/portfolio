"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { EASE } from "./ui/primitives";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let seen = false;
    try { seen = !!sessionStorage.getItem("seen-preloader"); } catch {}
    // Deep links (#section or ?nointro) go straight to content
    if (location.hash || new URLSearchParams(location.search).has("nointro")) seen = true;
    // Skip on repeat visits within the same session
    if (seen) { const t = setTimeout(() => setDone(true), 0); return () => clearTimeout(t); }
    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      setProgress(100);
      setDone(true);
      document.documentElement.style.overflow = "";
      try { sessionStorage.setItem("seen-preloader", "1"); } catch {}
    };
    // Timer fallback: rAF is paused in background tabs, so never let the loader block the page
    const fallback = setTimeout(finish, 2600);
    const start = performance.now();
    const DURATION = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(fallback); document.documentElement.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[200] bg-ink flex flex-col justify-between p-6 md:p-10"
          style={{ clipPath: "inset(0 0 0% 0)" }}
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
                transition={{ duration: 0.8, ease: EASE }}
                className="text-2xl md:text-4xl font-medium tracking-tight text-muted"
              >
                Engineering <span className="serif-i text-grad">intelligent</span> software
              </motion.p>
            </div>
            <span className="text-7xl md:text-[10rem] leading-none font-semibold tracking-[-0.05em] tabular-nums">
              {progress}
            </span>
          </div>
          <div className="absolute left-0 bottom-0 h-[2px] bg-[var(--grad)]" style={{ width: `${progress}%`, background: "var(--grad)" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

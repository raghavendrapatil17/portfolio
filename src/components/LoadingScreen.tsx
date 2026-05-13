"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setDone(true), 400); return 100; }
        return p + Math.random() * 18;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const clamped = Math.min(100, Math.round(pct));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loading-screen flex-col gap-8"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-5xl font-black gradient-text mb-2">RSP</div>
            <div className="text-xs text-cyan-400/60 tracking-[0.4em] uppercase">Portfolio v2.0</div>
          </motion.div>

          {/* Spinning rings */}
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border-2 border-transparent border-t-blue-500"
            />
            <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
              {clamped}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#00f5ff,#a855f7)" }}
              animate={{ width: `${clamped}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="text-xs text-white/30 font-mono tracking-widest">
            INITIALIZING EXPERIENCE...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

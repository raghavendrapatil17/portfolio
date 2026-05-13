"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // countapi.xyz — free, no signup, persists forever
    fetch("https://api.countapi.xyz/hit/raghavendra-spatil-portfolio/visits")
      .then((r) => r.json())
      .then((d) => setCount(d.value))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-8 z-[150] flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono cursor-default pointer-events-none"
      style={{
        background: "rgba(2,4,8,0.8)",
        border: "1px solid rgba(0,245,255,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="text-white/40">{count.toLocaleString()} visitors</span>
    </motion.div>
  );
}

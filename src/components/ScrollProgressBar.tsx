"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => { spring.set(progress); }, [progress, spring]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full origin-left rounded-full"
        style={{
          scaleX: progress / 100,
          background: "linear-gradient(90deg, #00f5ff, #6366f1, #a855f7)",
          boxShadow: "0 0 10px rgba(0,245,255,0.8), 0 0 20px rgba(99,102,241,0.5)",
        }}
      />
    </div>
  );
}

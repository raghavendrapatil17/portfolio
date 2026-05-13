"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

export default function FloatingBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.15, y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-[150] w-12 h-12 rounded-full flex items-center justify-center cursor-none"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))",
            border: "1px solid rgba(0,245,255,0.4)",
            boxShadow: "0 0 20px rgba(0,245,255,0.2), 0 0 40px rgba(168,85,247,0.1)",
          }}
        >
          <FiArrowUp size={18} className="text-cyan-400" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

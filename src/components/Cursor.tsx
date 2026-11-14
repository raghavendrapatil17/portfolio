"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Soft trailing cursor ring. Shown only for fine pointers (CSS); native cursor stays visible. */
export default function Cursor() {
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 35, mass: 0.4 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [data-cursor]"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="hidden [@media(pointer:fine)]:block fixed top-0 left-0 z-[150] pointer-events-none rounded-full border mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{
        width: hover ? 56 : 28,
        height: hover ? 56 : 28,
        borderColor: hover ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
        backgroundColor: hover ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.25 }}
    />
  );
}

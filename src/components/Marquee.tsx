"use client";
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { toolbelt } from "@/data/portfolio";
import { useReducedMotionPref } from "@/lib/motion";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** A row that drifts on its own, accelerates with scroll speed and flips direction with scroll direction. */
function VelocityRow({ items, baseVelocity, outline = false }: { items: string[]; baseVelocity: number; outline?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);
  const reduced = useReducedMotionPref();

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = [...items, ...items, ...items, ...items];
  return (
    <motion.div className="flex whitespace-nowrap" style={{ x, skewX: skew }}>
      {row.map((t, i) => (
        <span
          key={i}
          className={`flex items-center gap-10 pr-10 text-4xl md:text-6xl font-semibold tracking-[-0.03em] transition-colors ${
            outline ? "text-transparent hover:text-fg/80" : "text-fg/80 hover:text-fg"
          }`}
          style={outline ? { WebkitTextStroke: "1px rgb(255 255 255 / 0.22)" } : undefined}
        >
          {t}
          <span className="text-accent text-xl">✦</span>
        </span>
      ))}
    </motion.div>
  );
}

export default function Marquee() {
  const half = Math.ceil(toolbelt.length / 2);
  return (
    <div className="relative border-y border-line py-8 md:py-10 overflow-hidden flex flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <VelocityRow items={toolbelt.slice(0, half)} baseVelocity={-2} />
      <VelocityRow items={toolbelt.slice(half)} baseVelocity={2} outline />
    </div>
  );
}

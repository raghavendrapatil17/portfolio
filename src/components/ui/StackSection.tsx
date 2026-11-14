"use client";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLiteMode } from "@/lib/motion";

/**
 * Wraps a page section so it slides up over the previous one (rounded top,
 * shadow) and, as it scrolls away, recedes: it scales down slightly, rounds
 * its corners and dims under the next section. `tint` gives each section its
 * own faint background glow so colour shifts as you move down the page.
 *
 * `recede={false}` keeps the section free of transforms. Use it for sections
 * containing position: sticky / fixed children, which a transform would break.
 */
export default function StackSection({
  children,
  tint,
  z,
  recede = true,
}: {
  children: ReactNode;
  tint: string;
  z: number;
  recede?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lite } = useLiteMode();
  const active = recede && !lite;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 72]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.65]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={ref} className="relative -mt-10 first:mt-0" style={{ zIndex: z }}>
      <motion.div
        className="relative bg-ink overflow-clip origin-top shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.9)] border-t border-line"
        style={
          active
            ? { scale, y, borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }
            : { borderTopLeftRadius: 40, borderTopRightRadius: 40 }
        }
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(80% 40% at 50% 0%, ${tint}, transparent 70%)` }} />
        <div className="relative">{children}</div>
        {active && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />}
      </motion.div>
    </div>
  );
}

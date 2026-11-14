"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Two-part cursor: a precise dot plus a trailing ring.
 * Over links/buttons the ring grows; over elements with data-cursor="Label"
 * it becomes a filled disc showing that label (e.g. "View", "Open").
 * Shown only for fine pointers (CSS); the native cursor stays visible.
 */
export default function Cursor() {
  const [mode, setMode] = useState<{ hover: boolean; label: string | null }>({ hover: false, label: null });
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  useEffect(() => {
    const update = (t: Element | null) => {
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const label = labelled?.dataset.cursor || null;
      const hover = !!t?.closest("a, button, [data-cursor]");
      setMode((m) => (m.hover === hover && m.label === label ? m : { hover, label }));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      update(e.target as Element | null);
    };
    // Content moves under a still mouse while scrolling — re-check what's beneath it
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(document.elementFromPoint(x.get(), y.get())));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Button fill grows from the entry point and retreats toward the exit point
    const setOrigin = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest<HTMLElement>(".btn");
      if (!btn || (e.relatedTarget instanceof Node && btn.contains(e.relatedTarget))) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--bx", `${e.clientX - r.left}px`);
      btn.style.setProperty("--by", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointerover", setOrigin);
    document.addEventListener("pointerout", setOrigin);
    const press = () => setDown(true);
    // A click often opens or closes an overlay under a still mouse: re-check once it has rendered
    let recheck: ReturnType<typeof setTimeout> | undefined;
    const release = () => {
      setDown(false);
      clearTimeout(recheck);
      recheck = setTimeout(() => update(document.elementFromPoint(x.get(), y.get())), 120);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      clearTimeout(recheck);
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", setOrigin);
      document.removeEventListener("pointerout", setOrigin);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  const size = mode.label ? 88 : mode.hover ? 56 : 30;

  return (
    <div aria-hidden className="hidden [@media(pointer:fine)]:block">
      <motion.div
        className="fixed top-0 left-0 z-[150] pointer-events-none rounded-full grid place-items-center"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", borderWidth: 1, borderStyle: "solid" }}
        initial={false}
        animate={{
          width: size,
          height: size,
          scale: down ? 0.85 : 1,
          backgroundColor: mode.label ? "rgba(237,237,240,1)" : mode.hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0)",
          borderColor: mode.label ? "rgba(237,237,240,0)" : "rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {mode.label && (
            <motion.span
              key={mode.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink"
            >
              {mode.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[151] pointer-events-none w-1.5 h-1.5 rounded-full bg-fg mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode.label ? 0 : 1 }}
      />
    </div>
  );
}

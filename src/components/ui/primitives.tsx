"use client";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useInView, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade/slide content in when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Splits text into words that rise up from a mask. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  animateOnMount = false,
}: { text: string; className?: string; delay?: number; stagger?: number; animateOnMount?: boolean }) {
  const words = text.split(" ");
  const anim = { hidden: { y: "110%" }, show: (i: number) => ({ y: "0%", transition: { duration: 1, ease: EASE, delay: delay + i * stagger } }) };
  // The trigger lives on the (unclipped) wrapper: words inside overflow-hidden masks
  // never intersect the viewport themselves, so they inherit the variant instead.
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      {...(animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden>
          <motion.span className="inline-block" variants={anim} custom={i}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-14 md:mb-20 ${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}>
      <Reveal className={`flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
        <span className="font-mono text-xs text-accent">{index}</span>
        <span className="h-px w-10 bg-line" />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] leading-[1.02]">
        <SplitWords text={title} />{" "}
        <span className="serif-i text-grad pr-1">
          <SplitWords text={accent} delay={0.15} />
        </span>
      </h2>
      {description && (
        <Reveal delay={0.2}>
          <p className="mt-6 text-muted text-lg leading-relaxed">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Element that is gently pulled toward the cursor. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.2 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14, mass: 0.2 });
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x, y }} className={`inline-block ${className ?? ""}`}>
      {children}
    </motion.div>
  );
}

/** onMouseMove handler that updates --mx/--my CSS vars for the .spotlight effect. */
export function spotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function CountUp({ value, decimals = 0, suffix = "", duration = 1.8 }: { value: number; decimals?: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setN(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

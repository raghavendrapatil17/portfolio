"use client";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiBarChart2, FiCpu, FiLayers, FiMapPin } from "react-icons/fi";
import { education, experience, pillars, profile, stats } from "@/data/portfolio";
import { scrollToId } from "@/lib/scroll";
import LocalTime from "./ui/LocalTime";
import { ClipReveal, CountUp, EASE, SectionHeading, SplitWords, spotlight } from "./ui/primitives";

const ICONS = { layers: FiLayers, cpu: FiCpu, chart: FiBarChart2 } as const;

/** A bento tile: rises in with a slight scale, staggered by `i`, with the cursor spotlight. */
function Tile({ children, className = "", i = 0 }: { children: ReactNode; className?: string; i?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.07 }}
      onMouseMove={spotlight}
      className={`card spotlight ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Portrait that tilts toward the cursor and drifts with scroll. */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { rx.set(0); ry.set(0); }}
        style={{ rotateX: rx, rotateY: ry }}
        className="relative h-full min-h-[22rem] sm:min-h-[26rem] rounded-[1.5rem] overflow-hidden border border-line group"
      >
        <ClipReveal className="absolute inset-0">
          <motion.img
            src={profile.photo}
            alt={profile.name}
            style={{ y: imgY }}
            className="absolute inset-0 w-full h-[112%] -top-[6%] object-cover object-top grayscale-[40%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-[filter,transform] duration-700"
          />
        </ClipReveal>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />
        {profile.available && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-ink/70 backdrop-blur border border-line px-3 py-1.5 text-xs">
            <span className="live-dot !w-1.5 !h-1.5" /> Available
          </span>
        )}
        <div className="absolute bottom-0 inset-x-0 p-5">
          <div className="font-semibold tracking-tight">{profile.name}</div>
          <div className="text-sm text-muted">{profile.role}</div>
        </div>
      </motion.div>
    </div>
  );
}

export default function About() {
  const current = experience.find((e) => e.current) ?? experience[0];
  const degree = education[0];

  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8">
        <SectionHeading index="01" eyebrow="About" title="Engineer by craft," accent="curious by nature." />

        {/*  Bento: 1 col (phone) → 2 cols (tablet) → 4 cols (desktop)  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:auto-rows-[minmax(11rem,auto)]">
          {/* Portrait: tall tile */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="md:row-span-2 lg:row-span-2"
          >
            <Portrait />
          </motion.div>

          {/* Intro */}
          <Tile i={1} className="p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between gap-6">
            <span className="eyebrow">Hello, I&apos;m {profile.firstName}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-semibold tracking-[-0.03em] leading-[1.15]">
              <SplitWords text={profile.headline} stagger={0.035} />
            </h3>
            <p className="text-muted leading-relaxed max-w-xl">{profile.summary}</p>
          </Tile>

          {/* Currently */}
          <Tile i={2} className="p-6 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Currently</span>
              <span className="live-dot" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight leading-snug">{current.role}</div>
              <div className="serif-i text-xl text-grad">@ {current.company}</div>
              <div className="font-mono text-xs text-dim mt-2">{current.period}</div>
            </div>
            <button onClick={() => scrollToId("experience")} className="link-u self-start text-sm text-muted hover:text-fg inline-flex items-center gap-1">
              Experience <FiArrowUpRight size={13} />
            </button>
          </Tile>

          {/* Stats (hairline grid: 2×2 on phones, 4 across from sm) */}
          <Tile i={3} className="md:col-span-2 lg:col-span-2 p-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line h-full">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface/95 p-5 sm:p-6 flex flex-col justify-end">
                  <div className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Tile>

          {/* Location + live time */}
          <Tile i={4} className="p-6 flex flex-col justify-between gap-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Based in</span>
              <span className="relative grid place-items-center w-8 h-8">
                <motion.span
                  className="absolute inset-0 rounded-full border border-accent/50"
                  animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <FiMapPin className="text-accent" />
              </span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">{profile.location}</div>
              <div className="font-mono text-3xl mt-1 text-fg/90"><LocalTime seconds /></div>
              <div className="font-mono text-[11px] text-dim">IST · UTC+05:30</div>
            </div>
          </Tile>

          {/* Strengths */}
          {pillars.map((p, idx) => {
            const Icon = ICONS[p.icon];
            return (
              <Tile key={p.title} i={5 + idx} className="p-6 flex flex-col gap-4">
                <motion.span
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="grid place-items-center w-11 h-11 rounded-xl border border-line bg-white/[0.03] text-accent"
                >
                  <Icon size={18} />
                </motion.span>
                <div>
                  <h3 className="font-semibold tracking-tight mb-1.5">{p.title}</h3>
                  <p className="text-muted leading-relaxed text-sm">{p.body}</p>
                </div>
              </Tile>
            );
          })}

          {/* Mission + education */}
          <Tile i={8} className="p-6 flex flex-col justify-between gap-5 md:col-span-2 lg:col-span-1">
            <span className="eyebrow">Mission</span>
            <p className="serif-i text-xl leading-snug text-fg/90">“{profile.mission}”</p>
            <div className="text-xs text-muted border-t border-line pt-4">
              {degree.degree} · <span className="text-fg">{degree.score.split(" ")[0]} GPA</span>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiBarChart2, FiCpu, FiLayers } from "react-icons/fi";
import { pillars, profile, stats } from "@/data/portfolio";
import { ClipReveal, CountUp, Reveal, SectionHeading, spotlight } from "./ui/primitives";

const ICONS = { layers: FiLayers, cpu: FiCpu, chart: FiBarChart2 } as const;

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/** Paragraph whose words light up as you scroll through it. */
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-2xl sm:text-3xl md:text-[2.4rem] leading-[1.25] font-medium tracking-[-0.02em]">
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

function Pillar({ p, i }: { p: (typeof pillars)[number]; i: number }) {
  const Icon = ICONS[p.icon];
  return (
    <Reveal delay={i * 0.08}>
      <div onMouseMove={spotlight} className="card spotlight p-7 h-full">
        <div className="w-11 h-11 grid place-items-center rounded-xl border border-line bg-white/[0.03] text-accent mb-6">
          <Icon size={18} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight mb-2">{p.title}</h3>
        <p className="text-muted leading-relaxed text-[0.95rem]">{p.body}</p>
      </div>
    </Reveal>
  );
}

export default function About() {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="01" eyebrow="About" title="Engineer by craft," accent="curious by nature." />

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          <Reveal>
            <div ref={photoRef} className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-line lg:sticky lg:top-28">
<ClipReveal className="absolute inset-0">
              <motion.img
                src={profile.photo}
                alt={profile.name}
                style={{ y: imgY, scale: imgScale }}
                className="absolute inset-0 w-full h-full object-cover object-top grayscale-[35%] hover:grayscale-0 transition-[filter] duration-700"
              />
              </ClipReveal>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
                <div>
                  <div className="font-semibold tracking-tight">{profile.name}</div>
                  <div className="text-sm text-muted">{profile.role}</div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ink/70 backdrop-blur border border-line px-3 py-1.5 text-xs">
                  <span className="live-dot !w-1.5 !h-1.5" /> {profile.location.split(",")[0]}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-14">
            <ScrollText text={profile.about.join(" ")} />

            <Reveal>
              <blockquote className="relative border-l-2 pl-6" style={{ borderImage: "var(--grad) 1" }}>
                <span className="eyebrow block mb-3">Mission</span>
                <p className="serif-i text-2xl md:text-3xl leading-snug text-fg/90">“{profile.mission}”</p>
              </blockquote>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-line bg-line">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06} className="bg-ink p-5">
                  <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                    <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-4">
          {pillars.map((p, i) => <Pillar key={p.title} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

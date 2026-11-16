"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { education, experience } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./ui/primitives";

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="experience" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8">
        <SectionHeading index="04" eyebrow="Experience" title="Where I've" accent="made an impact." />

        <ol ref={listRef} className="relative">
          <span className="absolute left-[7px] md:left-[calc(16rem+7px)] top-2 bottom-2 w-px bg-line" />
          <motion.span className="absolute left-[7px] md:left-[calc(16rem+7px)] top-2 bottom-2 w-px origin-top" style={{ scaleY: line, background: "var(--grad)" }} />

          {experience.map((e, i) => (
            <li key={e.company} className="relative grid md:grid-cols-[16rem_1fr] gap-4 md:gap-12 pl-10 md:pl-0 pb-16 last:pb-0">
              <Reveal className="md:text-right md:pr-14 pt-0.5">
                <div className="font-mono text-sm text-muted">{e.period}</div>
                <div className="text-sm text-dim mt-1">{e.location}</div>
              </Reveal>

              <span className="absolute left-0 md:left-[16rem] top-1.5 w-[15px] h-[15px] rounded-full border-2 border-ink" style={{ background: e.current ? "var(--color-ok)" : "#3a3d4a", boxShadow: e.current ? "0 0 0 4px rgb(52 211 153 / 0.15)" : undefined }} />

              <Reveal delay={0.08 + i * 0.04} className="md:pl-14">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{e.role}</h3>
                  <span className="serif-i text-2xl text-grad">@ {e.company}</span>
                  {e.current && <span className="text-[10px] font-mono uppercase tracking-widest text-ok border border-ok/30 rounded-full px-2 py-0.5">Current</span>}
                </div>
                <ul className="mt-5 space-y-3 text-muted leading-relaxed">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-2.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-6">
                  {e.stack.map((s) => <span key={s} className="text-xs px-3 py-1 rounded-full border border-line text-muted">{s}</span>)}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-28">
          <Reveal><h3 className="eyebrow mb-6">Education</h3></Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {education.map((ed, i) => (
              <Reveal key={ed.degree} delay={i * 0.08}>
                <div className="card p-7 flex items-start justify-between gap-6 h-full">
                  <div>
                    <div className="font-mono text-xs text-dim mb-3">{ed.period}</div>
                    <h4 className="text-lg font-semibold tracking-tight">{ed.degree}</h4>
                    <p className="text-muted text-sm mt-1">{ed.school}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-semibold tracking-tight text-grad">{ed.score.split(" ")[0]}</div>
                    <div className="text-xs text-dim">GPA / 10</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

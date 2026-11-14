"use client";
import { motion } from "framer-motion";
import { skillGroups } from "@/data/portfolio";
import { EASE, Reveal, SectionHeading, spotlight } from "./ui/primitives";

type Lang = { name: string; count: number };

function SkillCard({ g, i }: { g: (typeof skillGroups)[number]; i: number }) {
  return (
    <Reveal delay={(i % 3) * 0.08} className={g.span}>
      <div onMouseMove={spotlight} className="card spotlight p-7 h-full flex flex-col">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{g.category}</h3>
            <p className="text-sm text-muted mt-1">{g.blurb}</p>
          </div>
          <span className="font-mono text-xs text-dim">0{i + 1}</span>
        </div>
        <ul className="mt-auto space-y-4">
          {g.skills.map((s, j) => (
            <li key={s.name}>
              <div className="flex justify-between text-sm mb-2">
                <span>{s.name}</span>
                <span className="font-mono text-xs text-dim">{s.level}</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full origin-left"
                  style={{ background: "var(--grad)" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: s.level / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease: EASE, delay: 0.2 + j * 0.08 }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Skills({ languages }: { languages: Lang[] | null }) {
  const total = languages?.reduce((s, l) => s + l.count, 0) ?? 0;
  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Capabilities"
          title="A toolkit for"
          accent="enterprise & AI."
          description="The stack I reach for to ship production-grade CRM solutions, data products and LLM-powered applications."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillGroups.map((g, i) => <SkillCard key={g.category} g={g} i={i} />)}
        </div>

        {languages && languages.length > 0 && (
          <Reveal className="mt-4">
            <div className="card p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="font-semibold tracking-tight">Languages across my public repositories</h3>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  <span className="live-dot !w-1.5 !h-1.5" /> Live · GitHub
                </span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px]">
                {languages.map((l, i) => (
                  <motion.div
                    key={l.name}
                    initial={{ flexGrow: 0 }}
                    whileInView={{ flexGrow: l.count }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE, delay: i * 0.05 }}
                    className="h-full"
                    style={{ flexBasis: 0, background: `hsl(${250 - i * 28} 85% ${68 - i * 3}%)` }}
                  />
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {languages.map((l, i) => (
                  <li key={l.name} className="flex items-center gap-2 text-muted">
                    <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${250 - i * 28} 85% ${68 - i * 3}%)` }} />
                    <span className="text-fg">{l.name}</span>
                    <span className="font-mono text-xs">{Math.round((l.count / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

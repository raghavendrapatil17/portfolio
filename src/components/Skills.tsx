"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAngular, SiBootstrap, SiDocker, SiFlask, SiKubernetes, SiLangchain, SiMysql, SiPython,
  SiReact, SiScikitlearn, SiTensorflow, SiTypescript,
} from "react-icons/si";
import { FaAws, FaJava, FaMicrosoft } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import {
  TbApps, TbAutomation, TbBrain, TbBrandCSharp, TbChartBar, TbDatabase, TbRobot, TbSql, TbVectorTriangle,
} from "react-icons/tb";
import { skillGroups, tierLegend, type Skill, type SkillTier } from "@/data/portfolio";
import { EASE, Reveal, SectionHeading, spotlight } from "./ui/primitives";

type Lang = { name: string; count: number };

const ICONS: Record<string, { Icon: IconType; color: string }> = {
  brain: { Icon: TbBrain, color: "#c4b5fd" },
  langchain: { Icon: SiLangchain, color: "#8fd3c1" },
  sklearn: { Icon: SiScikitlearn, color: "#f7931e" },
  tensorflow: { Icon: SiTensorflow, color: "#ff8f00" },
  robot: { Icon: TbRobot, color: "#f472b6" },
  microsoft: { Icon: FaMicrosoft, color: "#4cc2ff" },
  chart: { Icon: TbChartBar, color: "#f2c811" },
  apps: { Icon: TbApps, color: "#c084fc" },
  automation: { Icon: TbAutomation, color: "#3b9bff" },
  angular: { Icon: SiAngular, color: "#ff3d6e" },
  react: { Icon: SiReact, color: "#61dafb" },
  flask: { Icon: SiFlask, color: "#e5e7eb" },
  bootstrap: { Icon: SiBootstrap, color: "#a77dff" },
  python: { Icon: SiPython, color: "#ffd43b" },
  typescript: { Icon: SiTypescript, color: "#4a9eff" },
  csharp: { Icon: TbBrandCSharp, color: "#b57bee" },
  java: { Icon: FaJava, color: "#f89820" },
  aws: { Icon: FaAws, color: "#ff9900" },
  docker: { Icon: SiDocker, color: "#2496ed" },
  azure: { Icon: VscAzure, color: "#3ea8ff" },
  kubernetes: { Icon: SiKubernetes, color: "#5c8dff" },
  mysql: { Icon: SiMysql, color: "#4fa3d1" },
  sql: { Icon: TbSql, color: "#f87171" },
  vector: { Icon: TbVectorTriangle, color: "#22d3ee" },
  database: { Icon: TbDatabase, color: "#fb7185" },
};

const TIER_DOTS: Record<SkillTier, number> = { Production: 3, Projects: 2, Familiar: 1 };

function TierMeter({ tier }: { tier: SkillTier }) {
  const n = TIER_DOTS[tier];
  return (
    <span className="inline-flex items-center gap-2 text-[11px] text-muted" aria-label={`${tier}: ${tierLegend[tier]}`} title={tierLegend[tier]}>
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3].map((d) => (
          <motion.span
            key={d}
            className="h-1.5 w-4 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.25 + d * 0.08, ease: EASE }}
            style={{ originX: 0, background: d <= n ? "var(--grad)" : "rgb(255 255 255 / 0.08)" }}
          />
        ))}
      </span>
      {tier}
    </span>
  );
}

function Tile({ s }: { s: Skill }) {
  const { Icon, color } = ICONS[s.icon] ?? ICONS.database;
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.94, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
        exit: { opacity: 0, y: -12, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.2 } },
      }}
      onMouseMove={spotlight}
      className="card spotlight group p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 sm:min-h-[9.5rem]"
    >
      <div className="flex items-start justify-between gap-3">
        <motion.span
          whileHover={{ rotate: -8, scale: 1.08 }}
          className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl border border-line transition-shadow duration-500 group-hover:shadow-[0_0_30px_-6px_var(--glow)]"
          style={{ background: `${color}14`, color, ["--glow" as string]: color }}
        >
          <Icon size={24} />
        </motion.span>
        <TierMeter tier={s.tier} />
      </div>
      <div className="mt-auto">
        <h4 className="font-semibold tracking-tight text-[1.05rem]">{s.name}</h4>
        {s.note ? <p className="text-xs text-muted mt-1 leading-relaxed">{s.note}</p> : null}
      </div>
    </motion.li>
  );
}

export default function Skills({ languages }: { languages: Lang[] | null }) {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];
  const total = languages?.reduce((s, l) => s + l.count, 0) ?? 0;

  return (
    <section id="skills" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Capabilities"
          title="A toolkit for"
          accent="enterprise & AI."
          description="The stack I reach for to ship CRM solutions, data products and LLM-powered applications — and where I've used it."
        />

        {/* Category tabs: wrap on desktop, swipeable row on phones */}
        <Reveal>
          <div role="tablist" aria-label="Skill categories" className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:flex-wrap snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
            {skillGroups.map((g, i) => (
              <button
                key={g.category}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`relative shrink-0 snap-start rounded-full px-4 py-2.5 text-sm transition-colors ${active === i ? "text-ink" : "text-muted hover:text-fg border border-line"}`}
              >
                {active === i && (
                  <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative flex items-center gap-2">
                  {g.category}
                  <span className={`font-mono text-[10px] ${active === i ? "text-ink/60" : "text-dim"}`}>{g.skills.length}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 min-h-[16rem]" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div key={group.category} initial="hidden" animate="show" exit="exit">
              <motion.p
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 }, exit: { opacity: 0 } }}
                className="text-muted mb-5 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-[var(--color-accent)]" /> {group.blurb}
              </motion.p>
              <motion.ul
                variants={{ show: { transition: { staggerChildren: 0.06 } }, exit: { transition: { staggerChildren: 0.02 } } }}
                className={`grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-4 ${group.skills.length === 5 ? "md:grid-cols-3 lg:grid-cols-5" : "lg:grid-cols-4"}`}
              >
                {group.skills.map((s) => <Tile key={s.name} s={s} />)}
              </motion.ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-dim">
            {(Object.keys(tierLegend) as SkillTier[]).map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="flex gap-0.5" aria-hidden>
                  {[1, 2, 3].map((d) => (
                    <span key={d} className="h-1 w-2.5 rounded-full" style={{ background: d <= TIER_DOTS[t] ? "var(--color-accent)" : "rgb(255 255 255 / 0.1)" }} />
                  ))}
                </span>
                <span className="text-muted">{t}</span> — {tierLegend[t]}
              </li>
            ))}
          </ul>
        </Reveal>

        {languages && languages.length > 0 && (
          <Reveal className="mt-10">
            <div className="card p-6 sm:p-7">
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

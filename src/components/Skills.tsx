"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SKILL_GROUPS = [
  {
    category: "Programming",
    color: "#00f5ff",
    icon: "💻",
    skills: [
      { name: "Python",     pct: 88 },
      { name: "TypeScript", pct: 82 },
      { name: "C#",         pct: 72 },
      { name: "Java",       pct: 68 },
    ],
  },
  {
    category: "Web Development",
    color: "#a855f7",
    icon: "🌐",
    skills: [
      { name: "Angular",    pct: 90 },
      { name: "React.js",   pct: 80 },
      { name: "Flask",      pct: 85 },
      { name: "Bootstrap",  pct: 78 },
    ],
  },
  {
    category: "Microsoft Stack",
    color: "#3b82f6",
    icon: "⚡",
    skills: [
      { name: "Dynamics 365 CRM", pct: 85 },
      { name: "Power Apps",       pct: 82 },
      { name: "Power BI",         pct: 88 },
      { name: "Power Automate",   pct: 80 },
    ],
  },
  {
    category: "AI / ML",
    color: "#f59e0b",
    icon: "🤖",
    skills: [
      { name: "LLMs & RAG",    pct: 82 },
      { name: "Scikit-learn",  pct: 85 },
      { name: "LangChain",     pct: 78 },
      { name: "Agentic AI",    pct: 75 },
    ],
  },
  {
    category: "Cloud & DevOps",
    color: "#10b981",
    icon: "☁️",
    skills: [
      { name: "AWS",        pct: 75 },
      { name: "Docker",     pct: 72 },
      { name: "Kubernetes", pct: 65 },
      { name: "Azure",      pct: 70 },
    ],
  },
  {
    category: "Databases",
    color: "#f43f5e",
    icon: "🗄️",
    skills: [
      { name: "MySQL",      pct: 84 },
      { name: "Oracle SQL", pct: 78 },
      { name: "FAISS",      pct: 72 },
      { name: "ChromaDB",   pct: 70 },
    ],
  },
];

function SkillBar({ name, pct, color, delay }: { name: string; pct: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-white/60">
        <span>{name}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-visible relative">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        >
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-[#020408]"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="skills" className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-purple-400/60 tracking-[0.4em] uppercase">02 / Skills</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            A curated stack of technologies I use to build enterprise-grade, AI-powered solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: gi * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass border border-white/8 hover:border-white/16 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 cursor-none"
              style={{ "--glow": group.color } as React.CSSProperties}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${group.color}15`, border: `1px solid ${group.color}30` }}
                >
                  {group.icon}
                </div>
                <h3 className="font-bold text-white">{group.category}</h3>
              </div>

              {/* Skill bars */}
              <div className="flex flex-col gap-3">
                {group.skills.map((s, si) => (
                  <SkillBar
                    key={s.name}
                    name={s.name}
                    pct={s.pct}
                    color={group.color}
                    delay={gi * 0.1 + si * 0.08 + 0.3}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tag cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {["NumPy","Pandas","Matplotlib","Seaborn","LlamaIndex","Dataverse","Power Query","DAX","Vector DB","Git","GitHub","VS Code","Google Colab","Google Cloud"].map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.1, borderColor: "rgba(0,245,255,0.5)" }}
              className="glass border border-white/10 text-white/50 hover:text-cyan-400 text-xs px-4 py-1.5 rounded-full font-mono transition-all duration-200 cursor-none"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

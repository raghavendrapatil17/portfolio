"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 1,   suffix: "+", label: "Year Experience" },
  { value: 10,  suffix: "+", label: "Projects Built" },
  { value: 4,   suffix: "",  label: "Certifications" },
  { value: 2,   suffix: "",  label: "Research Papers" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-4xl font-black gradient-text">
      {count}{suffix}
    </div>
  );
}

const CARDS = [
  {
    icon: "🚀",
    title: "Enterprise Builder",
    body: "Developing scalable Angular frontends and Dynamics 365 CRM solutions for real-world business workflows.",
  },
  {
    icon: "🤖",
    title: "AI Practitioner",
    body: "Building LLM-powered systems, RAG pipelines, and Agentic AI solutions using Python, LangChain & modern AI tools.",
  },
  {
    icon: "📊",
    title: "Data Storyteller",
    body: "Crafting interactive Power BI dashboards and forecasting models to surface insights that drive decisions.",
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="about" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent to-cyan-500/40" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-cyan-400/60 tracking-[0.4em] uppercase">01 / About</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Who I <span className="gradient-text">Am</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <p className="text-white/60 text-lg leading-relaxed">
              I&apos;m a{" "}
              <span className="text-cyan-400 font-semibold">Software Development Engineer</span>{" "}
              currently at RealtySlices, Hyderabad, where I architect Angular frontends and
              Microsoft Dynamics 365 CRM solutions that power real business operations.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              My passion lies at the intersection of enterprise software and artificial intelligence.
              From building{" "}
              <span className="text-purple-400 font-semibold">RAG-powered healthcare chatbots</span>{" "}
              to crafting Power BI dashboards that tell data stories — I turn complex problems into
              elegant, scalable solutions.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              With an MCA from KLE Institute of Technology (GPA: 9.2/10) and published research at
              international conferences, I combine academic rigour with hands-on engineering.
            </p>

            {/* Mission */}
            <div className="glass border border-cyan-500/20 rounded-2xl p-5 mt-2">
              <p className="text-sm font-mono text-cyan-400/70 mb-2">// MISSION</p>
              <p className="text-white/70 italic">
                &ldquo;To build intelligent, scalable software that bridges enterprise systems with
                the future of AI — creating real impact for real people.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right: stats + cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-8"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass border border-white/8 rounded-2xl p-5 text-center glow-cyan"
                >
                  <Counter target={s.value} suffix={s.suffix} />
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Info cards */}
            {CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.12 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(0,245,255,0.3)" }}
                className="glass border border-white/8 rounded-2xl p-5 flex gap-4 transition-colors duration-200 cursor-none"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

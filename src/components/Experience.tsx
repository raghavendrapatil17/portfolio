"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EXPERIENCE = [
  {
    role: "Software Development Engineer",
    company: "RealtySlices",
    period: "March 2026 – Present",
    location: "Hyderabad, India",
    type: "Full-time",
    color: "#00f5ff",
    emoji: "🏢",
    bullets: [
      "Developing responsive frontend interfaces using Angular for dynamic, user-friendly platform experiences.",
      "Building and customizing Microsoft Dynamics 365 CRM solutions to streamline business workflows and customer engagement.",
      "Designing low-code automations using Power Apps, Power Automate, and Dataverse to integrate data and processes across systems.",
    ],
    skills: ["Angular", "Dynamics 365", "Power Platform", "TypeScript"],
  },
  {
    role: "Data Analyst",
    company: "Cognizant",
    period: "Dec 2025 – March 2026",
    location: "Chennai, India",
    type: "Full-time",
    color: "#a855f7",
    emoji: "📊",
    bullets: [
      "Performed data cleaning, transformation, and modeling using Power Query and DAX.",
      "Designed interactive Power BI dashboards to visualize business data, enabling faster decision-making.",
      "Implemented forecasting and trend-analysis models to predict future performance metrics.",
    ],
    skills: ["Power BI", "DAX", "Power Query", "SQL"],
  },
];

const EDUCATION = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "KLE Institute of Technology, VTU",
    period: "Feb 2024 – Oct 2025",
    gpa: "9.2 / 10",
    color: "#3b82f6",
    emoji: "🎓",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "KLE's RLSI Belagavi, RCU",
    period: "Sept 2020 – Oct 2023",
    gpa: "8.8 / 10",
    color: "#10b981",
    emoji: "📚",
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="experience" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-cyan-400/60 tracking-[0.4em] uppercase">04 / Journey</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Experience column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-sm font-mono text-white/40 tracking-widest uppercase mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-cyan-500/50" />
              Work Experience
            </motion.h3>

            <div className="relative flex flex-col gap-0">
              {/* Vertical line */}
              <div className="absolute left-5 top-5 bottom-5 w-px timeline-line" />

              {EXPERIENCE.map((job, i) => (
                <motion.div
                  key={job.company}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
                  className="relative pl-14 pb-10"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                    style={{ background: `${job.color}15`, borderColor: `${job.color}40` }}
                  >
                    {job.emoji}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass border border-white/8 hover:border-white/16 rounded-2xl p-5 transition-all duration-200"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-white font-bold">{job.role}</h4>
                        <p className="font-semibold text-sm" style={{ color: job.color }}>{job.company}</p>
                        <p className="text-white/30 text-xs">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-white/40">{job.period}</span>
                        <br />
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono mt-1 inline-block"
                          style={{ background: `${job.color}15`, color: job.color }}
                        >
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <ul className="flex flex-col gap-2 mb-4">
                      {job.bullets.map((b, bi) => (
                        <li key={bi} className="text-white/50 text-sm leading-relaxed flex gap-2">
                          <span style={{ color: job.color }} className="shrink-0 mt-0.5">▹</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-0.5 rounded-full font-mono"
                          style={{ background: `${job.color}10`, border: `1px solid ${job.color}25`, color: job.color }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education column */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-sm font-mono text-white/40 tracking-widest uppercase mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-purple-500/50" />
              Education
            </motion.h3>

            <div className="flex flex-col gap-6">
              {EDUCATION.map((edu, i) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass border border-white/8 hover:border-white/20 rounded-2xl p-6 transition-all duration-200 cursor-none"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}30` }}
                    >
                      {edu.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold leading-snug">{edu.degree}</h4>
                      <p className="text-white/40 text-sm mt-0.5">{edu.institution}</p>
                      <p className="text-white/30 text-xs font-mono mt-1">{edu.period}</p>
                    </div>
                    <div
                      className="text-right shrink-0 px-3 py-1.5 rounded-xl"
                      style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}30` }}
                    >
                      <div className="text-lg font-black" style={{ color: edu.color }}>{edu.gpa}</div>
                      <div className="text-xs text-white/30">GPA</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certifications preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <h3 className="text-sm font-mono text-white/40 tracking-widest uppercase mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-yellow-500/50" />
                Certifications
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Microsoft Agent in a Day", issuer: "Koenig", year: "2026", color: "#00f5ff" },
                  { name: "GenAI Powered Data Analytics", issuer: "Tata",    year: "2025", color: "#a855f7" },
                  { name: "Web Development",           issuer: "Octanet",  year: "2024", color: "#3b82f6" },
                  { name: "AWS Cloud Practitioner",    issuer: "AWS",      year: "2023", color: "#f59e0b" },
                ].map((c) => (
                  <motion.div
                    key={c.name}
                    whileHover={{ scale: 1.04 }}
                    className="glass border border-white/8 rounded-xl p-3 cursor-none"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mb-2"
                      style={{ background: `${c.color}20`, color: c.color }}>
                      {c.year.slice(2)}
                    </div>
                    <p className="text-white text-xs font-semibold leading-tight">{c.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{c.issuer} · {c.year}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

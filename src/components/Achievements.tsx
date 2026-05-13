"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiX, FiZoomIn } from "react-icons/fi";

const ACHIEVEMENTS = [
  {
    icon: "🏆",
    title: "ICIET-2025 International Conference",
    subtitle: "Research Paper Publication",
    body: "Presented \"MediCura AI: Smart Health Companion for Patients & Professionals\" at the 2nd Joint International Conference on Innovative Engineering Technologies, organized by KITCoE (India), Ningxia University (China), SJTU (China), and AGH University (Poland).",
    badge: "International",
    color: "#f59e0b",
  },
  {
    icon: "🎖️",
    title: "NKCon'25 Conference",
    subtitle: "Research Paper Publication",
    body: "Presented \"Mango Tree Disease Detection Using CNN-Based Transfer Learning\" at the 4th International Conference on NKCon '25, showcasing deep learning applications in agricultural disease detection.",
    badge: "Research",
    color: "#a855f7",
  },
];

const CERTS = [
  {
    id: 1,
    name: "Microsoft Agent in a Day",
    issuer: "Microsoft · Koenig Solutions",
    year: "2026",
    color: "#00f5ff",
    icon: "🪟",
    image: "/certs/microsoft ai.jpg",
    description: "Completed Microsoft Agent in a Day certification, demonstrating proficiency in building AI agents using Microsoft Power Platform.",
  },
  {
    id: 2,
    name: "Data Visualisation: Empowering Business with Effective Insights",
    issuer: "Tata · Forage",
    year: "2024",
    color: "#3b82f6",
    icon: "📊",
    image: "/certs/tata-forage-data-visualisation.jpg.jpg",
    description: "Completed Tata's Data Visualisation virtual program on Forage, covering framing scenarios, choosing visuals, creating effective dashboards, and communicating insights.",
  },
  {
    id: 3,
    name: "Context Engineering Foundation",
    issuer: "Cognizant",
    year: "2026",
    color: "#a855f7",
    icon: "🤖",
    image: "/certs/context ai.jpg",
    description: "Certified in Context Engineering Foundation by Cognizant Learning & Development, demonstrating AI/ML fundamentals and practical application.",
  },
  {
    id: 4,
    name: "Data Science",
    issuer: "Starvic",
    year: "2025",
    color: "#10b981",
    icon: "🔬",
    image: "/certs/starvic-data-science.jpg.png",
    description: "Completed Data Science training program by Starvic, covering data analysis, machine learning, and practical data science workflows.",
  },
];

const METRICS = [
  { value: "9.2",  label: "MCA GPA",         icon: "📈", color: "#00f5ff" },
  { value: "2",    label: "Research Papers",  icon: "📄", color: "#3b82f6" },
  { value: "4",    label: "Certifications",   icon: "🏅", color: "#f59e0b" },
  { value: "6+",   label: "Projects Built",   icon: "🚀", color: "#10b981" },
  { value: "1+",   label: "Year Experience",  icon: "⚡", color: "#f43f5e" },
];

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [certModal, setCertModal] = useState<typeof CERTS[0] | null>(null);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-yellow-400/60 tracking-[0.4em] uppercase">05 / Achievements</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Recognition &amp; <span className="gradient-text">Certifications</span>
          </h2>
        </motion.div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-20">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="glass border border-white/8 hover:border-white/20 rounded-2xl p-4 text-center cursor-none transition-all"
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
              <div className="text-white/30 text-xs mt-0.5 leading-tight">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Research achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-sm font-mono text-white/40 tracking-widest uppercase mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-yellow-500/50" />
            Research & Publications
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass border rounded-2xl p-6 relative overflow-hidden cursor-none transition-all duration-300 group"
                style={{ borderColor: `${a.color}30` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${a.color}08, transparent 70%)` }} />
                <div className="relative z-10 flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                    {a.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full mb-2 inline-block"
                      style={{ background: `${a.color}20`, color: a.color }}>{a.badge}</span>
                    <h3 className="text-white font-bold text-sm">{a.title}</h3>
                    <p style={{ color: a.color }} className="text-xs font-medium mb-2">{a.subtitle}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{a.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-mono text-white/40 tracking-widest uppercase mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-cyan-500/50" />
            Certificates of Completion
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTS.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setCertModal(cert)}
                className="glass border border-white/8 hover:border-white/20 rounded-2xl overflow-hidden cursor-none group transition-all duration-200"
              >
                {/* Certificate image preview */}
                <div className="relative h-36 overflow-hidden bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image not found
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";
                        parent.innerHTML = `<span style="font-size:3rem">${cert.icon}</span>`;
                      }
                    }}
                  />
                  {/* Overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiZoomIn size={24} className="text-white" />
                  </div>
                  {/* Year badge */}
                  <div className="absolute top-2 right-2 text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ background: `${cert.color}30`, border: `1px solid ${cert.color}50`, color: cert.color }}>
                    {cert.year}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{cert.name}</h4>
                  <p className="text-white/30 text-xs">{cert.issuer}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-white/20 text-xs text-center mt-4 font-mono">Click any certificate to view details</p>
        </motion.div>
      </div>

      {/* Certificate modal */}
      <AnimatePresence>
        {certModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCertModal(null)}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full"
            >
              <button
                onClick={() => setCertModal(null)}
                className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>

              {/* Full certificate image */}
              <div className="rounded-2xl overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certModal.image}
                  alt={certModal.name}
                  className="w-full"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              {/* Info bar */}
              <div className="glass border border-white/10 rounded-2xl p-4 mt-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">{certModal.name}</h3>
                  <p className="text-white/40 text-xs">{certModal.issuer} · {certModal.year}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${certModal.color}15`, border: `1px solid ${certModal.color}30` }}>
                  {certModal.icon}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

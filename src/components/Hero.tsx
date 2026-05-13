"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiDownload } from "react-icons/fi";
import { SiAngular, SiPython, SiReact, SiKubernetes, SiDocker, SiTensorflow } from "react-icons/si";

const ROLES = [
  "Software Development Engineer",
  "AI & ML Practitioner",
  "Full-Stack Developer",
  "Power Platform Expert",
  "Dynamics 365 CRM Developer",
];

const TECH_ICONS = [
  { Icon: SiAngular,    color: "#DD0031", label: "Angular",    pos: "top-[12%] left-[6%]",      delay: 0 },
  { Icon: SiPython,     color: "#3776AB", label: "Python",     pos: "top-[18%] right-[8%]",     delay: 0.3 },
  { Icon: SiReact,      color: "#61DAFB", label: "React",      pos: "top-[52%] left-[4%]",      delay: 0.6 },
  { Icon: SiKubernetes, color: "#326CE5", label: "Kubernetes", pos: "top-[58%] right-[6%]",     delay: 0.9 },
  { Icon: SiDocker,     color: "#2496ED", label: "Docker",     pos: "bottom-[22%] left-[10%]",  delay: 1.2 },
  { Icon: SiTensorflow, color: "#FF6F00", label: "AI / ML",    pos: "bottom-[18%] right-[10%]", delay: 1.5 },
];

const CODE_LINES = [
  { text: "const developer = {",               color: "text-white/70" },
  { text: '  name: "Raghavendra S Patil",',    color: "text-cyan-400" },
  { text: '  role: "SDE @ RealtySlices",',     color: "text-purple-400" },
  { text: '  stack: ["Angular", "CRM", "AI"],',color: "text-green-400" },
  { text: '  passion: "Intelligent Systems",', color: "text-yellow-400" },
  { text: "};",                                color: "text-white/70" },
];

const TECH_PILLS = [
  { label: "Angular",        color: "#DD0031" },
  { label: "Python",         color: "#3776AB" },
  { label: "Dynamics 365",   color: "#00a4ef" },
  { label: "Power Platform", color: "#742774" },
  { label: "LLMs / RAG",     color: "#a855f7" },
  { label: "React",          color: "#61DAFB" },
  { label: "AI / ML",        color: "#FF6F00" },
];

const STATS = [
  { target: 9.2,  suffix: "",  label: "GPA",       color: "#00f5ff", decimals: 1 },
  { target: 96,   suffix: "%", label: "AI Acc.",    color: "#a855f7", decimals: 0 },
  { target: 7,    suffix: "+", label: "Projects",   color: "#3b82f6", decimals: 0 },
];

function useCountUp(target: number, decimals: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((ease * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  };

  return { value, start };
}

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const { value, start } = useCountUp(stat.target, stat.decimals);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      onViewportEnter={start}
      className="flex-1 glass border border-white/8 hover:border-white/20 rounded-xl py-3 text-center transition-all duration-300 group cursor-default"
    >
      <div className="text-lg font-black transition-all" style={{ color: stat.color }}>
        {stat.decimals > 0 ? value.toFixed(stat.decimals) : value}{stat.suffix}
      </div>
      <div className="text-white/25 text-[10px] font-mono group-hover:text-white/40 transition-colors">{stat.label}</div>
    </motion.div>
  );
}

export default function Hero() {
  const [roleIdx, setRoleIdx]         = useState(0);
  const [displayed, setDisplayed]     = useState("");
  const [typing, setTyping]           = useState(true);
  const [codeVisible, setCodeVisible] = useState(0);
  const charRef = useRef(0);

  // Typewriter
  useEffect(() => {
    const current = ROLES[roleIdx];
    if (typing) {
      if (charRef.current < current.length) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charRef.current + 1)); charRef.current++; }, 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (charRef.current > 0) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charRef.current - 1)); charRef.current--; }, 30);
        return () => clearTimeout(t);
      } else { setRoleIdx((i) => (i + 1) % ROLES.length); setTyping(true); }
    }
  }, [displayed, typing, roleIdx]);

  // Code line reveal
  useEffect(() => {
    if (codeVisible >= CODE_LINES.length) return;
    const t = setTimeout(() => setCodeVisible((v) => v + 1), 500);
    return () => clearTimeout(t);
  }, [codeVisible]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient-bg grid-overlay noise"
    >
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/4 blur-[140px] pointer-events-none" />

      {/* Floating tech icons */}
      {TECH_ICONS.map(({ Icon, color, label, pos, delay }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 1.2, duration: 0.5, type: "spring" }}
          className={`absolute ${pos} hidden lg:flex flex-col items-center gap-1.5 float`}
          style={{ animationDelay: `${delay}s` }}
        >
          <div className="glass border border-white/10 rounded-xl p-3 hover:border-cyan-500/40 transition-colors">
            <Icon style={{ color }} size={20} />
          </div>
          <span className="text-[10px] text-white/25 font-mono">{label}</span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pt-20 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── Left: text ── */}
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5 order-2 lg:order-1">

            {/* Name */}
            <motion.div variants={item}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                <span className="text-white">Raghavendra</span>
                <br />
                <span className="gradient-text">S Patil</span>
              </h1>
            </motion.div>

            {/* Typewriter role */}
            <motion.div variants={item} className="flex items-center gap-2 h-8">
              <span className="text-white/30 font-mono">&lt;</span>
              <span className="text-cyan-400 font-mono text-base font-semibold min-w-[260px]">
                {displayed}
                <span className="typewriter-cursor">|</span>
              </span>
              <span className="text-white/30 font-mono">/&gt;</span>
            </motion.div>

            {/* Summary */}
            <motion.p variants={item} className="text-white/50 text-base leading-relaxed max-w-lg">
              Building enterprise apps with{" "}
              <span className="text-cyan-400 font-medium">Angular & Dynamics 365 CRM</span>.
              Crafting intelligent systems with{" "}
              <span className="text-purple-400 font-medium">LLMs, RAG & Agentic AI</span>.
            </motion.p>

            {/* Tech stack pills */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {TECH_PILLS.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.07 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-[11px] font-mono px-3 py-1 rounded-full border cursor-default transition-all duration-200"
                  style={{
                    background: `${pill.color}12`,
                    borderColor: `${pill.color}35`,
                    color: pill.color,
                  }}
                >
                  {pill.label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA row */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary"
              >
                <span>View My Work</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-secondary"
              >
                Let&apos;s Talk
              </motion.button>
              <motion.a
                href="/certs/Raghavendra_Patil_Resume_.pdf"
                download="Raghavendra_Patil_Resume.pdf"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 glass border border-white/15 hover:border-cyan-500/50 text-white/60 hover:text-cyan-400 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 cursor-none"
              >
                <FiDownload size={14} />
                <span>Resume</span>
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div variants={item} className="flex items-center gap-3">
              {[
                { href: "https://github.com/raghavendrapatil17",                    Icon: FiGithub,   label: "GitHub" },
                { href: "https://www.linkedin.com/in/raghavendra-patil-a272a021b/", Icon: FiLinkedin, label: "LinkedIn" },
                { href: "mailto:raghupatil9036@gmail.com",                          Icon: FiMail,     label: "Email" },
              ].map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  title={label}
                  className="glass border border-white/10 hover:border-cyan-500/50 text-white/50 hover:text-cyan-400 p-3 rounded-xl transition-all duration-200"
                >
                  <Icon size={17} />
                </motion.a>
              ))}
              <span className="w-px h-5 bg-white/10 mx-1" />
              <span className="text-white/20 text-xs font-mono">raghavendrapatil17</span>
            </motion.div>
          </motion.div>

          {/* ── Right: terminal + avatar ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col gap-5 items-center order-1 lg:order-2"
          >
            {/* Avatar with rings */}
            <div className="relative w-44 h-44">
              {/* Outer dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-cyan-500/30 border-dashed"
              />
              {/* Middle dashed ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full border border-purple-500/20 border-dashed"
              />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
              {/* Photo circle */}
              <div className="w-full h-full rounded-full overflow-hidden relative"
                style={{ border: "2.5px solid rgba(0,245,255,0.5)", boxShadow: "0 0 30px rgba(0,245,255,0.15), 0 0 60px rgba(168,85,247,0.1)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/certs/profile photo.jpeg"
                  alt="Raghavendra S Patil"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-[#020408] animate-pulse" />
            </div>

            {/* Terminal code block */}
            <motion.div
              whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-sm glass border border-white/10 rounded-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-white/25 text-xs font-mono">portfolio.ts</span>
              </div>
              {/* Code lines */}
              <div className="px-5 py-4 font-mono text-xs leading-7 space-y-0">
                {CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={i < codeVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3 }}
                    className={line.color}
                  >
                    <span className="text-white/15 select-none mr-3">{i + 1}</span>
                    {line.text}
                  </motion.div>
                ))}
                {codeVisible >= CODE_LINES.length && (
                  <div className="text-white/40">
                    <span className="text-white/15 mr-3">{CODE_LINES.length + 1}</span>
                    <span className="typewriter-cursor">█</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Animated stats row */}
            <div className="flex gap-3 w-full max-w-sm">
              {STATS.map((s) => (
                <StatCard key={s.label} stat={s} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25 hover:text-cyan-400 transition-colors"
      >
        <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
        <FiArrowDown size={14} />
      </motion.button>

      <div className="scan-line" />
    </section>
  );
}

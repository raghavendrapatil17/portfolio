"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/data/portfolio";
import { scrollToId } from "@/lib/scroll";
import { useIntroDone } from "@/lib/motion";
import { EASE, Magnetic, SplitChars, SplitWords } from "./ui/primitives";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export type HeroStats = { repos: number; stars: number; followers: number; topLanguage: string | null; lastPush: string | null } | null;

function since(iso: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
  return days === 0 ? "Today" : days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
}

function LocalTime() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--"}</span>;
}

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-fg whitespace-nowrap"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ stats }: { stats: HeroStats }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(8px)"]);
  // Entrance starts the moment the intro curtain begins to lift
  const ready = useIntroDone();

  // Only surface stats that are meaningful (hide zero values)
  const liveStats = stats
    ? ([
        { k: "Public repos", v: stats.repos },
        { k: "GitHub stars", v: stats.stars },
        { k: "Followers", v: stats.followers },
        { k: "Top language", v: stats.topLanguage },
        { k: "Last commit", v: stats.lastPush ? since(stats.lastPush) : null },
      ].filter((s) => s.v !== null && s.v !== 0) as { k: string; v: string | number }[]).slice(0, 3)
    : null;

  return (
    <section ref={ref} id="hero" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-accent/20 blur-[160px] pointer-events-none" />

      <motion.div style={{ y: sceneY, opacity: sceneOpacity }} className="absolute inset-0 md:left-[38%] pointer-events-none">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.8, ease: EASE, delay: 0.1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 opacity-30 translate-x-[30%] translate-y-[8%] md:opacity-100 md:translate-x-0 md:translate-y-0">
            <HeroScene />
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity, filter: textBlur }} className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-6xl px-5 sm:px-8 pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm text-muted"
        >
          {profile.available && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5">
              <span className="live-dot" /> Open to opportunities
            </span>
          )}
          <span className="font-mono text-xs">
            {profile.location} · <LocalTime /> IST
          </span>
        </motion.div>

        <h1 className="text-[15vw] sm:text-[12vw] md:text-[8.5rem] lg:text-[10rem] font-semibold tracking-[-0.055em] leading-[0.88]">
          <SplitChars text={profile.firstName} delay={0.15} play={ready} className="block" />
          <span className="block serif-i text-grad tracking-[-0.03em] pr-2">
            <SplitWords text={profile.lastName} animateOnMount play={ready} delay={0.45} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          className="mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end"
        >
          <div className="max-w-xl">
            <p className="text-lg sm:text-xl text-muted mb-2 flex flex-wrap gap-x-2">
              <span>Currently</span> <RoleRotator />
            </p>
            <p className="text-lg sm:text-xl leading-relaxed text-muted">
              at <span className="text-fg">{profile.company}</span>. {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <button onClick={() => scrollToId("work")} className="btn btn-solid">
                View selected work <FiArrowUpRight />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => scrollToId("contact")} className="btn btn-ghost">
                Get in touch
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.05, duration: 1 }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 pb-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
          <div className="flex items-center gap-2">
            {[
              { href: profile.socials.github, Icon: FiGithub, label: "GitHub" },
              { href: profile.socials.linkedin, Icon: FiLinkedin, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, Icon: FiMail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <Magnetic key={label} strength={0.5}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid place-items-center w-11 h-11 rounded-full border border-line text-muted hover:text-fg hover:border-white/25 transition-colors">
                  <Icon size={16} />
                </a>
              </Magnetic>
            ))}
          </div>

          {liveStats && (
            <div className="flex items-end gap-8">
              <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                <span className="live-dot !w-1.5 !h-1.5" /> Live from GitHub
              </span>
              {liveStats.map((s) => (
                <div key={s.k}>
                  <div className="text-2xl font-semibold tabular-nums">{s.v}</div>
                  <div className="text-xs text-dim">{s.k}</div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => scrollToId("about")} className="hidden md:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-dim hover:text-fg transition-colors">
            Scroll
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <FiArrowDown />
            </motion.span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

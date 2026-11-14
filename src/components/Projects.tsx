"use client";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiGitBranch, FiGithub, FiStar, FiX } from "react-icons/fi";
import { projects, profile, type Project, type ProjectCategory } from "@/data/portfolio";
import { EASE, Reveal, SectionHeading, spotlight } from "./ui/primitives";

export type LiveRepo = { stars: number; forks: number; language: string | null; pushedAt: string; url: string; name: string; description: string | null };
type LiveMap = Record<string, LiveRepo>;

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function LiveMeta({ live }: { live?: LiveRepo }) {
  if (!live) return null;
  return (
    <div className="flex items-center gap-4 font-mono text-xs text-muted">
      {live.stars > 0 && <span className="inline-flex items-center gap-1.5"><FiStar size={12} /> {live.stars}</span>}
      {live.language && <span>{live.language}</span>}
      <span className="text-dim">updated {timeAgo(live.pushedAt)}</span>
    </div>
  );
}

/** Abstract generative cover so each project has a distinctive visual without screenshots. */
function Cover({ p, large }: { p: Project; large?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 80% 0%, ${p.accent}40, transparent 60%), radial-gradient(90% 70% at 0% 100%, ${p.accent}22, transparent 60%)` }} />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ background: p.accent, width: large ? 340 : 200, height: large ? 340 : 200, right: "-10%", top: "-20%", opacity: 0.25 }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="absolute right-6 bottom-2 font-semibold tracking-[-0.06em] leading-none select-none"
        style={{ fontSize: large ? "9rem" : "5.5rem", color: "transparent", WebkitTextStroke: `1px ${p.accent}55` }}
      >
        {String(projects.indexOf(p) + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function FeaturedCard({ p, i, live, onOpen }: { p: Project; i: number; live?: LiveRepo; onOpen: () => void }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const glareX = useTransform(ry, [-6, 6], ["20%", "80%"]);
  const glare = useTransform(glareX, (x) => `radial-gradient(400px circle at ${x} 30%, rgba(255,255,255,0.08), transparent 60%)`);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <Reveal>
      <div style={{ perspective: 1400 }}>
        <motion.article
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="card group grid lg:grid-cols-2 min-h-[440px] cursor-pointer"
          onClick={onOpen}
          data-cursor
        >
          <div className={`relative min-h-[240px] ${i % 2 ? "lg:order-2" : ""}`}>
            <Cover p={p} large />
            <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: glare }} />
            <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-ink/60 backdrop-blur border border-line px-3 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} /> {p.metric}
            </span>
          </div>
          <div className="relative p-8 md:p-10 flex flex-col" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")} · {p.category}</span>
              <span className="grid place-items-center w-11 h-11 rounded-full border border-line group-hover:bg-fg group-hover:text-ink transition-colors duration-300">
                <FiArrowUpRight className="group-hover:rotate-45 transition-transform duration-300" />
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em]">{p.title}</h3>
            <p className="serif-i text-xl text-muted mt-1">{p.subtitle}</p>
            <p className="text-muted leading-relaxed mt-6">{p.description}</p>
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full border border-line text-muted">{t}</span>
                ))}
              </div>
              <LiveMeta live={live} />
            </div>
          </div>
        </motion.article>
      </div>
    </Reveal>
  );
}

function ProjectCard({ p, live, onOpen }: { p: Project; live?: LiveRepo; onOpen: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, ease: EASE }}>
      <div onMouseMove={spotlight} onClick={onOpen} data-cursor className="card spotlight group h-full flex flex-col cursor-pointer">
        <div className="relative h-40 border-b border-line">
          <Cover p={p} />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="text-sm text-muted">{p.subtitle}</p>
            </div>
            <FiArrowUpRight className="shrink-0 text-muted group-hover:text-fg group-hover:rotate-45 transition-all duration-300" />
          </div>
          <div className="mt-auto pt-6 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 4).map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-line text-muted">{t}</span>
            ))}
          </div>
          {live && <div className="mt-4"><LiveMeta live={live} /></div>}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ p, live, onClose }: { p: Project; live?: LiveRepo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] bg-ink/80 backdrop-blur-md grid place-items-center p-4" onClick={onClose} data-lenis-prevent>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="card !bg-surface w-full max-w-2xl max-h-[88vh] overflow-y-auto"
      >
        <div className="relative h-48 border-b border-line"><Cover p={p} large /></div>
        <button onClick={onClose} className="absolute right-4 top-4 grid place-items-center w-10 h-10 rounded-full bg-ink/70 backdrop-blur border border-line" aria-label="Close">
          <FiX />
        </button>
        <div className="p-8">
          <span className="eyebrow">{p.category} · {p.metric}</span>
          <h3 className="text-3xl font-semibold tracking-tight mt-3">{p.title}</h3>
          <p className="serif-i text-xl text-muted">{p.subtitle}</p>
          <p className="text-muted leading-relaxed mt-6">{p.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {p.tags.map((t) => <span key={t} className="text-xs px-3 py-1 rounded-full border border-line text-muted">{t}</span>)}
          </div>
          {live && <div className="mt-6"><LiveMeta live={live} /></div>}
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-solid"><FiGithub /> View source</a>
            {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Live demo <FiArrowUpRight /></a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FILTERS: ("All" | ProjectCategory)[] = ["All", "AI / ML", "Data Science", "Full-Stack"];

export default function Projects({ live, recent }: { live: LiveMap | null; recent: LiveRepo[] | null }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const liveFor = (p: Project) => (p.repo && live ? live[p.repo.toLowerCase()] : undefined);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured && (filter === "All" || p.category === filter));
  const showcased = new Set(projects.map((p) => p.repo?.toLowerCase()).filter(Boolean));
  const recentExtra = recent?.filter((r) => r.name.toLowerCase() !== profile.githubUser.toLowerCase() && !showcased.has(`${profile.githubUser}/${r.name}`.toLowerCase())).slice(0, 4) ?? [];

  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Things I've"
          accent="designed & shipped."
          description="AI systems, data products and full-stack applications — several backed by peer-reviewed research."
        />

        <div className="flex flex-col gap-6">
          {featured.map((p, i) => <FeaturedCard key={p.slug} p={p} i={i} live={liveFor(p)} onOpen={() => setOpen(p)} />)}
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-6 mb-8">
          <Reveal><h3 className="text-2xl md:text-3xl font-semibold tracking-tight">More projects</h3></Reveal>
          <div className="flex flex-wrap gap-1 p-1 rounded-full border border-line bg-white/[0.02]">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`relative px-4 py-2 text-sm rounded-full transition-colors ${filter === f ? "text-ink" : "text-muted hover:text-fg"}`}>
                {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {rest.map((p) => <ProjectCard key={p.slug} p={p} live={liveFor(p)} onOpen={() => setOpen(p)} />)}
          </AnimatePresence>
          {rest.length === 0 && <p className="text-muted col-span-full py-10 text-center">The featured projects above cover this category.</p>}
        </motion.div>

        {recentExtra.length > 0 && (
          <Reveal className="mt-16">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-3">
                Recently on GitHub
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim font-normal">
                  <span className="live-dot !w-1.5 !h-1.5" /> live
                </span>
              </h3>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-fg inline-flex items-center gap-1">
                All repositories <FiArrowUpRight />
              </a>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {recentExtra.map((r) => (
                <li key={r.name}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex flex-wrap items-center gap-x-6 gap-y-1 py-4 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors">
                    <FiGitBranch className="text-dim" />
                    <span className="font-medium group-hover:text-accent transition-colors">{r.name.replace(/[-_]/g, " ")}</span>
                    <span className="text-sm text-muted flex-1 min-w-[12rem] truncate">{r.description ?? ""}</span>
                    <LiveMeta live={r} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <AnimatePresence>{open && <ProjectModal p={open} live={liveFor(open)} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

"use client";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiGitBranch, FiGithub, FiStar, FiX } from "react-icons/fi";
import { BodyPortal } from "./ui/Providers";
import { useReducedMotionPref } from "@/lib/motion";
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

function FeaturedCard({ p, i, live, onOpen, horizontal = false }: { p: Project; i: number; live?: LiveRepo; onOpen: (el: HTMLElement) => void; horizontal?: boolean }) {
  const hidden = useContext(OpenSlug) === p.slug;
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
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", opacity: hidden ? 0 : 1 }}
          className={`card group grid lg:grid-cols-2 cursor-pointer ${horizontal ? "h-[min(72vh,620px)]" : "min-h-[440px]"}`}
          onClick={(e) => onOpen(e.currentTarget)}
          data-cursor="View"
        >
          <div className={`relative min-h-[240px] ${i % 2 && !horizontal ? "lg:order-2" : ""}`}>
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
            <p className={`text-muted leading-relaxed mt-6 ${horizontal ? "line-clamp-5" : ""}`}>{p.description}</p>
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

function ProjectCard({ p, live, onOpen }: { p: Project; live?: LiveRepo; onOpen: (el: HTMLElement) => void }) {
  const hidden = useContext(OpenSlug) === p.slug;
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, ease: EASE }}>
      <div onMouseMove={spotlight} onClick={(e) => onOpen(e.currentTarget)} data-cursor="View" style={{ opacity: hidden ? 0 : 1 }} className="card spotlight group h-full flex flex-col cursor-pointer">
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

type Opened = { p: Project; rect: { top: number; left: number; width: number; height: number }; el: HTMLElement };

/** Which project is open: its card hides so the expanding panel reads as the same object. */
const OpenSlug = createContext<string | null>(null);

const rectOf = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

/**
 * Shared-element style expansion: the panel starts exactly where the clicked
 * card sits, grows into a centred reading view, and shrinks back on close.
 */
function ProjectModal({ o, live, onClose }: { o: Opened; live?: LiveRepo; onClose: () => void }) {
  const { p, rect } = o;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [target] = useState(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(780, vw - 24);
    const height = Math.min(vh - 48, 760);
    return { top: (vh - height) / 2, left: (vw - width) / 2, width, height };
  });
  const SPRING = { type: "spring", stiffness: 210, damping: 28, mass: 0.9 } as const;

  const blocks = [
    <span key="e" className="eyebrow">{p.category} · {p.metric}</span>,
    <h3 key="t" className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">{p.title}</h3>,
    <p key="s" className="serif-i text-xl text-muted">{p.subtitle}</p>,
    <p key="d" className="text-muted leading-relaxed mt-6">{p.description}</p>,
    <div key="g" className="flex flex-wrap gap-2 mt-6">
      {p.tags.map((t) => <span key={t} className="text-xs px-3 py-1 rounded-full border border-line text-muted">{t}</span>)}
    </div>,
    live ? <div key="l" className="mt-6"><LiveMeta live={live} /></div> : null,
    <div key="a" className="flex flex-wrap gap-3 mt-8">
      <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-solid"><FiGithub /> View source</a>
      {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Live demo <FiArrowUpRight /></a>}
    </div>,
  ].filter(Boolean);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[130] bg-ink/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        initial={{ ...rect, borderRadius: 24 }}
        animate={{ ...target, borderRadius: 28 }}
        exit={{ ...rect, borderRadius: 24 }}
        transition={SPRING}
        className="card !bg-surface !fixed z-[131] flex flex-col shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        data-lenis-prevent
      >
        <motion.div
          className="relative shrink-0 border-b border-line overflow-hidden"
          initial={{ height: rect.height * 0.5 }}
          animate={{ height: 220 }}
          exit={{ height: rect.height * 0.5 }}
          transition={SPRING}
        >
          <Cover p={p} large />
        </motion.div>
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.3 } }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
          className="absolute right-4 top-4 grid place-items-center w-10 h-10 rounded-full bg-ink/70 backdrop-blur border border-line z-10"
          aria-label="Close"
        >
          <FiX />
        </motion.button>
        <motion.div
          className="p-8 overflow-y-auto"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.28 } } }}
        >
          {blocks.map((node, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}>
              {node}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}



const LG_QUERY = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(LG_QUERY); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(LG_QUERY).matches,
    () => false,
  );
}

/**
 * Desktop: the section pins to the viewport and vertical scrolling drives the
 * featured cards sideways. Mobile / tablet: a simple vertical stack.
 */
type GalleryProps = { items: Project[]; liveFor: (p: Project) => LiveRepo | undefined; onOpen: (p: Project, el: HTMLElement) => void };

function FeaturedGallery({ items, liveFor, onOpen }: GalleryProps) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  if (desktop && !reduced) return <PinnedGallery items={items} liveFor={liveFor} onOpen={onOpen} />;
  return (
    <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8 flex flex-col gap-6">
      {items.map((p, i) => <FeaturedCard key={p.slug} p={p} i={i} live={liveFor(p)} onOpen={(el) => onOpen(p, el)} />)}
    </div>
  );
}

function PinnedGallery({ items, liveFor, onOpen }: GalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(items.length - 1, Math.round(v * (items.length - 1)))));

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => setDistance(Math.max(0, track.scrollWidth - window.innerWidth)));
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-8 w-max pl-[max(2rem,calc((100vw-var(--container))/2+2rem))] pr-[12vw]">
          {items.map((p, i) => (
            <div key={p.slug} className="w-[min(1080px,78vw)] shrink-0">
              <FeaturedCard p={p} i={i} live={liveFor(p)} onOpen={(el) => onOpen(p, el)} horizontal />
            </div>
          ))}
        </motion.div>
        <div className="mx-auto w-full max-w-[var(--container)] px-8 mt-10 flex items-center gap-6">
          <span className="font-mono text-xs text-muted tabular-nums">
            {String(active + 1).padStart(2, "0")} <span className="text-dim">/ {String(items.length).padStart(2, "0")}</span>
          </span>
          <div className="relative h-px flex-1 bg-line overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0" style={{ width: bar, background: "var(--grad)" }} />
          </div>
          <span className="eyebrow !text-[0.65rem]">Scroll</span>
        </div>
      </div>
    </div>
  );
}

const FILTERS: ("All" | ProjectCategory)[] = ["All", "AI / ML", "Data Science", "Full-Stack"];

export default function Projects({ live, recent }: { live: LiveMap | null; recent: LiveRepo[] | null }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<Opened | null>(null);
  const openProject = (p: Project, el: HTMLElement) => setOpen({ p, el, rect: rectOf(el) });
  // Re-measure the source card before closing so the panel shrinks back to where it is now
  const closeProject = () => {
    setOpen((o) => (o ? { ...o, rect: rectOf(o.el) } : o));
    requestAnimationFrame(() => setOpen(null));
  };
  const liveFor = (p: Project) => (p.repo && live ? live[p.repo.toLowerCase()] : undefined);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured && (filter === "All" || p.category === filter));
  const showcased = new Set(projects.map((p) => p.repo?.toLowerCase()).filter(Boolean));
  const recentExtra = recent?.filter((r) => r.name.toLowerCase() !== profile.githubUser.toLowerCase() && !showcased.has(`${profile.githubUser}/${r.name}`.toLowerCase())).slice(0, 4) ?? [];

  return (
    <OpenSlug.Provider value={open?.p.slug ?? null}>
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Things I've"
          accent="designed & shipped."
          description="AI systems, data products and full-stack applications — several backed by peer-reviewed research."
        />

      </div>

      <FeaturedGallery items={featured} liveFor={liveFor} onOpen={openProject} />

      <div className="mx-auto max-w-[var(--container)] px-5 sm:px-8">
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
            {rest.map((p) => <ProjectCard key={p.slug} p={p} live={liveFor(p)} onOpen={(el) => openProject(p, el)} />)}
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
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="link-u text-sm text-muted hover:text-fg inline-flex items-center gap-1">
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

      <BodyPortal><AnimatePresence>{open && <ProjectModal key={open.p.slug} o={open} live={liveFor(open.p)} onClose={closeProject} />}</AnimatePresence></BodyPortal>
    </section>
    </OpenSlug.Provider>
  );
}

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToId } from "@/lib/scroll";
import { EASE } from "./ui/primitives";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["hero", ...navLinks.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const go = (id: string) => { setOpen(false); scrollToId(id); };

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[120] origin-left" style={{ scaleX: progress, background: "var(--grad)" }} />

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="fixed top-4 inset-x-0 z-[110] px-4"
      >
        <nav
          className={`mx-auto max-w-6xl flex items-center justify-between rounded-full pl-2 pr-2 py-2 transition-all duration-500 ${
            scrolled ? "bg-ink/70 backdrop-blur-xl border border-line shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]" : "border border-transparent"
          }`}
        >
          <button onClick={() => go("top")} className="flex items-center gap-2.5 pl-1 pr-3 group" aria-label="Back to top">
            <span className="relative grid place-items-center w-9 h-9 rounded-full bg-fg text-ink text-[11px] font-bold tracking-tight">
              {profile.initials}
            </span>
            <span className="hidden sm:block text-sm font-medium tracking-tight">{profile.firstName}</span>
          </button>

          <ul className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className={`relative px-4 py-2 rounded-full transition-colors ${active === l.id ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  {active === l.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.07] border border-line" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-solid !h-10 !px-4 text-sm">
                Résumé <FiArrowUpRight />
              </a>
            </span>
            <button onClick={() => setOpen((o) => !o)} className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-line" aria-label="Toggle menu" aria-expanded={open}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-ink/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-8"
          >
            {navLinks.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, ease: EASE, duration: 0.6 }}
                onClick={() => go(l.id)}
                className="text-left text-5xl font-semibold tracking-tight py-3 flex items-baseline gap-4"
              >
                <span className="font-mono text-xs text-dim">0{i + 1}</span>
                {l.label}
              </motion.button>
            ))}
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-10 self-start">
              Download résumé <FiArrowUpRight />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

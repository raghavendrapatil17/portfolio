"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

const LINKS = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("");
  const [open, setOpen]         = useState(false);
  const [dark, setDark]         = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = "";
      LINKS.forEach((l) => {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top <= 120) current = l.href.slice(1);
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply dark/light class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      html.classList.remove("light-mode");
      document.body.style.backgroundColor = "#020408";
      document.body.style.color = "#ffffff";
    } else {
      html.classList.remove("dark");
      html.classList.add("light-mode");
      document.body.style.backgroundColor = "#f0f4ff";
      document.body.style.color = "#0f172a";
    }
  }, [dark]);

  const scroll = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? "glass border-b border-white/5 shadow-lg shadow-black/50" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <motion.button
            onClick={() => scroll("#hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center"
          >
            <div className="relative w-14 h-14 shrink-0" style={{ filter: "drop-shadow(0 0 12px rgba(99,102,241,0.9)) drop-shadow(0 0 6px rgba(0,245,255,0.6))" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/certs/new logo.png" alt="Raghavendra Logo" className="w-full h-full object-contain" />
            </div>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scroll(link.href)}
                whileHover={{ y: -2 }}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-200 group ${
                  active === link.href.slice(1) ? "text-cyan-400" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ${
                  active === link.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </motion.button>
            ))}

            {/* Dark/Light toggle */}
            <motion.button
              onClick={() => setDark(!dark)}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="glass border border-white/10 hover:border-cyan-500/40 p-2 rounded-xl text-white/50 hover:text-cyan-400 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                    <FiSun size={16} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                    <FiMoon size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scroll("#contact"); }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-sm py-2 px-5"
            >
              <span>Hire Me</span>
            </motion.a>
          </div>

          {/* Mobile: theme toggle + burger */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              onClick={() => setDark(!dark)}
              whileTap={{ scale: 0.9 }}
              className="glass border border-white/10 p-2 rounded-xl text-white/50"
            >
              {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
            </motion.button>
            <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-2">
              <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-cyan-400 block" />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-cyan-400 block" />
              <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-cyan-400 block" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-72 z-[99] glass-strong border-l border-white/10 flex flex-col pt-24 px-8 gap-6"
          >
            {LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scroll(link.href)}
                className="text-left text-lg font-semibold text-white/70 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => scroll("#contact")}
              className="btn-primary text-sm self-start mt-2"
            >
              <span>Hire Me</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

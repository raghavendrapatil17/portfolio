"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAward, FiMaximize2, FiX } from "react-icons/fi";
import { BodyPortal } from "./ui/Providers";
import { certifications, research } from "@/data/portfolio";
import { ClipReveal, EASE, Reveal, SectionHeading, spotlight } from "./ui/primitives";

type Cert = (typeof certifications)[number];

function CertCard({ c, i, onOpen }: { c: Cert; i: number; onOpen: () => void }) {
  return (
    <Reveal delay={i * 0.06}>
      <button onMouseMove={spotlight} onClick={onOpen} data-cursor="Open" className="card spotlight group w-full text-left h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
          <ClipReveal className="w-full h-full" delay={0.1 + i * 0.08} from="left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
          </ClipReveal>
          <span className="absolute right-3 top-3 grid place-items-center w-8 h-8 rounded-full bg-ink/70 backdrop-blur border border-line opacity-0 group-hover:opacity-100 transition-opacity">
            <FiMaximize2 size={13} />
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="font-mono text-xs text-dim mb-2">{c.year} · {c.issuer}</div>
          <h4 className="font-semibold tracking-tight leading-snug">{c.name}</h4>
        </div>
      </button>
    </Reveal>
  );
}

function Lightbox({ c, onClose }: { c: Cert; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[130] bg-ink/85 backdrop-blur-md grid place-items-center p-4" data-lenis-prevent>
      <motion.figure
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative card !bg-surface max-w-3xl w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt={c.name} className="w-full max-h-[70vh] object-contain bg-black" />
        <figcaption className="p-6">
          <div className="font-mono text-xs text-dim mb-1">{c.year} · {c.issuer}</div>
          <div className="text-lg font-semibold">{c.name}</div>
          <p className="text-muted text-sm mt-2">{c.description}</p>
        </figcaption>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid place-items-center w-10 h-10 rounded-full bg-ink/70 backdrop-blur border border-line"><FiX /></button>
      </motion.figure>
    </motion.div>
  );
}

export default function Achievements() {
  const [open, setOpen] = useState<Cert | null>(null);
  return (
    <section id="recognition" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="05" eyebrow="Recognition" title="Research &" accent="credentials." />

        <div className="grid md:grid-cols-2 gap-4">
          {research.map((r, i) => (
            <Reveal key={r.venue} delay={i * 0.08}>
              <article className="card p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="inline-flex items-center gap-2 text-sm"><FiAward className="text-accent" /> {r.venue}</span>
                  <span className="eyebrow !text-[0.65rem]">{r.type}</span>
                </div>
                <h3 className="serif-i text-2xl md:text-[1.7rem] leading-snug">“{r.title}”</h3>
                <p className="text-muted text-sm leading-relaxed mt-5">{r.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal><h3 className="eyebrow mt-20 mb-6">Certifications</h3></Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((c, i) => <CertCard key={c.name} c={c} i={i} onOpen={() => setOpen(c)} />)}
        </div>
      </div>
      <BodyPortal><AnimatePresence>{open && <Lightbox c={open} onClose={() => setOpen(null)} />}</AnimatePresence></BodyPortal>
    </section>
  );
}

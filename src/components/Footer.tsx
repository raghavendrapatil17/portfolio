"use client";
import { FiArrowUp } from "react-icons/fi";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToId } from "@/lib/scroll";
import { Magnetic, Scramble } from "./ui/primitives";

export default function Footer({ updatedAt }: { updatedAt: string | null }) {
  return (
    <footer className="relative border-t border-line overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-sm">
            <div className="text-sm text-muted">Designed & engineered by</div>
            <div className="text-xl font-semibold tracking-tight mt-1">{profile.name}</div>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollToId(l.id)} className="link-u text-muted hover:text-fg"><Scramble text={l.label} /></button>
            ))}
            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="link-u text-muted hover:text-fg">GitHub</a>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-u text-muted hover:text-fg">LinkedIn</a>
          </nav>
          <Magnetic strength={0.5}>
            <button onClick={() => scrollToId("top")} aria-label="Back to top" className="grid place-items-center w-14 h-14 rounded-full border border-line hover:bg-fg hover:text-ink transition-colors">
              <FiArrowUp />
            </button>
          </Magnetic>
        </div>

        <div aria-hidden className="mt-16 select-none text-center font-semibold tracking-[-0.06em] leading-[0.8] text-[22vw] md:text-[15rem] text-transparent" style={{ WebkitTextStroke: "1px rgb(255 255 255 / 0.09)" }}>
          {profile.firstName}
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4 text-xs text-dim font-mono">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          {updatedAt && <span>GitHub data synced {new Date(updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: profile.timezone })}</span>}
          <span>Built with Next.js, Three.js & Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { FiArrowUp } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-sm font-mono text-white/40 tracking-widest">RAGHAVENDRA S PATIL</span>
        </motion.div>

        {/* Links */}
        <div className="flex gap-6 text-sm text-white/40">
          {["About","Skills","Projects","Experience","Contact"].map((l) => (
            <button
              key={l}
              onClick={() => document.querySelector(`#${l.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-400 transition-colors cursor-none"
            >
              {l}
            </button>
          ))}
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          {[
            { href: "https://github.com/raghavendrapatil17",                           Icon: FiGithub },
            { href: "https://www.linkedin.com/in/raghavendra-patil-a272a021b/",        Icon: FiLinkedin },
            { href: "mailto:raghupatil9036@gmail.com",                                 Icon: FiMail },
          ].map(({ href, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-cyan-400 transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-white/20 text-xs text-center">
          © {new Date().getFullYear()} Raghavendra S Patil. All rights reserved.
        </p>

        {/* Back to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          className="glass border border-white/10 hover:border-cyan-500/40 p-3 rounded-xl text-white/40 hover:text-cyan-400 transition-all cursor-none"
        >
          <FiArrowUp size={16} />
        </motion.button>
      </div>
    </footer>
  );
}

"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiX } from "react-icons/fi";

const PROJECTS = [
  {
    id: 1,
    title: "Dr. Healify AI",
    subtitle: "Intelligent Medical Assistant",
    description: "A full-stack AI healthcare chatbot built with Flask, LLaMA, LangChain, and RAG. Features symptom checking, BMI calculation, health monitoring, and condition explanation. Achieved 96.58% disease prediction accuracy with a Random Forest classifier.",
    tags: ["Python", "Flask", "LLaMA", "LangChain", "RAG", "Random Forest", "Scikit-learn"],
    category: "AI / ML",
    emoji: "🏥",
    highlight: true,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accent: "#00f5ff",
    achievement: "96.58% Accuracy",
    github: "https://github.com/raghavendrapatil17/Dr-HeAlify-AI-Using-LLM-Models",
    demo: "https://github.com/raghavendrapatil17/Dr-HeAlify-AI-Using-LLM-Models",
  },
  {
    id: 2,
    title: "House Price Prediction",
    subtitle: "ML Regression System",
    description: "A machine learning regression system that predicts real estate prices using location, size, amenities, and market trend data. Features an interactive Streamlit dashboard for real-time price estimation and market analytics.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Pandas", "NumPy", "Matplotlib"],
    category: "Data Science",
    emoji: "🏡",
    highlight: false,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accent: "#10b981",
    achievement: "ML Regression",
    github: "https://github.com/raghavendrapatil17/House-Price-Prediction",
  },
  {
    id: 3,
    title: "USA Real Estate Dashboard",
    subtitle: "Market Analysis & Visualization",
    description: "An interactive data analytics dashboard for the US real estate market. Visualizes market trends, price distributions, property comparisons, and regional insights using advanced charting and data processing techniques.",
    tags: ["Python", "Power BI", "Pandas", "Matplotlib", "Seaborn", "Data Analysis"],
    category: "Data Science",
    emoji: "📊",
    highlight: false,
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    accent: "#3b82f6",
    achievement: "Market Analytics",
    github: "https://github.com/raghavendrapatil17/USA-Real-Estate-Market-Analysis-Dashboard",
  },
  {
    id: 4,
    title: "Online Art Gallery",
    subtitle: "Full-Stack Web Application",
    description: "A full-stack online art gallery platform enabling artists to showcase and sell their work. Features artist profiles, gallery management, artwork listings, and an intuitive browsing experience with modern UI design.",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "Flask", "MySQL"],
    category: "Full-Stack",
    emoji: "🎨",
    highlight: false,
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    accent: "#ec4899",
    achievement: "Full-Stack App",
    github: "https://github.com/raghavendrapatil17/Online-Art-Gallery",
  },
  {
    id: 5,
    title: "NextHire AI",
    subtitle: "Resume & LinkedIn Analyzer",
    description: "An AI-powered career tool that analyzes resumes and LinkedIn profiles to provide actionable feedback, ATS optimization scores, skill gap analysis, and tailored job recommendations. Helps candidates stand out in competitive hiring pipelines.",
    tags: ["Python", "LLM", "LangChain", "Flask", "NLP", "RAG"],
    category: "AI / ML",
    emoji: "📄",
    highlight: true,
    gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    accent: "#6366f1",
    achievement: "AI Career Tool",
    github: "https://github.com/raghavendrapatil17/NextHire-AI-Resume-Linkedin-Analyzer",
    demo: "https://github.com/raghavendrapatil17/NextHire-AI-Resume-Linkedin-Analyzer",
  },
  {
    id: 7,
    title: "Mango Disease Detection",
    subtitle: "CNN Transfer Learning",
    description: "A deep learning system using CNN-based transfer learning to detect diseases in mango trees from leaf images. Research presented at the 4th International Conference on NKCon '25. Achieved high classification accuracy across multiple disease categories.",
    tags: ["Python", "TensorFlow", "CNN", "Transfer Learning", "OpenCV", "Deep Learning"],
    category: "AI / ML",
    emoji: "🥭",
    highlight: true,
    gradient: "from-yellow-500/20 via-orange-500/10 to-transparent",
    accent: "#f59e0b",
    achievement: "NKCon '25 Research",
    github: "https://github.com/raghavendrapatil17",
  },
  {
    id: 8,
    title: "Plagiarism Checker",
    subtitle: "ML-Based Detection System",
    description: "An NLP-driven plagiarism detection tool using Naïve Bayes, SVM, and Random Forest models. Built a Flask web application for real-time analysis with similarity scoring and content highlighting across documents.",
    tags: ["Python", "Flask", "NLP", "Naïve Bayes", "SVM", "Random Forest"],
    category: "AI / ML",
    emoji: "🔍",
    highlight: false,
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    accent: "#a855f7",
    achievement: "Real-time Detection",
    github: "https://github.com/raghavendrapatil17",
  },
];

const CATEGORIES = ["All", "AI / ML", "Data Science", "Full-Stack"];

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("All");
  const [modal, setModal]   = useState<typeof PROJECTS[0] | null>(null);

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section ref={ref} id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-blue-400/60 tracking-[0.4em] uppercase">03 / Projects</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Production-ready AI systems, full-stack applications, and research-backed solutions
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-none ${
                filter === cat
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400"
                  : "glass border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((proj, i) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative glass border rounded-2xl p-6 flex flex-col gap-4 cursor-none overflow-hidden group transition-all duration-300 ${
                  proj.highlight ? "border-cyan-500/30" : "border-white/8 hover:border-white/20"
                }`}
              >
                {/* Gradient bg on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Glow on featured */}
                {proj.highlight && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 40px rgba(0,245,255,0.04)` }} />
                )}

                {proj.highlight && (
                  <span className="absolute top-4 right-4 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono z-10">
                    ★ Featured
                  </span>
                )}

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{proj.emoji}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{proj.title}</h3>
                      <p className="text-white/40 text-sm">{proj.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{proj.description}</p>

                  {/* Achievement badge */}
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full self-start"
                    style={{ background: `${proj.accent}15`, border: `1px solid ${proj.accent}30`, color: proj.accent }}
                  >
                    ✦ {proj.achievement}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                        {t}
                      </span>
                    ))}
                    {proj.tags.length > 4 && (
                      <span className="text-xs text-white/30 px-2 py-0.5">+{proj.tags.length - 4}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-1 pt-3 border-t border-white/5">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-cyan-400 transition-colors group/link"
                    >
                      <FiGithub size={13} />
                      <span>View Code</span>
                      <FiExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    <button
                      onClick={() => setModal(proj)}
                      className="flex items-center gap-1.5 text-xs font-medium text-white/30 hover:text-purple-400 transition-colors"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="https://github.com/raghavendrapatil17"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass border border-white/10 hover:border-cyan-500/40 text-white/60 hover:text-cyan-400 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
          >
            <FiGithub size={15} />
            View All Repositories on GitHub
            <FiExternalLink size={12} />
          </a>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong border border-white/10 rounded-2xl p-8 max-w-lg w-full relative overflow-hidden"
            >
              {/* Bg glow */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${modal.accent}, transparent 70%)` }}
              />

              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <FiX size={14} />
              </button>

              <div className="relative z-10">
                <div className="text-4xl mb-3">{modal.emoji}</div>
                <h3 className="text-2xl font-black text-white mb-1">{modal.title}</h3>
                <p className="text-sm mb-1" style={{ color: modal.accent }}>{modal.subtitle}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full mb-5"
                  style={{ background: `${modal.accent}15`, color: modal.accent }}>
                  ✦ {modal.achievement}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{modal.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {modal.tags.map((t) => (
                    <span key={t} className="text-xs glass border border-white/10 text-white/60 px-3 py-1 rounded-full font-mono">{t}</span>
                  ))}
                </div>
                <a
                  href={modal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-primary text-sm"
                >
                  <span className="flex items-center gap-2">
                    <FiGithub size={14} />
                    View on GitHub
                    <FiExternalLink size={12} />
                  </span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

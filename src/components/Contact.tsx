"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import emailjs from "@emailjs/browser";

/**
 * ─── EmailJS Setup (5-minute free setup) ──────────────────────────────────
 *  1. Go to https://emailjs.com → Sign up free
 *  2. Add Email Service → connect your Gmail (raghupatil9036@gmail.com)
 *     Copy the SERVICE_ID (e.g. "service_abc123")
 *  3. Create Template #1 — NOTIFICATION to you (Raghavendra receives this)
 *     Template variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 *     Copy the TEMPLATE_ID (e.g. "template_notify")
 *  4. Create Template #2 — AUTO-REPLY to sender
 *     "To Email" field: {{reply_to}}
 *     Body: "Hi {{from_name}}, Thanks for reaching out! I'll get back to you soon. – Raghavendra"
 *     Copy the TEMPLATE_ID (e.g. "template_reply")
 *  5. Go to Account → General → Public Key → copy it
 *  6. Replace the 4 values below with your actual values
 * ──────────────────────────────────────────────────────────────────────────
 */
const EMAILJS_SERVICE_ID      = "service_yyt1v19";
const EMAILJS_TEMPLATE_NOTIFY = "template_bdizrhl";   // you receive this
const EMAILJS_TEMPLATE_REPLY  = "template_n0km9up";   // auto-reply to sender
const EMAILJS_PUBLIC_KEY      = "LAWHLjpHYWYY2aJ09";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const ref      = useRef<HTMLElement>(null);
  const formRef  = useRef<HTMLFormElement>(null);
  const inView   = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name    = "Name is required";
    if (!form.email.includes("@")) e.email   = "Valid email is required";
    if (!form.subject.trim())     e.subject = "Subject is required";
    if (form.message.length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("sending");

    // Variable names must match your EmailJS template exactly
    const templateParams = {
      name:    form.name,
      email:   form.email,
      reply_to: form.email,
      title:   form.subject,   // {{title}} in your template
      message: form.message,
    };

    try {
      // 1️⃣  Send notification to Raghavendra
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_NOTIFY,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // 2️⃣  Send auto-reply to the person who contacted
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_REPLY,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const SOCIALS = [
    { icon: FiGithub,   href: "https://github.com/raghavendrapatil17",                          label: "GitHub"   },
    { icon: FiLinkedin, href: "https://www.linkedin.com/in/raghavendra-patil-a272a021b/",       label: "LinkedIn" },
    { icon: FiMail,     href: "mailto:raghupatil9036@gmail.com",                                label: "Gmail"    },
  ];

  const CONTACT_INFO = [
    { icon: FiMail,   label: "Email",    value: "raghupatil9036@gmail.com", href: "mailto:raghupatil9036@gmail.com" },
    { icon: FiPhone,  label: "Phone",    value: "+91 9108969917",           href: "tel:+919108969917" },
    { icon: FiMapPin, label: "Location", value: "Hyderabad, India",         href: null },
  ];

  const InputClass = (field: string) =>
    `glass border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/60 bg-transparent transition-all duration-200 w-full ${
      errors[field] ? "border-red-500/50" : "border-white/10 hover:border-white/20"
    }`;

  return (
    <section ref={ref} id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-purple-400/60 tracking-[0.4em] uppercase">06 / Contact</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Open to new opportunities, collaborations, and interesting conversations.
            Send a message — you&apos;ll get an instant reply.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: info — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-7"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Hire Me or Collaborate</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                I&apos;m open to full-time roles, freelance projects, and AI/ML collaborations.
                Whether you&apos;re building enterprise software or the next intelligent product — let&apos;s talk.
              </p>
            </div>

            {/* Contact cards */}
            <div className="flex flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="glass border border-white/8 hover:border-cyan-500/30 rounded-xl p-4 flex items-center gap-3 transition-all duration-200 cursor-none"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/30 text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm font-medium hover:text-cyan-400 transition-colors truncate block">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">Find me on</p>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    title={label}
                    className="glass border border-white/10 hover:border-cyan-500/40 p-3 rounded-xl transition-all text-white/50 hover:text-cyan-400"
                  >
                    <Icon size={17} />
                  </motion.a>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Right: form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="lg:col-span-3"
          >
            <form
              ref={formRef}
              onSubmit={submit}
              className="glass border border-white/8 rounded-2xl p-7 flex flex-col gap-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-mono uppercase tracking-wider">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                    placeholder="Your full name"
                    className={InputClass("name")}
                  />
                  {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><FiAlertCircle size={10} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-mono uppercase tracking-wider">Email *</label>
                  <input
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                    placeholder="you@example.com"
                    type="email"
                    className={InputClass("email")}
                  />
                  {errors.email && <p className="text-red-400 text-xs flex items-center gap-1"><FiAlertCircle size={10} />{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-mono uppercase tracking-wider">Subject *</label>
                <input
                  value={form.subject}
                  onChange={(e) => { setForm({ ...form, subject: e.target.value }); setErrors({ ...errors, subject: "" }); }}
                  placeholder="What's this about?"
                  className={InputClass("subject")}
                />
                {errors.subject && <p className="text-red-400 text-xs flex items-center gap-1"><FiAlertCircle size={10} />{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-mono uppercase tracking-wider">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                  placeholder="Tell me about your project, role, or idea..."
                  rows={5}
                  className={`${InputClass("message")} resize-none`}
                />
                {errors.message && <p className="text-red-400 text-xs flex items-center gap-1"><FiAlertCircle size={10} />{errors.message}</p>}
                <p className="text-white/20 text-xs text-right">{form.message.length}/500</p>
              </div>

              {/* Info note */}
              <p className="text-white/25 text-xs flex items-start gap-1.5">
                <FiMail size={11} className="mt-0.5 shrink-0" />
                You&apos;ll receive an auto-reply confirmation immediately after sending.
              </p>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "sending" || status === "success"}
                whileHover={status === "idle" ? { scale: 1.02, y: -2 } : {}}
                whileTap={status === "idle" ? { scale: 0.98 } : {}}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {status === "idle" && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <FiSend size={14} /><span>Send Message</span>
                    </motion.span>
                  )}
                  {status === "sending" && (
                    <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Sending...</span>
                    </motion.span>
                  )}
                  {status === "success" && (
                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-green-400">
                      <FiCheck size={14} /><span>Sent! Check your inbox.</span>
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-red-400">
                      <FiAlertCircle size={14} /><span>Failed — please email directly.</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

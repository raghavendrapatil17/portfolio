"use client";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiArrowUpRight, FiCheck, FiCopy, FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import { profile } from "@/data/portfolio";
import { EASE, Magnetic, Reveal, SplitWords } from "./ui/primitives";

/**
 * EmailJS — unchanged from the original site.
 * Template #1 notifies you; template #2 sends the visitor an auto-reply.
 */
const EMAILJS_SERVICE_ID = "service_yyt1v19";
const EMAILJS_TEMPLATE_NOTIFY = "template_bdizrhl";
const EMAILJS_TEMPLATE_REPLY = "template_n0km9up";
const EMAILJS_PUBLIC_KEY = "LAWHLjpHYWYY2aJ09";

type Status = "idle" | "sending" | "success" | "error";
const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.subject.trim()) e.subject = "Please add a subject";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters";
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    const params = { name: form.name, email: form.email, reply_to: form.email, title: form.subject, message: form.message };
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIFY, params, EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_REPLY, params, EMAILJS_PUBLIC_KEY);
      setStatus("success");
      setForm(EMPTY);
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const field = (name: keyof typeof EMPTY, label: string, props: Record<string, unknown> = {}, area = false) => {
    const Tag = area ? "textarea" : "input";
    return (
      <label className="block">
        <span className="text-xs text-muted mb-2 block">{label}</span>
        <Tag
          {...props}
          name={name}
          value={form[name]}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className={`field ${area ? "resize-none min-h-[140px]" : ""} ${errors[name] ? "!border-red-400/50" : ""}`}
          aria-invalid={!!errors[name]}
        />
        {errors[name] && <span className="text-xs text-red-300/90 mt-1.5 block">{errors[name]}</span>}
      </label>
    );
  };

  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-accent/15 blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-accent">06</span>
          <span className="h-px w-10 bg-line" />
          <span className="eyebrow">Contact</span>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-10">
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-[-0.045em] leading-[0.95]">
          <SplitWords text="Let's build" />
          <br />
          <span className="serif-i text-grad pr-2"><SplitWords text="something great." delay={0.15} /></span>
        </h2>

          <Reveal delay={0.25}>
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Email"
                aria-label={`Email ${profile.email}`}
                className="cta group relative grid place-items-center w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden isolate border border-line"
              >
                <span className="absolute inset-0 -z-10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ background: "var(--grad)" }} />
                <svg viewBox="0 0 200 200" className="cta-ring absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)]" aria-hidden>
                  <defs><path id="cta-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                  <text className="fill-current text-muted group-hover:text-white transition-colors" style={{ fontSize: 14, letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                    <textPath href="#cta-circle">Say hello · Open to work · Say hello · Open to work ·</textPath>
                  </text>
                </svg>
                <FiArrowUpRight className="text-3xl group-hover:rotate-45 group-hover:text-white transition-transform duration-500" />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
          <Reveal className="flex flex-col gap-8">
            <p className="text-lg text-muted leading-relaxed max-w-md">
              Open to full-time roles, freelance projects and AI/ML collaborations. Tell me about what you&apos;re building — I usually reply within a day.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${profile.email}`} className="btn btn-solid"><FiMail /> {profile.email}</a>
              </Magnetic>
              <button onClick={copyEmail} className="btn btn-ghost !px-4" aria-label="Copy email address">
                {copied ? <><FiCheck className="text-ok" /> Copied</> : <><FiCopy /> Copy</>}
              </button>
            </div>

            <dl className="divide-y divide-line border-y border-line">
              {[
                { Icon: FiPhone, k: "Phone", v: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
                { Icon: FiMapPin, k: "Based in", v: profile.location },
                { Icon: FiLinkedin, k: "LinkedIn", v: "raghavendra-patil", href: profile.socials.linkedin },
                { Icon: FiGithub, k: "GitHub", v: profile.githubUser, href: profile.socials.github },
              ].map(({ Icon, k, v, href }) => (
                <div key={k} className="flex items-center justify-between py-4 text-sm">
                  <dt className="flex items-center gap-3 text-muted"><Icon size={14} /> {k}</dt>
                  <dd>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-1 hover:text-accent">{v} <FiArrowUpRight size={13} /></a>
                    ) : v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="card p-6 sm:p-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {field("name", "Your name", { placeholder: "Jane Doe", autoComplete: "name" })}
                {field("email", "Email", { placeholder: "jane@company.com", type: "email", autoComplete: "email" })}
              </div>
              {field("subject", "Subject", { placeholder: "Role / project / collaboration" })}
              {field("message", "Message", { placeholder: "Tell me a little about it…", maxLength: 1000 }, true)}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <span className="text-xs text-dim">You&apos;ll receive an automatic confirmation email.</span>
                <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60 min-w-[160px] justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={status} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="inline-flex items-center gap-2">
                      {status === "sending" && <>Sending…</>}
                      {status === "success" && <><FiCheck /> Message sent</>}
                      {status === "error" && <><FiAlertCircle /> Try again</>}
                      {status === "idle" && <>Send message <FiArrowUpRight /></>}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence>
                {status === "error" && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-red-300/90">
                    Something went wrong sending your message. Please email me directly at {profile.email}.
                  </motion.p>
                )}
                {status === "success" && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-ok">
                    Thanks! Your message is on its way — check your inbox for a confirmation.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-react';
import XIcon from '@/components/icons/XIcon';
import { CONTACT, SOCIAL, getValidatedFormEndpoint, INTEGRATIONS, hasRecaptcha } from '@/data/links';

// Minimal ambient types to avoid 'any' casts
interface GrecaptchaLike {
  execute(siteKey: string, options: { action: string }): Promise<string>;
}
interface FormspreeError { message?: string }
interface FormspreeResponseShape { errors?: FormspreeError[]; error?: string }
interface WindowWithCaptcha extends Window { grecaptcha?: GrecaptchaLike }

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />, 
      title: 'Email',
      value: CONTACT.email,
      link: CONTACT.mailto
    },
    {
      icon: <MapPin className="text-primary" size={24} />, 
      title: 'Location',
      value: CONTACT.location
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin size={24} />, url: SOCIAL.linkedin, color: 'hover:text-blue-500' },
    { name: 'GitHub', icon: <Github size={24} />, url: SOCIAL.github, color: 'hover:text-gray-400' },
  { name: 'X', icon: <XIcon width={24} height={24} />, url: SOCIAL.x, color: 'hover:text-neutral-400' }
  ];

  // Validated Formspree endpoint
  const { url: FORMSPREE_ENDPOINT, reason: endpointIssue } = getValidatedFormEndpoint();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const cooldownRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const recaptchaReadyRef = useRef<boolean>(false);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) window.clearInterval(cooldownRef.current);
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  // Load reCAPTCHA script if configured (v2 invisible or v3 site key expected)
  useEffect(() => {
    if (!hasRecaptcha() || recaptchaReadyRef.current) return;
    const existing = document.querySelector('script[data-recaptcha]');
    if (existing) return; // assume already loading
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${INTEGRATIONS.recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    script.onload = () => { recaptchaReadyRef.current = true; };
    document.head.appendChild(script);
  }, []);

  // Draft + controlled form state
  const DRAFT_KEY = 'contactDraft_v1';
  const SOFT_LIMIT = 500;
  const HARD_LIMIT = 1000;
  const [rememberDraft, setRememberDraft] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setFormValues(v => ({
            ...v,
            name: parsed.name || '',
            email: parsed.email || '',
            subject: parsed.subject || '',
            message: parsed.message || ''
          }));
          setRememberDraft(true);
        }
      }
  } catch { /* ignore draft load errors */ }
  }, []);

  // Persist draft (debounced) when enabled
  useEffect(() => {
    if (!rememberDraft) return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
      } catch { /* ignore persistence errors */ }
    }, 400);
    return () => window.clearTimeout(id);
  }, [formValues, rememberDraft]);

  const clearDraft = () => {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  const updateField = (field: keyof typeof formValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (field === 'message') {
      if (value.length > HARD_LIMIT) value = value.slice(0, HARD_LIMIT);
    }
    setFormValues(v => ({ ...v, [field]: value }));
  };

  const messageLen = formValues.message.length;
  const messageSeverity = messageLen >= HARD_LIMIT ? 'max' : messageLen >= SOFT_LIMIT ? 'warn' : 'ok';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cooldown > 0) return; // ignore while cooling down
    const form = e.currentTarget;
    const formData = new FormData();
    formData.append('name', formValues.name.trim());
    formData.append('email', formValues.email.trim());
    if (formValues.subject.trim()) formData.append('subject', formValues.subject.trim());
    formData.append('message', formValues.message.trim());
    formData.append('_subject', 'New portfolio contact');
    // Honeypot placeholder if existed remains in DOM but not needed here

    // Client-side basic validation
    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const message = formValues.message.trim();
    if (name.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }
    if (message.length > HARD_LIMIT) {
      setError(`Message cannot exceed ${HARD_LIMIT} characters.`);
      return;
    }
    if (!FORMSPREE_ENDPOINT) {
      if (endpointIssue === 'missing') {
        setError('Contact form endpoint missing. Add VITE_FORMSPREE_ENDPOINT to your .env.');
      } else if (endpointIssue === 'invalid-format') {
        setError('Invalid Formspree endpoint format. Expected https://formspree.io/f/<id>.');
      } else {
        setError('Contact form not configured.');
      }
      return;
    }
    setStatus('submitting');
    setError(null);

    // reCAPTCHA token (v3 style) if configured
    if (hasRecaptcha() && (window as WindowWithCaptcha).grecaptcha) {
      try {
        const token = await (window as WindowWithCaptcha).grecaptcha!.execute(INTEGRATIONS.recaptchaSiteKey, { action: 'submit' });
        formData.append('g-recaptcha-response', token);
      } catch (err) {
        if (import.meta.env.DEV) console.warn('reCAPTCHA execution failed', err as unknown);
      }
    }
    // Dev aid: log form entries once when submitting (only in dev)
    if (import.meta.env.DEV) {
      console.log('[ContactForm] submitting entries:', Array.from(formData.entries()));
    }
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
        setFormValues({ name: '', email: '', subject: '', message: '' });
        if (rememberDraft) {
          clearDraft();
        }
        setSuccessVisible(true);
        // Start fade-out timer (5s visible then hide)
        if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
        successTimerRef.current = window.setTimeout(() => setSuccessVisible(false), 5000);
        // Cooldown 10s to prevent rapid spam
        setCooldown(10);
      } else {
        let data: unknown = {};
        try { data = await res.json(); } catch { /* ignore parse */ }
        if (typeof data === 'object' && data !== null && (data as FormspreeResponseShape).errors && Array.isArray((data as FormspreeResponseShape).errors)) {
          // Formspree structured errors
          const errorsArray = (data as FormspreeResponseShape).errors as Array<{ message?: string }>;
          setError(errorsArray.map(e => e.message || 'Error').join('\n'));
        } else {
          const fallback = (data as FormspreeResponseShape).error;
          setError(fallback || 'Failed to send message.');
        }
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground text-lg">
            Let's connect and discuss opportunities together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">{info.icon}</div>
                    <div>
                      <h4 className="font-semibold text-lg">{info.title}</h4>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Follow Me</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    asChild
                    className={`rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ${social.color}`}
                  >
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      {social.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Contact Illustration */}
            <div className="hidden lg:block">
              <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Mail size={64} className="text-primary mx-auto mb-4" />
                  <p className="text-xl font-semibold">Let's Start a Conversation</p>
                  <p className="text-muted-foreground">I'm always open to new opportunities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Send me a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={updateField('name')}
                      placeholder="Your full name"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={updateField('email')}
                      placeholder="your.email@example.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formValues.subject}
                    onChange={updateField('subject')}
                    placeholder="What's this about?"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formValues.message}
                    onChange={updateField('message')}
                    placeholder="Your message here..."
                    className="mt-2 min-h-[120px]"
                    required
                    aria-describedby="message-counter"
                  />
                  <div
                    id="message-counter"
                    className={`mt-1 text-xs font-medium transition-colors ${
                      messageSeverity === 'max' ? 'text-red-500' : messageSeverity === 'warn' ? 'text-amber-500' : 'text-muted-foreground'
                    }`}
                  >
                    {messageLen} / {HARD_LIMIT} {messageSeverity === 'warn' && '(approaching limit)'} {messageSeverity === 'max' && '(max reached)'}
                  </div>
                  <div className="h-1 w-full bg-muted rounded overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all ${
                        messageSeverity === 'max' ? 'bg-red-500' : messageSeverity === 'warn' ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, (messageLen / HARD_LIMIT) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Hidden subject override (already appended programmatically) */}
                {/* Honeypot still present (uncontrolled) */}
                {/* Honeypot anti-spam field (hidden from users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>
                
                {status === 'success' && successVisible && (
                  <p className="text-sm text-green-500 transition-opacity duration-700">
                    Message sent successfully!
                  </p>
                )}
                {status === 'error' && error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                {!FORMSPREE_ENDPOINT && (
                  <p className="text-xs text-muted-foreground bg-muted rounded p-2">
                    Form not active: configure <code className="font-mono">VITE_FORMSPREE_ENDPOINT</code> in your environment.
                    {' '}Or email directly at <a className="underline" href={CONTACT.mailto}>{CONTACT.email}</a>.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 text-xs text-muted-foreground select-none">
                    <input
                      type="checkbox"
                      className="rounded border-muted bg-background"
                      checked={rememberDraft}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setRememberDraft(checked);
                        if (!checked) clearDraft(); else {
                          try { localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues)); } catch { /* ignore */ }
                        }
                      }}
                    />
                    Remember this message on this device
                  </label>
                  <Button
                    type="submit"
                    disabled={status === 'submitting' || cooldown > 0 || !FORMSPREE_ENDPOINT}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
                  >
                    <Send size={20} className="mr-2" />
                    {status === 'submitting' ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send Message'}
                  </Button>
                  {!FORMSPREE_ENDPOINT && (
                    <a
                      href={CONTACT.mailto}
                      className="text-center text-sm underline text-muted-foreground hover:text-primary"
                    >
                      Or click to email me directly
                    </a>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
// Centralized link & anchor registry.
// Update values here to propagate across the site.

export const SECTIONS = {
  home: 'home',
  about: 'about',
  skills: 'skills',
  education: 'education',
  experience: 'experience',
  projects: 'projects',
  certifications: 'certifications',
  contact: 'contact',
} as const;

export type SectionKey = keyof typeof SECTIONS;
export const sectionId = (k: SectionKey) => SECTIONS[k];
export const sectionHash = (k: SectionKey) => `#${SECTIONS[k]}`;

export const SOCIAL = {
  github: 'https://github.com/raghavendra-patil',
  linkedin: 'https://www.linkedin.com/in/raghavendra-patil-a272a021b/',
  x: 'https://x.com/raghavendra-patil', // Updated with actual X handle
} as const;

export const CONTACT = {
  email: 'raghupatil9036@gmail.com',
  mailto: 'mailto:raghupatil9036@gmail.com',
  location: 'India',
  // Formspree endpoint: expects something like
  // https://formspree.io/f/abcdwxyz (the /f/ short hash URL)
  // We intentionally keep this raw value minimal and perform validation below.
  formEndpoint: (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined) || undefined,
} as const;

// Basic runtime validation helper (lightweight – no external deps)
export function getValidatedFormEndpoint() {
  const url = CONTACT.formEndpoint?.trim();
  if (!url) return { url: undefined as string | undefined, reason: 'missing' };
  // Accept only https Formspree endpoints containing /f/
  const ok = /^https:\/\/formspree\.io\/f\/[-a-zA-Z0-9]+$/.test(url);
  if (!ok) return { url: undefined as string | undefined, reason: 'invalid-format' };
  return { url, reason: null as null | string };
}

export interface ProjectLink { live?: string; source?: string; }
// If you need to override resume-provided links, you can map project names to links here.
export const PROJECT_LINK_OVERRIDES: Record<string, ProjectLink> = {
  // 'Project Name': { live: 'https://example.com', source: 'https://github.com/user/repo' }
};

export const FILES = {
  resume: '/resume.pdf',
} as const;

export const OG = {
  image: '/profile-photo.jpg', // ensure file placed in public/ as profile-photo.jpg
};

// Third-party integrations configuration (non-secret public keys)
export const INTEGRATIONS = {
  recaptchaSiteKey: (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) || undefined,
} as const;

export const hasRecaptcha = () => !!INTEGRATIONS.recaptchaSiteKey;

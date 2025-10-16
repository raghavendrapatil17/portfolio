// Central tech/logo metadata. Lightweight inline SVGs (brand-safe, simple shapes) to avoid external fetches.
// Note: Only include technologies you actually use; no trademarked complex marks copied from proprietary sources.

export interface TechMeta {
  id: string;
  name: string;
  category: string;
  site?: string;
  svg: string; // raw inline svg markup (no <svg> wrapper styling aside from viewBox)
}

const make = (t: Omit<TechMeta, 'svg'> & { svgPath: string; viewBox?: string }): TechMeta => ({
  id: t.id,
  name: t.name,
  category: t.category,
  site: t.site,
  svg: `<svg viewBox="${t.viewBox || '0 0 24 24'}" xmlns='http://www.w3.org/2000/svg' fill='currentColor' stroke='none'>${t.svgPath}</svg>`
});

export const TECHNOLOGIES: TechMeta[] = [
  make({ id: 'ts', name: 'TypeScript', category: 'Language', site: 'https://www.typescriptlang.org', svgPath: '<rect width="24" height="24" rx="4" fill="#3178C6"/><text x="12" y="16" font-size="9" text-anchor="middle" fill="white" font-family="Verdana">TS</text>' }),
  make({ id: 'react', name: 'React', category: 'Frontend', site: 'https://react.dev', svgPath: '<circle cx="12" cy="12" r="2" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g>' }),
  make({ id: 'node', name: 'Node.js', category: 'Backend', site: 'https://nodejs.org', svgPath: '<path d="M12 2 3 7v10l9 5 9-5V7z" fill="#3C873A"/><path d="M12 4.2 5 8v8l7 3.8 7-3.8V8z" fill="#68A063"/>' }),
  make({ id: 'express', name: 'Express', category: 'Backend', site: 'https://expressjs.com', svgPath: '<rect x="2" y="4" width="20" height="16" rx="3" fill="#222"/><path d="M6 12h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' }),
  make({ id: 'python', name: 'Python', category: 'Language', site: 'https://www.python.org', svgPath: '<path fill="#3776AB" d="M12 2c-5.5 0-5 4-5 4v4h10V6s.5-4-5-4Z"/><path fill="#FFDF5A" d="M7 14v4s-.5 4 5 4 5-4 5-4v-4H7Z"/><circle cx="10" cy="6" r="1" fill="#fff"/><circle cx="14" cy="18" r="1" fill="#444"/>' }),
  make({ id: 'mysql', name: 'MySQL', category: 'Database', site: 'https://www.mysql.com', svgPath: '<path d="M4 18c0-3.3 3.6-6 8-6s8 2.7 8 6-3.6 6-8 6-8-2.7-8-6Z" fill="#00758F"/><path d="M4 12c0-3.3 3.6-6 8-6s8 2.7 8 6" fill="none" stroke="#F29111" stroke-width="2"/><path d="M4 6c0-3.3 3.6-6 8-6s8 2.7 8 6" fill="none" stroke="#00758F" stroke-width="2"/>' }),
  make({ id: 'postgres', name: 'PostgreSQL', category: 'Database', site: 'https://www.postgresql.org', svgPath: '<path d="M12 2c-4.4 0-8 3.1-8 7v6c0 3.9 3.6 7 8 7s8-3.1 8-7V9c0-3.9-3.6-7-8-7Z" fill="#336791"/><path d="M8 10c0-2 1.8-3 4-3s4 1 4 3v2c0 2-1.8 3-4 3s-4-1-4-3v-2Z" fill="#fff"/>' }),
  make({ id: 'git', name: 'Git', category: 'Tool', site: 'https://git-scm.com', svgPath: '<rect width="24" height="24" rx="4" fill="#F05133"/><circle cx="9" cy="12" r="2" fill="#fff"/><circle cx="15" cy="7" r="2" fill="#fff"/><circle cx="15" cy="17" r="2" fill="#fff"/><path d="M9 12h6M15 9v8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' }),
  make({ id: 'vite', name: 'Vite', category: 'Build', site: 'https://vitejs.dev', svgPath: '<path d="M12 2 2 6l10 16 10-16-10-4Z" fill="#646CFF"/><path d="M12 6 6 8l6 10 6-10-6-2Z" fill="#FFD62E"/>' }),
  make({ id: 'fastapi', name: 'FastAPI', category: 'Backend', site: 'https://fastapi.tiangolo.com', svgPath: '<circle cx="12" cy="12" r="10" fill="#05998B"/><path d="M12 6v6l4 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' }),
  make({ id: 'django', name: 'Django', category: 'Backend', site: 'https://www.djangoproject.com', svgPath: '<rect x="4" y="3" width="16" height="18" rx="3" fill="#092E20"/><path d="M10 7h4v10h-4z" fill="#fff"/><path d="M10 7V5h2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' }),
];

export const TECHNOLOGIES_BY_CATEGORY = TECHNOLOGIES.reduce<Record<string, TechMeta[]>>((acc, t) => {
  (acc[t.category] ||= []).push(t);
  return acc;
}, {});

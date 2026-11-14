# Raghavendra S Patil — Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Three.js (React Three Fiber) and Lenis smooth scrolling.

## Requirements

Node.js **20.9 or newer** (Next.js 16 requirement). With nvm-windows: `nvm use 24.22.2`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Updating content

All content lives in **`src/data/portfolio.ts`** — profile, roles, about text, skills, projects, experience, education, research and certifications. Edit that one file; every section reads from it.

- Add a project: append to `projects`. Set `repo: "owner/name"` to pull its live GitHub stars, language and last-updated date. Set `featured: true` to show it as a large case-study card.
- Certificates: put the image in `public/certs/` and add an entry to `certifications`.

## Live data

`src/lib/github.ts` fetches GitHub profile and repository data on the server. The page is statically generated and **re-generated at most once per hour** (ISR), so it stays fast and current without client-side API calls. If GitHub is unreachable, the site renders with its static content.

Optional: set `GITHUB_TOKEN` (a read-only token) in your hosting environment to raise the GitHub API rate limit. Set `NEXT_PUBLIC_SITE_URL` to your production URL for correct social preview images (on Vercel this is detected automatically).

## Contact form

The contact form uses EmailJS (IDs in `src/components/Contact.tsx`): one template notifies you, a second sends the visitor an auto-reply.

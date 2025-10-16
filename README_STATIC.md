## Portfolio (HTML + CSS + JavaScript)

Static, responsive portfolio with animations, skills tabs, certificates lightbox, command palette, theme customizer, and a contact form powered by EmailJS + reCAPTCHA v3, including honeypot and client-side rate limiting.

### Quick Start
- Double-click `index.html`, or serve locally via VS Code Live Server.

### Structure
```
index.html
styles.css
script.js
public/certificates/
src/assets/
```

### Configure
- Profile: `index.html` → `src="src/assets/raghavendra photo.jpeg"`
- Stats: set `data-target` in About cards (2, 5, 4)
- Certificates: add files to `public/certificates/` and update `index.html` paths
- Projects: update GitHub/source links in the Projects section

### Contact Form
Set in `index.html` (already scaffolded):
- `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `OWNER_EMAIL`
- `RECAPTCHA_SITE_KEY`

`script.js` handles honeypot, 30s rate limit, reCAPTCHA v3, and mailto fallback.

### Deploy
- GitHub Pages (root) or any static host (Netlify/Vercel/Cloudflare). Upload the repo as static files.

### License
MIT © 2025


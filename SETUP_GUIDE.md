## Setup Guide (Static Portfolio)

This guide explains how to configure, run, and deploy the HTML/CSS/JS portfolio.

---
### 1) Prerequisites
- Any modern browser
- (Optional) VS Code with Live Server extension for local hosting

---
### 2) Run Locally
- Easiest: double‑click `index.html`
- Better: open the folder in VS Code → “Open with Live Server” for clean routing and caching behavior

---
### 3) Configure Your Content
- Profile photo: in `index.html`, set the hero `<img>` to `src="src/assets/raghavendra photo.jpeg"`
- About stats: set `data-target` values (2 years, 5 projects, 4 certifications)
- Certificates: drop images into `public/certificates/` and ensure the `<img src>` paths in `index.html` match your filenames
- Projects: update titles, descriptions, and GitHub/source links directly in `index.html`

---
### 4) Contact Form (EmailJS + reCAPTCHA v3)
1. Create an EmailJS account at `https://www.emailjs.com`
2. Create an Email Service and a Template; copy these:
   - EMAILJS_SERVICE_ID
   - EMAILJS_TEMPLATE_ID
   - EMAILJS_PUBLIC_KEY
3. In `index.html`, set the above variables and `OWNER_EMAIL`
4. Create a reCAPTCHA v3 site in Google Admin and set `RECAPTCHA_SITE_KEY` in `index.html`
5. `script.js` integrates:
   - Honeypot anti‑spam field
   - Client‑side rate limit (30s)
   - reCAPTCHA v3 token fetch on submit
   - `mailto:` fallback if EmailJS fails

No backend is required.

---
### 5) Theming and Extras
- Theme Customizer: change primary color, radius, motion; settings persist via `localStorage`
- Command Palette: Ctrl/Cmd+K to search and jump to sections
- Certificates Lightbox: click any certificate to view larger
- Project Quick View: open modal with tilt effects

---
### 6) Deploy
- GitHub Pages (root folder): Settings → Pages → Branch `main` → Folder `/` (root)
- Or deploy to Netlify / Vercel / Cloudflare Pages as a static site

Custom domain: configure DNS at your provider; Pages/host will guide you.

---
### 7) Maintenance Tips
- Keep images within `src/assets/` (profile) and `public/certificates/` (certs)
- If you rename images, update paths in `index.html`
- Adjust animation timings and thresholds in `script.js`

---
### 8) Troubleshooting
| Symptom | Fix |
|--------|-----|
| Profile image not visible | Verify path `src/assets/raghavendra photo.jpeg` and file exists |
| Certificates not showing | Check filenames in `public/certificates/` and matching `img src` |
| Email not sent | Confirm EmailJS IDs/keys and template fields map to form names |
| reCAPTCHA errors | Ensure correct site key and internet connectivity |
| Double submits | Rate limit is 30s; wait or adjust in `script.js` |

---
Happy building! 🚀

# Srinath — AI/ML Engineer Portfolio

A cinematic, single-page portfolio for an AI/ML Engineer profile — Generative AI, RAG pipelines, NLP,
predictive ML, and cloud/MLOps. Built as a dependency-free static site (no build step) so it deploys
straight to GitHub Pages.

## Highlights

- **Cinematic visuals**: dark neon theme, glassmorphism cards, animated gradient text, custom cursor,
  ambient background glow and grid.
- **3D hero background**: a live Three.js neural-network particle field (glowing nodes + connecting
  edges) with slow auto-rotation and mouse parallax — degrades to a static frame under
  `prefers-reduced-motion` and disappears gracefully if WebGL is unavailable.
- **Scroll storytelling**: GSAP + ScrollTrigger power scroll-synced reveals and a progress-filled
  experience timeline; everything has a plain IntersectionObserver/CSS fallback if the CDN scripts
  fail to load.
- **Micro-interactions**: magnetic buttons, 3D tilt project cards, animated stat counters, a typed
  rotating role headline, scroll progress bar, and active-section nav highlighting.
- **Fully responsive** and accessible: mobile nav, `scroll-margin-top` for anchor links, `<noscript>`
  fallback, reduced-motion support.

## Sections

Hero · About · Skills (incl. Cloud & MLOps) · System Design (RAG architecture) · **Infrastructure**
(gated 3D system-architecture diagram + global footprint map) · Experience timeline · Projects ·
Leadership & Ownership · Certifications & Education · Contact.

### The gated Infrastructure section

The full system-architecture diagram (a 3D layered Three.js stack: Client → API → AI/ML → Data →
Cloud/MLOps) and the global-footprint map are behind a **soft access gate**, not real
authentication — GitHub Pages has no backend, so there's nothing to check a password against
server-side. It exists to create an "ask first" moment for recruiters, not to cryptographically
protect anything; anyone who opens browser dev tools can bypass it.

- Visitors click **Request Access**, which opens the message chat box pre-filled with a
  recruiter-intro message (sent to you via WhatsApp or email, whichever they pick).
- Or they enter an **access code** you've shared with them personally, which unlocks it in their
  browser (persisted via `localStorage`, so it stays unlocked on return visits from that device).
- The code lives in `script.js` as `ARCH_ACCESS_CODE` (currently `RECRUITER2026`) — change it
  anytime; it's a plain string, no build step needed.

## Tech Stack

- HTML5, CSS3 (custom properties, Grid/Flexbox)
- Vanilla JavaScript (no framework, no build tooling)
- [Three.js](https://threejs.org/) — hero neural-network background (`three-bg.js`) and the gated
  3D layered architecture diagram (`architecture-3d.js`)
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-linked animation (optional enhancement, guarded)
- Font Awesome (icons), Google Fonts — Space Grotesk / Inter / JetBrains Mono

## File Structure

```
portfolio-website/
├── index.html                      # Page structure & content
├── styles.css                      # Design system, layout, animations, responsive rules
├── script.js                       # Interactions: cursor, reveals, counters, nav, tilt, magnetic btns
├── three-bg.js                     # Three.js neural-network hero background
├── architecture-3d.js               # Three.js 3D layered architecture diagram (gated section)
├── profile-photo.jpg               # Profile photo
├── Srinath-Koyi-AI-ML-Resume.pdf   # Downloadable résumé (linked from nav/hero/contact)
├── CNAME                           # Custom domain (srinathkoyi.cloud)
└── docs/                           # Deployment & DNS support docs
```

## Running Locally

No build step required — just serve the folder statically:

```bash
# Python
python -m http.server 8000

# Node
npx http-server
```

Then open `http://localhost:8000`.

## Customization

- **Colors / theme**: CSS custom properties at the top of `styles.css` (`:root`).
- **Content**: edit `index.html` directly — sections are clearly labeled with HTML comments.
- **Résumé**: replace `Srinath-Koyi-AI-ML-Resume.pdf` and keep the filename, or update the `href`s
  that reference it (nav, hero, contact).
- **3D background density**: `NODE_COUNT` / `MAX_EDGES` in `three-bg.js` (auto-reduced on small screens).

### Cache-busting (important!)

`styles.css`, `script.js`, `three-bg.js`, `architecture-3d.js`, and `profile-photo.jpg` are loaded
with a `?v=YYYYMMDDx`
query string in `index.html`. GitHub Pages' CDN caches these files for ~10 minutes by filename, so
if you edit any of them **without** bumping that version string, visitors (and your own browser)
can keep seeing the old copy for a while after you push. Whenever you change one of those four
files, bump its `?v=` value in `index.html` (e.g. `20260911c` -> `20260911d`) so the new content is
served as a fresh URL immediately instead of waiting out the cache.

## Deployment

Deployed via GitHub Pages with a custom domain (`srinathkoyi.cloud`, see `CNAME`). See `docs/DEPLOY.md`
and `docs/CUSTOM_DOMAIN_SETUP.md` for the original setup notes.

## Contact

- **Email**: srinath.koyi@applywizard.ai
- **Location**: USA
- **LinkedIn**: [Srinath](https://www.linkedin.com/in/srinath-k-6572389590s/)
- **GitHub**: [Sree201](https://github.com/Sree201)

Phone number is intentionally not shown as text on the page — a floating call / message button
pair (bottom-right corner, see `.fab-contact` in `index.html`/`styles.css`) links directly to
`tel:` and `sms:` instead.

---

© 2025 Srinath. All rights reserved.

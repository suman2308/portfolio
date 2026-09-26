# Suman Jash — Portfolio

A fast, animated, fully responsive single-page portfolio. Dark editorial design, an
original illustrated character, a 3D lanyard ID card, and live competitive-programming
stats that never go stale.

**Live:** https://portfolio-self-phi-13.vercel.app/

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript (strict mode) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (theme tokens, no config file) |
| Animation | Motion 13 (`reducedMotion="user"`) |
| 3D | three.js + @react-three/fiber (lazy-loaded chunk) |
| Icons | lucide-react + inline brand SVGs (no icon-font payload) |

No backend, no database, no API keys — the built site is fully static.

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # refreshes live CP stats, then production build → dist/
npm run preview    # serve the production build locally
npm run typecheck
```

Requires Node ≥ 18. (No Node installed? A project-local runtime can live in
`.tooling/` — gitignored — and be prepended to `PATH`.)

## Where the content lives

**Everything the site shows is edited in one file: `src/data/portfolio.ts`.**

- `profile` — name, roles, tagline, location, contact, bio, education, achievements
- `heroImage` — portrait shown on the lanyard card (originals kept in `/originals`)
- `stats` — the four About-section numbers (experience, projects, problems, certifications)
- `heroMarquee` / `heroChips` — marquee words and floating skill chips
- `projects` — the case studies (ShetBhav, CourierAI, AeroBook): problem → highlights →
  result, tech, GitHub/demo links, screenshot, and an AI/ML badge flag
- `skills` — categorized skill groups
- `platforms` — competitive-programming handles (numbers come from `cp-live.ts`, below)
- `certifications` — title, issuer, year, detail line, and verification link

Adding a fourth project or a ninth certificate is just a new entry — the sections render
any number of cards.

## Live competitive-programming stats

The Coding section shows Codeforces, CodeChef and LeetCode numbers in two layers:

1. **Build time** — `scripts/fetch-cp-stats.mjs` (npm's `prebuild` hook) pulls each
   platform and writes `src/data/cp-live.ts`:
   - **Codeforces** — official JSON API (rating, max rating, rank)
   - **LeetCode** — public GraphQL profile (solved counts by difficulty)
   - **CodeChef** — no public API, so it best-effort scrapes the profile page

   Each platform falls back to its previous values if its source is unreachable, so a
   failed fetch never breaks the build. Refresh manually anytime with `npm run cp-stats`.

2. **In the browser** — the Codeforces card additionally re-pulls the official API from
   the visitor's browser (Codeforces sends CORS `*`), so the rating stays current even
   between deploys. On failure or after 8s it silently keeps the build-time values.

To point the script at different profiles, edit the `HANDLES` map at the top of
`scripts/fetch-cp-stats.mjs`.

## Certificates

All eight verification PDFs live in `public/certificates/` and are linked from the
Certifications section. The three EduSkills AICTE virtual internships are:

| Program | Duration | Window | Credential ID |
|---|---|---|---|
| AI Deployment & Automation | 10 weeks | Jan – Mar 2026 | `42C2841CCB3EE00CF2BB` |
| Prompt Engineering for AI | 8 weeks | Apr – Jun 2026 | `4EF6BBA5772AB76A234E` |
| DevOps & Cloud Automation | 8 weeks | Aug – Oct 2026 | `41FBB98CD82AE33A3E65` |

To add or replace a certificate: drop the PDF in `public/certificates/` (named by
content) and add/ edit the entry in `certifications` in `src/data/portfolio.ts`.

## Images & assets

Site images live in `public/images/` (optimized WebP) and are referenced as
`/images/…`. The asset map, originals/optimization history, and how the hero photo
becomes the lanyard card's front face are documented in
[`public/images/README.md`](public/images/README.md).

## Resume

`public/resume/Suman_Jash_Resume.pdf` is compiled from the LaTeX source next to it,
`Suman_Jash_Resume.tex` — edit the `.tex`, then recompile (any XeTeX engine, e.g.
tectonic, works; the two pdfTeX-only lines `\input{glyphtounicode}` and
`\pdfgentounicode=1` must be stripped for XeTeX):

```bash
grep -vE 'input\{glyphtounicode\}|pdfgentounicode=1' Suman_Jash_Resume.tex > resume-xetex.tex
tectonic resume-xetex.tex
cp resume-xetex.pdf Suman_Jash_Resume.pdf
```

## Structure

```
index.html                  metadata (SEO/OG/Twitter/JSON-LD Person schema) + fonts
scripts/
  fetch-cp-stats.mjs        build-time live CP stats fetcher (prebuild hook)
public/
  certificates/             the 8 verification PDFs linked from Certifications
  images/                   optimized WebP/JPG assets (+ README asset map)
  resume/                   resume PDF + LaTeX source
  robots.txt, favicon.svg
src/
  components/               Nav, Hero, Marquee, icons, shared UI primitives
  components/character/     Character.tsx — the site's illustrated signature
  components/effects/       LightFall, SplashCursor, SplitText, FoldText, Lanyard (3D)
  sections/                 About, Projects, Skills, Coding, Certifications, Connect
  data/
    portfolio.ts            ← all site content (edit here)
    cp-live.ts              ← generated live CP stats (do not edit by hand)
  lib/anim.ts               shared easing curve
  index.css                 design system (theme tokens, keyframes, reduced motion)
originals/                  un-compressed source images for re-deriving (never built)
```

## Deploying

`npm run build` outputs a fully static site to `dist/` — host it anywhere (Vercel,
Netlify, GitHub Pages, Render).

- The production URL is baked into `index.html` (canonical, Open Graph/Twitter image
  URLs, JSON-LD). It's currently `https://portfolio-self-phi-13.vercel.app/` — update
  all references there if the domain ever changes.
- GitHub Pages project page? Build with a base path first:
  `npx vite build --base=/repo-name/` (root pages and other hosts use the default `/`).
- On Vercel, keep **Deployment Protection off** (Project → Settings → Deployment
  Protection) so recruiters — and the og:image crawler — can reach the site.

## Security & hygiene

- **Static site** — no backend, no database, no environment secrets (`process.env` /
  `import.meta.env` are unused). The only runtime API call is the public, keyless
  Codeforces user endpoint (CORS-open), plus the build-time stats fetch.
- No `dangerouslySetInnerHTML`, `eval`, or dynamic `innerHTML`; all data renders as
  plain text via React.
- Public assets (resume, certificates, screenshots) contain only information already
  public on LinkedIn/GitHub.
- `.gitignore` covers `node_modules`, `dist`, `.tooling`, `.env*`, and editor/OS files —
  secrets can't be committed accidentally.

## Character & visual identity

The portfolio's signature is an original illustrated **character**
(`src/components/character/Character.tsx`) — a smart, young version of Suman in black
wayfarer sunglasses, with a styled haircut, light-blue shirt and an ID card on a
lanyard echoing the Hero's 3D card. The face is the identity and stays pixel-identical
everywhere; only the pose changes:

- **Hero** — the head peeks beside the hanging card
- **About** — arms crossed, over a `> whoami` terminal card
- **Projects** — every case study is stamped "Signed & shipped"
- **Coding** — focused over a laptop at a `solve.py` terminal
- **Skills** — a small "the toolbelt" cameo
- **Connect** — a farewell wave

Three poses (`relaxed`, `laptop`, `wave`) plus the head-only `CharacterHead`. The
favicon is the character's face.

## Design notes

- Dark, minimal, technical aesthetic — warm ember-orange accent, editorial serif-italic
  touches, film grain, hairline grid.
- Scroll-driven Hero: split-character name entrance, the 3D **lanyard ID card** (photo
  front, branded back, striped band, damped pendulum physics + cursor sway) built with
  three.js/react-three-fiber and lazy-loaded into its own chunk, LightFall streak
  background, cycling side words, marquee.
- Projects are **case studies** — PROBLEM → HIGHLIGHTS → RESULT inside a browser-frame
  preview, with an AI/ML badge where relevant.
- Cursor: warm ember trail (SplashCursor); custom canvas **LightFall** streaks in the
  Hero — both disabled on touch devices.
- **Accessibility:** skip-link, semantic landmarks, `aria` labels on icon buttons,
  keyboard-dismissable mobile menu (Escape), focus-visible outlines, WCAG-AA-checked
  text contrast, and global `prefers-reduced-motion` support (Motion
  `reducedMotion="user"` + CSS overrides; effects render static frames; SplashCursor is
  fully disabled; the Lanyard renders a static frame).
- No horizontal overflow at any breakpoint — layouts adapt rather than shrink, verified
  from 360 px phones to wide desktop.

# Suman Jash — Portfolio

A premium, animated, fully responsive developer portfolio built with **React · Vite · TypeScript · Tailwind CSS · Motion** (plus three.js for the 3D lanyard card).

Live: **https://portfolio-self-phi-13.vercel.app/**

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # refreshes live CP stats, then production build → dist/
npm run preview  # preview the production build
npm run typecheck
```

> No Node.js installed? A project-local runtime lives in `.tooling/` (gitignored). Prefix commands with
> `export PATH="$PWD/.tooling/node-v24.19.0-win-x64:$PATH"`.

## Filling in your content

**Everything the site shows lives in one file: `src/data/portfolio.ts`** (the only exception is the competitive-programming stats, which are generated into `cp-live.ts` — see below).

- `profile` — name, roles, tagline, location, email, resume link, links, bio, focus areas, achievements
- `profile.educationList` — school, degree, years and location for the Education block in About
- `heroImage` — path to your portrait in `public/images/` (e.g. `/images/hero.webp`; the original sources live in `/originals`)
- `stats` — experience, projects, problems solved, certifications (strings render as-is)
- `heroMarquee` / `heroChips` — marquee words and floating chips in the Hero
- `projects` — the case studies (ShetBhav, CourierAI, AeroBook): `tagline`, `problem`, `result`, `features`, `tech`, `github`/`demo` links, `domain` (shown in the browser-frame URL bar), `ai` (shows the AI/ML core badge) and `image`. Adding a fourth project is just a new entry — the section renders any number of cards.
- `skills` — categorized skill groups
- `platforms` — competitive programming profiles (handle, URL). **The stats come from `cp-live.ts`** — see below.
- `certifications` — certificates with issuer, year and verification URL

## Live competitive-programming stats

The stats never go stale — two layers:

1. **Build time** — `scripts/fetch-cp-stats.mjs` (npm's `prebuild` hook, so it runs automatically on `npm run build`) pulls the Coding-section numbers from the live sources and writes `src/data/cp-live.ts`:
   - **Codeforces** — official JSON API (rating, max rating, rank)
   - **LeetCode** — public GraphQL profile (solved counts by difficulty)
   - **CodeChef** — no public API, so it best-effort scrapes the profile page

   Every platform falls back to its previous values if its source is unreachable, so a failed fetch never breaks the build. To refresh manually without a full build: `npm run cp-stats`.

2. **In the browser** — the Codeforces card additionally re-pulls the official API from the visitor's browser (Codeforces sends CORS `*`), so the rating is current even between deploys. If the request fails or is slow (>8s), the card silently keeps the build-time values.

To point the script at different profiles, edit the `HANDLES` map at the top of `scripts/fetch-cp-stats.mjs`.

## Images & assets

Place images in `public/images/` and reference them as `/images/…`. Details — including the originals/optimization history and how the hero photo becomes the lanyard card's front face — are in [`public/images/README.md`](public/images/README.md).

## Resume

`public/resume/Suman_Jash_Resume.pdf` is compiled from its LaTeX source, `public/resume/Suman_Jash_Resume.tex` (edit the `.tex`, then recompile). A project-local tectonic build lives in `.tooling/tectonic/` — the two pdfTeX-only lines (`\input{glyphtounicode}`, `\pdfgentounicode=1`) are stripped for the XeTeX build:

```bash
cd .tooling/resume-build
grep -vE 'input\{glyphtounicode\}|pdfgentounicode=1' resume.tex > resume-xetex.tex
../tectonic/tectonic.exe -X compile resume-xetex.tex
cp resume-xetex.pdf ../../public/resume/Suman_Jash_Resume.pdf
```

(Resume build input is `resume.tex` — copy the edited `.tex` there first.)

## Structure

```
index.html                  metadata (SEO/OG/Twitter/JSON-LD) + font loading
scripts/
  fetch-cp-stats.mjs        build-time live CP stats fetcher (prebuild hook)
public/
  images/                   optimized WebP images (+ README with the asset map)
  resume/                   resume PDF + LaTeX source
  certificates/             verification PDFs linked from the Certifications section
  robots.txt, favicon.svg
src/
  components/               Nav, Hero, Marquee, icons, shared UI primitives
  components/character/     Character.tsx — the site's illustrated signature (poses + head cameo)
  components/effects/       LightFall, SplashCursor, SplitText, FoldText, Lanyard (3D, lazy chunk)
  sections/                 About, Projects, Skills, Coding, Certifications, Connect
  data/                     portfolio.ts — all site content; cp-live.ts — generated live CP stats
  lib/anim.ts               shared easing curve
  index.css                 design system (theme tokens, keyframes, reduced motion)
originals/                  un-compressed source images (kept in the repo for re-deriving; never in the build output)
```

## Deploying

The build is a plain static site — `npm run build` outputs to `dist/` and it can be hosted anywhere (Vercel, Netlify, GitHub Pages, Render).

> The production site URL lives in `index.html` (canonical, Open Graph/Twitter image URLs, and the JSON-LD Person schema). It's currently `https://portfolio-self-phi-13.vercel.app/` — update all references there if the domain ever changes.

For a **GitHub Pages project page** (`username.github.io/repo/`), set the base path first:

```bash
npx vite build --base=/repo-name/
```

(For `username.github.io` root pages, or Netlify/Render/Vercel, the default `/` base is correct.)

> On Vercel, make sure **Deployment Protection is off** (Project → Settings → Deployment Protection) so recruiters — and the og:image crawler — can reach the site.

## Security & hygiene

- **Static site** — no backend, no database, no environment secrets in the codebase (`process.env` / `import.meta.env` are unused). The only runtime API call is the public, keyless Codeforces user endpoint (CORS-open) plus the build-time stats fetch.
- **`npm audit` — 0 vulnerabilities** on all dependencies.
- No `dangerouslySetInnerHTML`, `eval`, or dynamic `innerHTML`; all data renders as plain text via React.
- Public assets (resume, certificates, project screenshots) contain only public information already shared on LinkedIn/GitHub.
- `.gitignore` covers `node_modules`, `dist`, `.tooling`, `.env*`, and editor files — secrets can't be committed accidentally.

## Character & visual identity

The portfolio has an original illustrated **character** (`src/components/character/Character.tsx`) — a smart, young, cool version of Suman in **black wayfarer sunglasses**, with a styled haircut that frames the face, a youthful angular jaw, a relaxed confident mouth, a light-blue shirt and an understated ID card on a lanyard that echoes the Hero's hanging card. The face is the identity and stays pixel-identical everywhere; only the pose changes:

- **Hero** — a small `CharacterHead` peeks beside the hanging ID card
- **About** — relaxed, arms crossed, over a `> whoami` terminal card
- **Projects** — every case study is stamped "Signed & shipped" with the character head
- **Coding** — the character sits at a `solve.py` terminal scene, focused over a laptop
- **Skills** — a small "the toolbelt" cameo
- **Connect** — a natural farewell wave

Three poses are available (`relaxed`, `laptop`, `wave`) via the `pose` prop; `CharacterHead` is the head-only cameo. Both honor `prefers-reduced-motion` (the gentle bob stops). The favicon is the character's face with the black sunglasses.

## Design notes

- Dark, minimal, technical aesthetic — warm ember-orange accent with amber/cream supports, editorial serif italic touches, film grain, hairline grid.
- Scroll-driven Hero: layered typography (split-character entrance), a 3D **lanyard ID card** (photo front, branded back, striped band, pendulum physics + cursor sway) built with three.js and react-three-fiber and lazy-loaded into its own chunk, LightFall streak background, cycling side words, marquee, and the character peek.
- Projects are **case studies**: each card carries PROBLEM → HIGHLIGHTS → RESULT blocks inside a browser-frame preview, an AI/ML badge where relevant, and the character's signature.
- Cursor: warm ember trail (**SplashCursor**) with a hue range from orange to gold.
- Custom canvas effects: **LightFall** (falling light streaks in the Hero) and **SplashCursor** (ember trail following the pointer) — both disabled on touch devices.
- Text animation: **SplitText** (character stagger) in the Hero, **FoldText** (3D paper-unfold with crease shading) for every section heading.
- `prefers-reduced-motion` is honored globally (Motion `reducedMotion="user"` + CSS overrides + components rendering static frames; SplashCursor fully disabled; the Lanyard renders a static frame).
- Mouse parallax / tilt / cursor effects are disabled for touch devices and reduced-motion users.
- No horizontal overflow; layout adapts (not shrinks) across desktop → small mobile.

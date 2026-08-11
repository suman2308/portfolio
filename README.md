# Suman Jash — Portfolio

A premium, animated, fully responsive developer portfolio built with **React · Vite · TypeScript · Tailwind CSS · Motion**.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run typecheck
```

> No Node.js installed? A project-local runtime lives in `.tooling/` (gitignored). Prefix commands with
> `export PATH="$PWD/.tooling/node-v24.19.0-win-x64:$PATH"`.

## Filling in your content

**Everything the site shows lives in one file: `src/data/portfolio.ts`** (the only exception is the competitive-programming stats, which are generated into `cp-live.ts` — see below).

- `profile` — name, roles, tagline, location, email, resume link, links, bio, focus areas, achievements
- `profile.educationList` — school, degree, years and location for the Education block in About
- `heroImage` — path to your portrait in `public/images/` (e.g. `/images/hero.jpg`)
- `stats` — experience, projects, problems solved, certifications (strings render as-is)
- `heroMarquee` / `heroChips` — marquee words and floating chips in the Hero
- `projects` — your 2 main projects (title, description, features, tech, GitHub/demo links, image)
- `skills` — categorized skill groups
- `platforms` — competitive programming profiles (handle, URL). **The stats come from `cp-live.ts`**, which is regenerated from the live sources on every build — see below.
- `certifications` — certificates with issuer, year and verification URL

## Live competitive-programming stats

Before every build, `scripts/fetch-cp-stats.mjs` (npm's `prebuild` hook, so it runs automatically on `npm run build`) pulls the Coding-section numbers from the live sources and writes `src/data/cp-live.ts`:

- **Codeforces** — official JSON API (rating, max, rank)
- **LeetCode** — public GraphQL profile (solved counts by difficulty)
- **CodeChef** — no public API, so it best-effort scrapes the profile page

Every platform falls back to its previous values if its source is unreachable, so a failed fetch never breaks the build. To refresh manually without a full build: `npm run cp-stats`. To point the script at different profiles, edit the `HANDLES` map at the top of the script.

Place images in `public/images/` and reference them as `/images/…`. The hero photo becomes the lanyard card's front face automatically; drop a custom image in `backImage` or the `frontImage` prop of `<Lanyard>` in `src/components/Hero.tsx` to swap faces.

## Resume

`public/resume/Suman_Jash_Resume.pdf` is compiled from its LaTeX source, `public/resume/Suman_Jash_Resume.tex` (edit the `.tex`, then recompile). A project-local tectonic build lives in `.tooling/tectonic/` — the two pdfTeX-only lines (`\input{glyphtounicode}`, `\pdfgentounicode=1`) are stripped for the XeTeX build:

```bash
cd .tooling/resume-build
grep -vE 'input\{glyphtounicode\}|pdfgentounicode=1' resume.tex > resume-xetex.tex
../tectonic/tectonic.exe -X compile resume-xetex.tex
cp resume-xetex.pdf ../../public/resume/Suman_Jash_Resume.pdf
```

## Structure

```
```
src/
  components/   Nav, Hero, Marquee, icons, shared UI primitives
  components/effects/  LightFall, SplashCursor, SplitText, FoldText (canvas + text animation)
  components/effects/Lanyard.tsx  3D swinging ID card (three.js / react-three-fiber, lazy-loaded)
  sections/     About, Projects, Skills, Coding, Certifications, Connect
  data/         portfolio.ts — site content; cp-live.ts — generated live CP stats
  lib/          animation presets
  index.css     design system (theme tokens, keyframes, reduced motion)
scripts/        fetch-cp-stats.mjs — build-time live CP stats fetcher
```

## Deploying to GitHub Pages

The build is a plain static site — `npm run build` outputs to `dist/` and it can be hosted anywhere (GitHub Pages, Netlify, Render, Vercel).

For a **project page** (`username.github.io/repo/`), set the base path first:

```bash
npx vite build --base=/repo-name/
```

(For `username.github.io` root pages, or Netlify/Render/Vercel, the default `/` base is correct.)

## Security & hygiene

- **Static site** — no backend, no database, no environment secrets in the codebase (`process.env` / `import.meta.env` are unused).
- **`npm audit` — 0 vulnerabilities** on all dependencies.
- No `dangerouslySetInnerHTML`, `eval`, or dynamic `innerHTML`; all user data is rendered as plain text via React.
- Public assets (resume, certificates, project screenshots) contain only public information already shared on LinkedIn/GitHub.
- `.gitignore` covers `node_modules`, `dist`, `.tooling`, `.env*`, and editor files — secrets can't be committed accidentally.

## Design notes

- Dark, minimal, technical aesthetic — warm ember-orange accent with amber/cream supports, editorial serif italic touches, film grain, hairline grid.
- Scroll-driven Hero: layered typography (split-character entrance), a 3D **lanyard ID card** (photo front, branded back, striped band, pendulum physics + cursor sway) built with three.js and react-three-fiber and lazy-loaded into its own chunk, LightFall streak background, cycling side words, marquee.
- Cursor: warm ember trail (**SplashCursor**) with a hue range from orange to gold.
- Custom canvas effects: **LightFall** (falling light streaks in the Hero) and **SplashCursor** (ember trail following the pointer) — both disabled on touch devices.
- Text animation: **SplitText** (character stagger) in the Hero, **FoldText** (3D paper-unfold with crease shading) for every section heading.
- `prefers-reduced-motion` is honored globally (Motion `reducedMotion="user"` + CSS overrides + components rendering static frames).
- Mouse parallax / tilt / cursor effects are disabled for touch devices and reduced-motion users.
- No horizontal overflow; layout adapts (not shrinks) across desktop → small mobile.

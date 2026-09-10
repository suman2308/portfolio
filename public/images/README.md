# Images — where everything lives

The site ships everything from `public/`. Current layout:

```
public/
├── images/                              # optimized images actually used by the site
│   ├── hero.webp                        # Hero portrait (lanyard card front face) — WebP
│   ├── og.jpg                           # 1200×630 Open-Graph share image
│   ├── project-shetbhav.webp            # ShetBhav live-demo login screenshot (1440×900, captured from the running app)
│   ├── project-courierai.webp           # CourierAI landing-page screenshot (from the repo README)
│   └── project-aerobook.webp            # AeroBook landing-page screenshot (from the repo README)
├── resume/
│   ├── Suman_Jash_Resume.pdf            # compiled from Suman_Jash_Resume.tex (see root README.md)
│   └── Suman_Jash_Resume.tex            # LaTeX source of the resume
├── robots.txt                           # allows all crawlers
└── certificates/                        # all certificates, named by content
    ├── NPTEL_Programming_In_Java_Elite.pdf
    ├── NPTEL_Cloud_Computing.pdf
    ├── AI_Deployment_Automation_Internship.pdf        # Eduskill, Mar 2026
    ├── Prompt_Engineering_AI_Internship.pdf           # Eduskill, Aug 2026
    ├── Python_Programming_Training_Ardent.pdf         # Ardent, ID ARDENT/133057
    ├── Generative_AI_Training_Ardent.pdf              # Ardent, ID ARDENT/192400
    └── MEAN_Full_Stack_Training_IALSD.pdf
```

## Originals

The un-compressed sources live in `/originals` at the project root (outside
`public/`, so they never ship in the build):

```
originals/
├── hero.jpg                    # original portrait
├── project-shetbhav.png        # original screenshot (live demo login, captured at 2880×1800 @2x)
├── project-courierai.png       # original screenshot
└── project-aerobook.png        # original screenshot
```

Conversion history (done with `sharp`, ad hoc — no dependency added):

| File | Before | After (WebP) |
|---|---|---|
| hero.jpg | 390 KB | 131 KB |
| project-shetbhav.png | captured live at 2880×1800 (2× scale) | 21 KB |
| project-courierai.png | 197 KB | 35 KB |
| project-aerobook.png | 259 KB | 26 KB |

All conversions preserve the original dimensions (hero stays 3:4, screenshots
stay landscape) with a mean pixel difference under 1.6/255 — visually lossless.
`og.jpg` (1200×630) is a cover crop of `hero.jpg` used for link shares.

## Hero card image

The Hero's lanyard card front face is `profile.heroImage` from
`src/data/portfolio.ts` (`/images/hero.webp`). The card is a 3:4 portrait crop
(`object-cover`). A `characterImage` slot also exists — if set, it replaces the
photo on the card.

Notes:

- All site content (links, stats, certificate entries) is edited in `src/data/portfolio.ts`.

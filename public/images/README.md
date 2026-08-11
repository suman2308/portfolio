# Images & Documents — where everything lives

The site ships everything from `public/`. Current layout:

```
public/
├── images/                              # photos
│   ├── hero.jpg                         # Hero portrait (lanyard card front face)
│   ├── project-courierai.png            # CourierAI landing-page screenshot (from the repo README)
│   └── project-aerobook.png             # AeroBook landing-page screenshot (from the repo README)
├── resume/
│   ├── Suman_Jash_Resume.pdf            # compiled from Suman_Jash_Resume.tex (see README.md)
│   └── Suman_Jash_Resume.tex            # LaTeX source of the resume
└── certificates/                        # all certificates, named by content
    ├── NPTEL_Programming_In_Java_Elite.pdf
    ├── NPTEL_Cloud_Computing.pdf
    ├── AI_Deployment_Automation_Internship.pdf        # Eduskill, Mar 2026
    ├── Prompt_Engineering_AI_Internship.pdf           # Eduskill, Aug 2026
    ├── Python_Programming_Training_Ardent.pdf         # Ardent, ID ARDENT/133057
    ├── Generative_AI_Training_Ardent.pdf              # Ardent, ID ARDENT/192400
    └── MEAN_Full_Stack_Training_IALSD.pdf
```

> The SIH participation certificate was removed from the site on request; the
> SIH achievement itself still appears in the About → Highlights list.

## Anime/3D character for the Hero

The Hero supports a `characterImage` slot in `src/data/portfolio.ts` — set it
(e.g. `characterImage: "/images/character.png"`) and the Hero shows the
character instead of the photo.

> The mockup you shared is a full-page design (character + text baked together),
> so it can't be cut out cleanly. Generate a **character-only** image and drop it
> in as `public/images/character.png`.

### Prompt to regenerate the character (fixes the "too young" look)

Paste this into ChatGPT (attach your photo as the reference) and tweak as you like:

> Create a premium 3D-anime hybrid portrait (Pixar/Arcane-quality) of a
> **22-year-old Indian software engineer**, Suman Jash, based on the attached
> reference photo. He must look like a **mature young professional — definitely
> an adult, not a teenager or child**: strong defined jawline, calm confident
> expression, subtle smile, neatly styled dark hair, and facial features that
> are clearly **recognizable from the reference photo** (same face shape, eyes,
> skin tone, hair). Dress him in smart casual developer wear (dark shirt or
> hoodie). Style: cinematic studio lighting, dark charcoal background with a
> soft violet rim light, centered **bust/waist-up** composition, **clean
> background — no text, no watermarks, no UI elements**. Professional and
> impressive, not cute.

Notes:

- The Hero card is a 3:4 portrait crop (`object-cover`).
- All site content (links, stats, certificate entries) is edited in `src/data/portfolio.ts`.

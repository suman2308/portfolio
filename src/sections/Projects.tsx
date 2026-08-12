import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Lock, Sparkles } from "lucide-react";
import { projects, type Project } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";
import { GithubIcon } from "../components/icons";
import { CharacterHead } from "../components/character/Character";

/** Tracks the cursor so a soft spotlight can follow it across the card. */
function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

function BrowserFrame({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/70 bg-ink/60 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line/60 bg-panel px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-ink/70 px-3 py-1 font-mono text-[10px] text-faint">
          <Lock className="h-3 w-3 shrink-0 text-ok/70" />
          <span className="truncate">{project.domain}</span>
        </span>
        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-faint/70 sm:block">
          0{index + 1}
        </span>
      </div>
      {/* screenshot */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} — home page screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-panel">
            <span className="text-stroke-thin text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {project.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel/50 via-transparent to-transparent" />
      </div>
    </div>
  );
}

function BlockLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
      <span aria-hidden="true">▍</span>
      {children}
    </p>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal>
      <article
        onMouseMove={trackSpotlight}
        className="group relative overflow-hidden rounded-[2rem] border border-line bg-panel transition-all duration-500 hover:border-accent/40 hover:shadow-[0_30px_80px_-30px_rgba(255,122,26,0.22)]"
      >
        <div className="grid lg:grid-cols-12">
          {/* left: case-study label, big name, browser-frame preview */}
          <div className="flex flex-col p-7 sm:p-10 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                Case study — 0{index + 1}
              </span>
              {project.ai && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-bright">
                  <Sparkles className="h-3 w-3" />
                  AI / ML core
                </span>
              )}
            </div>

            <h3 className="mt-5 text-balance text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">
              {project.title || "Your Project Title"}
            </h3>
            <p className="mt-4 leading-relaxed text-muted">{project.tagline}</p>

            <div className="mt-8 sm:mt-10">
              <BrowserFrame project={project} index={index} />
            </div>
          </div>

          {/* right: problem → highlights → result */}
          <div className="flex flex-col justify-center p-7 pt-0 sm:p-10 sm:pt-0 lg:col-span-7 lg:p-10 lg:pl-0">
            <div className="space-y-6">
              <div>
                <BlockLabel>Problem</BlockLabel>
                <p className="mt-2.5 leading-relaxed text-muted">{project.problem}</p>
              </div>

              <div>
                <BlockLabel>Highlights</BlockLabel>
                <ul className="mt-3 space-y-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex min-w-0 items-start gap-2.5 break-words text-sm leading-relaxed text-muted"
                    >
                      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-line/70 bg-ink/40 p-4">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
                <BlockLabel>Result</BlockLabel>
                <p className="mt-2.5 text-sm leading-relaxed text-fg/90">{project.result}</p>
              </div>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line bg-ink/50 px-3 py-1 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/* signature stamp */}
            <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
              <CharacterHead className="h-11 w-11 shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Signed &amp; shipped</p>
                <p className="mt-0.5 truncate text-sm text-fg">Suman Jash</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-300 hover:border-accent/60 hover:text-accent-bright"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
                >
                  Live demo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* cursor-following spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(560px_circle_at_var(--x,50%)_var(--y,50%),rgb(255_122_26/0.10),transparent_45%)]"
        />
      </article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Projects"
          title="Things I've built, end to end."
          highlight="built"
          description="Two main pieces of work, treated as case studies — what problem each one solves, how it's engineered, and what actually shipped."
          note="case studies · shipped, not mocked"
        />
        <div className="mt-14 space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

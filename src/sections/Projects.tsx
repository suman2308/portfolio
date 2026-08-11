import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";
import { GithubIcon } from "../components/icons";

/** Tracks the cursor so a soft spotlight can follow it across the card. */
function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

function ProjectVisual({ title }: { title: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-panel">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,rgb(255_122_26/0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(85%_85%_at_50%_45%,black,transparent)]" />
      <span className="text-stroke-thin relative px-6 text-center text-4xl font-bold uppercase tracking-tight sm:text-5xl">
        {title}
      </span>
    </div>
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
          {/* left: big site name, screenshot below it */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-6">
            <h3 className="text-balance text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              {project.title || "Your Project Title"}
            </h3>
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-line/70 sm:mt-12">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} — home page screenshot`}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <ProjectVisual title={project.title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-panel/60 via-transparent to-transparent" />
              <span className="absolute right-4 top-3 font-mono text-xs tracking-[0.2em] text-fg/70">
                0{index + 1}
              </span>
            </div>
          </div>

          {/* right: all the details */}
          <div className="flex flex-col justify-center p-7 pt-0 sm:p-10 sm:pt-0 lg:col-span-6 lg:p-10">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              <span>Featured Project</span>
              <span className="h-px w-8 bg-accent/50" />
            </div>
            <p className="mt-4 leading-relaxed text-muted">
              {project.description || "Add a short description of what this project does."}
            </p>

            <ul className="mt-6 space-y-2.5">
              {project.features.map((feature) => (
                <li key={feature} className="flex min-w-0 items-start gap-2.5 break-words text-sm leading-relaxed text-muted">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

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

            <div className="mt-8 flex flex-wrap items-center gap-3">
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
          description="A look at my main work — full-stack products and AI/ML experiments, shipped from idea to production."
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

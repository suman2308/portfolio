import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { profile } from "../data/portfolio";
import { Container, Reveal } from "../components/ui";
import { FoldText } from "../components/effects/FoldText";
import { GithubIcon, LinkedinIcon, XIcon } from "../components/icons";
import { Character } from "../components/character/Character";

export function Connect() {
  const year = new Date().getFullYear();

  const socials = [
    { label: "GitHub", href: profile.links.github, Icon: GithubIcon },
    { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinIcon },
    { label: "X", href: profile.links.twitter, Icon: XIcon },
    { label: "Email", href: profile.links.email ? `mailto:${profile.links.email}` : "", Icon: Mail },
  ].filter((s) => s.href);

  return (
    <footer id="connect" className="relative overflow-hidden border-t border-line">
      <Container className="pb-20 pt-24 text-center sm:pb-24 sm:pt-32">
        <Reveal>
          <Character pose="wave" className="mx-auto w-24 sm:w-28" />
        </Reveal>
        <Reveal>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em]">
            <span className="text-faint">06</span>
            <span className="mx-3 text-line-strong">/</span>
            <span className="text-accent-bright">Connect</span>
          </p>
        </Reveal>
        <FoldText
          as="h2"
          text="Let's build something worth shipping."
          highlight="shipping"
          trigger="inView"
          delay={0.12}
          className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
        />
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
            I&rsquo;m open to software engineering and AI/ML roles, interesting projects, and good
            conversations. If you&rsquo;re building something real, let&rsquo;s talk.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-base font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
            >
              Say hello
              <ArrowUpRight className="h-4.5 w-4.5" />
            </a>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line bg-panel text-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:text-fg"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-mono text-xs text-faint">© {year} {profile.name}</p>
          <p className="font-mono text-xs text-faint">Built with React · Vite · Tailwind · Motion</p>
          <a
            href="#home"
            className="group inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors duration-200 hover:text-fg"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </Container>
      </div>

      {/* giant watermark */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="text-stroke-thin -mb-[0.22em] text-center text-[clamp(3.5rem,15vw,13rem)] font-bold leading-none tracking-tight opacity-40">
          {profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}

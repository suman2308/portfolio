import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { EASE } from "../lib/anim";
import { GithubIcon } from "./icons";
import { Container } from "./ui";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "coding", label: "Coding" },
  { id: "certifications", label: "Certs" },
  { id: "connect", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 32));

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`border-b transition-colors duration-300 ${
            scrolled ? "border-line bg-ink/80 backdrop-blur-xl" : "border-transparent"
          }`}
        >
          {/* 3-column grid: logo left, menu dead-centre, resume/hamburger right */}
          <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-[4.5rem]">
            {/* logo — left (desktop and mobile) */}
            <a
              href="#home"
              onClick={close}
              className="group col-start-1 flex items-center gap-2.5 justify-self-start"
              aria-label="Suman Jash — back to top"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-panel font-serif text-lg italic text-accent-bright transition-colors duration-300 group-hover:border-accent/50">
                {profile.initials}
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-fg sm:block">
                {profile.name}
              </span>
            </a>

            <nav aria-label="Primary" className="col-start-2 hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                    active === l.id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-panel"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="col-start-3 flex items-center gap-3 justify-self-end">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-panel text-muted transition-colors duration-200 hover:border-accent/50 hover:text-fg lg:grid"
              >
                <GithubIcon className="h-4.5 w-4.5" />
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:bg-accent-bright lg:inline-flex"
                >
                  Resume
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-fg transition-colors hover:border-accent/50 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </Container>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center px-8 pt-16">
              <nav aria-label="Mobile" className="flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={close}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.06 * i + 0.12, duration: 0.5, ease: EASE }}
                    className="group flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                    <span className="text-3xl font-medium tracking-tight text-fg transition-colors duration-200 group-hover:text-accent-bright">
                      {l.label}
                    </span>
                  </motion.a>
                ))}
              </nav>
            </div>
            <div className="flex flex-wrap items-center gap-4 px-8 pb-10">
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent-bright"
                >
                  Resume
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent-bright"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm text-accent-bright"
              >
                {profile.email}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

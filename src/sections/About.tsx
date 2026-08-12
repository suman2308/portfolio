import { Award, Briefcase, GraduationCap, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { profile, stats } from "../data/portfolio";
import { Chip, Container, Reveal, SectionHeading } from "../components/ui";
import { Character } from "../components/character/Character";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="About"
          title="Engineer by trade, builder by nature."
          highlight="builder"
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {profile.focusAreas.map((area) => (
                <Chip key={area}>{area}</Chip>
              ))}
            </ul>

            <div className="mt-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">Highlights</p>
              <ul className="mt-5 space-y-4">
                {profile.achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-line bg-panel text-accent-bright">
                      <Award className="h-3.5 w-3.5" />
                    </span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="space-y-4">
            {/* the operator — the character's first full appearance */}
            <Reveal delay={0.05}>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-panel">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(80%_80%_at_50%_30%,black,transparent)]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
                />
                <Character pose="relaxed" className="relative mx-auto mt-4 w-48 sm:w-52" />
                <div className="relative border-t border-line px-6 py-4">
                  <p className="font-mono text-[11px] tracking-[0.08em] text-accent-bright">&gt; whoami</p>
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted">
                    suman jash — cse undergrad · kolkata
                    <span aria-hidden="true" className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-accent" />
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">Currently</dt>
                <dd className="mt-2 flex items-start gap-3 text-fg">
                  <Briefcase className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {profile.headline} — {profile.focusAreas.slice(0, 2).join(" · ")}
                  </span>
                </dd>

                <div className="my-6 h-px bg-line" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <MapPin className="h-3.5 w-3.5" /> Location
                    </dt>
                    <dd className="mt-2 text-fg">{profile.location}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </dt>
                    <dd className="mt-2 truncate text-fg">{profile.email}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </dt>
                    <dd className="mt-2 text-fg">{profile.phone}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <Sparkles className="h-3.5 w-3.5" /> Open to work
                    </dt>
                    <dd className="mt-2 text-fg">{profile.openToWork ? "Yes — let's talk" : "—"}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <Briefcase className="h-3.5 w-3.5" /> Focus
                    </dt>
                    <dd className="mt-2 text-fg">{profile.headline}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                      <GraduationCap className="h-3.5 w-3.5" /> Education
                    </dt>
                    <dd className="mt-3 space-y-3">
                      {profile.educationList.map((edu) => (
                        <div key={edu.school} className="rounded-xl border border-line/60 bg-ink/40 p-3">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <p className="text-sm font-medium text-fg">{edu.school}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">{edu.years}</p>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted">{edu.degree}</p>
                          <p className="mt-0.5 text-[11px] text-faint">{edu.location}</p>
                        </div>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.14 + i * 0.05}>
                  <div className="rounded-3xl border border-line bg-panel p-5 transition-colors duration-300 hover:border-accent/40 sm:p-6">
                    <div className="text-3xl font-semibold tracking-tight">
                      {s.value === null ? "—" : s.value}
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      {s.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

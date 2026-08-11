import { ArrowUpRight, Award } from "lucide-react";
import { certifications } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";

export function Certifications() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="05"
          eyebrow="Certifications"
          title="Proof of the learning."
          highlight="learning"
          description="Certifications from courses and programs I've completed, with verification links."
        />

        {certifications.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <Reveal key={cert.title} delay={i * 0.06}>
                <div className="group flex h-full flex-col rounded-3xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-ink/60 text-accent-bright">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium leading-snug tracking-tight underline-offset-4 transition-colors duration-200 hover:text-accent-bright hover:underline"
                      >
                        {cert.title}
                      </a>
                    ) : (
                      <span className="font-medium leading-snug tracking-tight">{cert.title}</span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {[cert.issuer, cert.year, cert.detail].filter(Boolean).join(" · ")}
                  </p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-accent-bright transition-colors duration-200 hover:text-fg"
                    >
                      Verify credential
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="flex h-full flex-col items-center rounded-3xl border border-dashed border-line-strong p-8 text-center">
                  <Award className="h-6 w-6 text-faint" />
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                    Certification
                  </p>
                  <p className="mt-1 text-sm text-muted">Issuer · Year</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

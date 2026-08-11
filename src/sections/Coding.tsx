import { ArrowUpRight } from "lucide-react";
import { codingIntro, platforms, type Platform } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";
import { BRAND_ICONS } from "../components/icons";

function PlatformCard({ platform, index }: { platform: Platform; index: number }) {
  const Icon = BRAND_ICONS[platform.icon] ?? BRAND_ICONS.github;
  return (
    <Reveal delay={index * 0.06}>
      <div className="group flex h-full flex-col rounded-3xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-ink/60 text-muted transition-colors duration-300 group-hover:text-fg">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-medium tracking-tight">{platform.name}</h3>
            <p className="truncate font-mono text-xs text-faint">{platform.handle || "—"}</p>
          </div>
        </div>

        <div
          className={`mt-5 grid gap-2 border-y border-line py-4 ${platform.stats.length >= 4 ? "grid-cols-4" : "grid-cols-3"}`}
        >
          {platform.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-lg font-semibold tracking-tight">{stat.value}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {platform.url && (
          <a
            href={platform.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-accent-bright transition-colors duration-200 hover:text-fg"
          >
            Visit profile
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </Reveal>
  );
}

export function Coding() {
  return (
    <section id="coding" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Competitive Programming"
          title="Where I keep my edge sharp."
          highlight="edge"
          description={codingIntro}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

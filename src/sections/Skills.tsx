import { Code2, Database, Layers, LayoutDashboard, Rocket, Server, Sparkles, SquareTerminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skills } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  frontend: LayoutDashboard,
  backend: Server,
  database: Database,
  ai: Sparkles,
  tools: SquareTerminal,
  deploy: Rocket,
  concepts: Layers,
};

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Skills"
          title="The stack I reach for, organized."
          highlight="organized"
          description="A snapshot of the technologies I work with across the full stack — from databases to models."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = ICONS[group.icon] ?? Code2;
            return (
              <Reveal key={group.category} delay={i * 0.06}>
                <div className="group h-full rounded-3xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-ink/60 text-accent-bright transition-colors duration-300 group-hover:border-accent/40">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-medium tracking-tight">{group.category}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

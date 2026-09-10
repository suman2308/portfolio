import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { codingIntro, platforms, type Platform } from "../data/portfolio";
import { Container, Reveal, SectionHeading } from "../components/ui";

/** Codeforces ratings move between deploys, so the card re-pulls the official
 *  API in the visitor's browser (Codeforces sends CORS `*`). Falls back
 *  silently to the build-time values when offline or blocked. */
function useCodeforcesLive(handle: string, fallback: Platform["stats"]): Platform["stats"] {
  const [stats, setStats] = useState(fallback);
  useEffect(() => {
    if (!handle) return;
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    fetch(`https://codeforces.com/api/user.info?handles=${handle}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => {
        const u = j?.result?.[0];
        if (cancelled || j?.status !== "OK" || typeof u?.rating !== "number") return;
        const rank = String(u.rank ?? "")
          .replace(/^\w/, (c) => c.toUpperCase())
          .replace(/\s\w/g, (c) => c.toUpperCase());
        setStats([
          { label: "Rating", value: String(u.rating) },
          { label: "Max", value: String(u.maxRating ?? u.rating) },
          { label: "Rank", value: rank || fallback.find((s) => s.label === "Rank")?.value || "—" },
        ]);
      })
      .catch(() => {
        /* unreachable — build-time values are already rendered */
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);
  return stats;
}
import { BRAND_ICONS } from "../components/icons";
import { Character } from "../components/character/Character";

function TerminalScene() {
  return (
    <Reveal delay={0.12}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <Character pose="laptop" className="w-24 shrink-0 sm:w-28" />
        <div className="w-full min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)]">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-line/60 bg-ink/40 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
            <span className="ml-3 font-mono text-[10px] tracking-[0.15em] text-faint">solve.py</span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[11px] leading-[1.9]">
            <code>
              <span className="text-faint"># keeping the edge sharp</span>
              {"\n"}
              <span className="text-accent-bright">def</span> <span className="text-fg">sharpen</span>():
              {"\n"}
              {"    "}
              <span className="text-accent-bright">for</span> p <span className="text-accent-bright">in</span> (
              <span className="text-fg">codeforces</span>, <span className="text-fg">codechef</span>, <span className="text-fg">leetcode</span>):
              {"\n"}
              {"        "}platform.practice(problem=<span className="text-fg">"daily"</span>)
              {"\n"}
              {"    "}rating, rank = grind()
              {"\n"}
              {"    "}
              <span className="text-accent-bright">return</span> rating + <span className="text-fg">" · "</span> + rank
              {"\n"}
              {"\n"}
              <span className="text-faint"># 600+ solved — and counting</span>
              {"\n"}
              <span className="text-faint"># ratings pulled live — never stale</span>
              <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-accent" aria-hidden="true" />
            </code>
          </pre>
        </div>
      </div>
    </Reveal>
  );
}

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
  const cf = platforms.find((p) => p.icon === "codeforces");
  const cfStats = useCodeforcesLive(cf?.handle ?? "", cf?.stats ?? []);
  const livePlatforms = platforms.map((p) =>
    p.icon === "codeforces" ? { ...p, stats: cfStats } : p
  );
  return (
    <section id="coding" className="relative py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_460px]">
          <SectionHeading
            index="04"
            eyebrow="Competitive Programming"
            title="Where I keep my edge sharp."
            highlight="edge"
            description={codingIntro}
            note="real numbers — live from Codeforces, refreshed at every build"
          />
          <TerminalScene />
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {livePlatforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

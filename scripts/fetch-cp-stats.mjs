// ═══════════════════════════════════════════════════════════════════════════
//  fetch-cp-stats.mjs — refresh competitive-programming stats at build time.
//
//  Runs automatically before `npm run build` (npm's `prebuild` hook) and
//  writes src/data/cp-live.ts, which the site imports for the Coding section.
//  The stats can never drift: every build re-pulls them from the live sources.
//
//    codeforces — official JSON API (rating, max rating, rank)
//    leetcode   — public GraphQL profile (solved counts by difficulty)
//    codechef   — no public API; best-effort scrape of the profile page
//
//  Every platform is fetched independently and falls back to the existing
//  generated values (or the embedded defaults on first run) if its source is
//  unreachable — a failed fetch never breaks the build.
// ═══════════════════════════════════════════════════════════════════════════
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src", "data", "cp-live.ts");
const TIMEOUT_MS = 10_000;

const HANDLES = {
  codeforces: "sumanjash",
  codechef: "suman23082005",
  leetcode: "eHMLu7Dusc",
};

// Fallback values (current as of the last verified pull). Only used when a
// live source is unreachable AND no generated file exists yet.
const DEFAULTS = {
  codeforces: [
    { label: "Rating", value: "1327" },
    { label: "Max", value: "1327" },
    { label: "Rank", value: "Pupil" },
  ],
  codechef: [
    { label: "Rating", value: "1628" },
    { label: "Max", value: "1628" },
    { label: "Rank", value: "3★" },
  ],
  leetcode: [
    { label: "Solved", value: "45" },
    { label: "Easy", value: "18" },
    { label: "Medium", value: "23" },
    { label: "Hard", value: "4" },
  ],
};

/** Read the currently generated stats (kept when a live source is down).
 *  The generated object literal is pure JSON (written by JSON.stringify),
 *  so it can be parsed without eval. */
function readExisting() {
  if (!existsSync(outFile)) return null;
  try {
    const src = readFileSync(outFile, "utf8");
    const m = src.match(/=\s*(\{[\s\S]*\n\});\s*$/);
    if (m) return JSON.parse(m[1]);
  } catch {
    /* corrupted/missing — fall through to defaults */
  }
  return null;
}

async function fetchJson(url, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCodeforces(existing) {
  try {
    const j = await fetchJson(
      `https://codeforces.com/api/user.info?handles=${HANDLES.codeforces}`
    );
    if (j.status !== "OK" || !j.result?.length) throw new Error("unexpected payload");
    const u = j.result[0];
    if (typeof u.rating !== "number") throw new Error("no rating");
    const rank = (u.rank || "")
      .replace(/^\w/, (c) => c.toUpperCase()) // "pupil" → "Pupil"
      .replace(/\s\w/g, (c) => c.toUpperCase()); // "international master" → "International Master"
    return [
      { label: "Rating", value: String(u.rating) },
      { label: "Max", value: String(u.maxRating ?? u.rating) },
      { label: "Rank", value: rank },
    ];
  } catch (e) {
    console.warn(`  codeforces: fetch failed (${e.message}) — keeping current values`);
    return existing?.codeforces ?? DEFAULTS.codeforces;
  }
}

async function fetchLeetcode(existing) {
  try {
    const j = await fetchJson("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/u/${HANDLES.leetcode}/`,
      },
      body: JSON.stringify({
        query: `query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats { acSubmissionNum { difficulty count } }
          }
        }`,
        variables: { username: HANDLES.leetcode },
      }),
    });
    const arr = j?.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!Array.isArray(arr)) throw new Error("unexpected payload");
    const get = (d) =>
      String(arr.find((x) => x.difficulty === d)?.count ?? "-");
    return [
      { label: "Solved", value: get("All") },
      { label: "Easy", value: get("Easy") },
      { label: "Medium", value: get("Medium") },
      { label: "Hard", value: get("Hard") },
    ];
  } catch (e) {
    console.warn(`  leetcode: fetch failed (${e.message}) — keeping current values`);
    return existing?.leetcode ?? DEFAULTS.leetcode;
  }
}

/** Best-effort scrape of the CodeChef profile page (no public API exists). */
async function fetchCodechef(existing) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    let html;
    try {
      const res = await fetch(`https://www.codechef.com/users/${HANDLES.codechef}`, {
        signal: ctrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } finally {
      clearTimeout(timer);
    }

    // the profile shows current + maximum ratings as .rating-number elements
    const ratings = [...html.matchAll(/class="rating-number"[^>]*>\s*([^<]+)\s*</g)].map(
      (m) => m[1].trim().replace(/[^\d-]/g, "")
    );
    const current = ratings[0] && !isNaN(+ratings[0]) ? ratings[0] : null;
    const max = ratings[1] && !isNaN(+ratings[1]) ? ratings[1] : current;

    // star rank: scrape "N Star" text if present, else derive from the rating
    const starMatch = html.match(/(\d)\s*Star\b/i);
    let star = starMatch ? starMatch[1] : null;
    if (!star && current) {
      const r = +current;
      star = String(r >= 2500 ? 7 : r >= 2200 ? 6 : r >= 2000 ? 5 : r >= 1800 ? 4 : r >= 1600 ? 3 : r >= 1400 ? 2 : 1);
    }
    if (!current) throw new Error("rating not found in page");

    return [
      { label: "Rating", value: current },
      { label: "Max", value: max ?? current },
      { label: "Rank", value: star ? `${star}★` : existing?.codechef?.[2]?.value ?? "—" },
    ];
  } catch (e) {
    console.warn(`  codechef: fetch failed (${e.message}) — keeping current values`);
    return existing?.codechef ?? DEFAULTS.codechef;
  }
}

const header = `// ═══════════════════════════════════════════════════════════════════════════
//  AUTO-GENERATED by scripts/fetch-cp-stats.mjs — do not edit by hand.
//  Regenerated automatically on every \`npm run build\`.
// ═══════════════════════════════════════════════════════════════════════════
`;

async function main() {
  const existing = readExisting();
  console.log("[cp-stats] fetching live competitive-programming stats…");
  const codeforces = await fetchCodeforces(existing);
  const codechef = await fetchCodechef(existing);
  const leetcode = await fetchLeetcode(existing);

  const stats = { codeforces, codechef, leetcode };
  writeFileSync(
    outFile,
    header +
      `export const cpLive: Record<string, { label: string; value: string }[]> = ${JSON.stringify(
        stats,
        null,
        2
      )};\n`,
    "utf8"
  );

  for (const key of ["codeforces", "codechef", "leetcode"]) {
    console.log(
      `  ${key}: ${stats[key].map((s) => `${s.label}=${s.value}`).join(" · ")}`
    );
  }
  console.log(`[cp-stats] wrote ${outFile.replace(root, ".")}`);
}

main().catch((e) => {
  // never fail the build because stats couldn't refresh
  console.warn("[cp-stats] skipped:", e.message);
});

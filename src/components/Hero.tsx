import { Suspense, lazy, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { heroChips, heroMarquee, profile } from "../data/portfolio";
import { EASE } from "../lib/anim";
import { CharacterHead } from "./character/Character";
import { Marquee } from "./Marquee";
import { LightFall } from "./effects/LightFall";
import { SplitText } from "./effects/SplitText";

// three.js is heavy — load it only when the hero needs it, split into its own chunk.
const Lanyard = lazy(() => import("./effects/Lanyard").then((m) => ({ default: m.Lanyard })));

const SIDE_LEFT = ["Full-Stack", "Backend", "AI / ML"];
const SIDE_RIGHT = ["DSA", "Problem Solving", "Clean Code"];

// Hero positioning line — the part after " — " renders in the serif accent.
const [tagBefore, tagAfter] = profile.tagline.split(" — ");

const item = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const tagline = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.55 } },
};

function LanyardFallback() {
  return (
    <div className="flex h-full w-full items-end justify-center pb-[2%]">
      <div className="grid aspect-[3/4] h-[45%] place-items-center rounded-[1.75rem] border border-line bg-panel">
        <span className="font-serif text-5xl italic text-accent-bright sm:text-6xl">{profile.initials}</span>
      </div>
    </div>
  );
}

function SideWords({
  side,
  words,
  style,
}: {
  side: "left" | "right";
  words: string[];
  style?: MotionStyle;
}) {
  return (
    <motion.div
      style={style}
      className={`pointer-events-none absolute top-1/2 z-[3] hidden -translate-y-1/2 xl:block ${
        side === "left" ? "left-7 xl:left-12" : "right-7 xl:right-12"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-4 [writing-mode:vertical-rl] ${
          side === "left" ? "rotate-180" : ""
        }`}
      >
        <span className="h-10 w-px bg-line-strong" />
        {words.map((w, i) => (
          <span
            key={w}
            className="word-cycle font-mono text-[11px] uppercase tracking-[0.4em] text-muted"
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            {w}
          </span>
        ))}
        <span className="h-10 w-px bg-line-strong" />
      </div>
    </motion.div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const typeY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  // the lanyard card intentionally has NO scroll parallax — the 3D canvas is
  // GPU-heavy, so any per-frame scroll transform makes it visibly stutter.
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sideOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const sideY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  // Mouse parallax (disabled for reduced motion and touch devices).
  const mx = useSpring(useMotionValue(0), { stiffness: 55, damping: 18, mass: 0.6 });
  const my = useSpring(useMotionValue(0), { stiffness: 55, damping: 18, mass: 0.6 });
  const spotX = useTransform(mx, (v) => v * -2.6);
  const spotY = useTransform(my, (v) => v * -2.6);

  useEffect(() => {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      mx.set((e.clientX / w - 0.5) * 22);
      my.set((e.clientY / h - 0.5) * 22);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  const scrollToConnect = () => {
    document
      .getElementById("connect")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="home" ref={sectionRef} className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* lightfall background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <LightFall
          colors={["#ffab5e", "#ff7a1a", "#ffd9a8", "#ff8c3b"]}
          speed={0.5}
          density={0.07}
          streakLength={0.3}
          glow={12}
          twinkle={0.5}
          zoom={0.85}
          backgroundGlow={0.4}
          opacity={0.5}
          mouseStrength={0.4}
          mouseRadius={0.4}
        />
      </div>

      {/* background layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_38%,black,transparent)]" />
        <motion.div
          style={{ opacity: reduce ? 1 : glowOpacity }}
          className="absolute left-1/2 top-[36%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[140px]"
        />
        <motion.div
          style={{ x: reduce ? 0 : spotX, y: reduce ? 0 : spotY }}
          className="absolute left-1/2 top-[36%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/[0.03] blur-[140px]"
        />
      </div>

      {/* eyebrow — centered at the top of the page */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-5 sm:mt-28 sm:px-8"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
            {profile.roles.join(" · ")}
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-faint sm:block">
            Portfolio — {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>

      {/* stage — giant name. Below lg the card hangs from the top and the
          name sits BELOW it (photo above, name below). On lg+ the name
          becomes the left column beside the card. */}
      <div className="z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 sm:px-8 lg:relative">
        <motion.div
          style={reduce ? undefined : { y: typeY, opacity: typeOpacity }}
          className="absolute inset-x-0 top-[calc(min(52dvh,125vw)+1.5rem)] z-10 flex w-full flex-col items-center justify-center px-5 pt-2 text-center sm:px-8 lg:left-10 lg:top-1/2 lg:w-auto lg:px-0 lg:pt-0 lg:-translate-y-1/2 lg:right-[calc(5%+380px+2.5rem)] xl:left-12 xl:right-[calc(5%+400px+2.5rem)]"
        >
            <h1 aria-label={profile.name} className="select-none text-center leading-[0.86] tracking-[-0.04em]">
              <span className="text-stroke block text-[clamp(3.2rem,13.5vw,9.5rem)] font-bold lg:text-[clamp(3rem,11vw,8.5rem)]">
                <SplitText
                  text={profile.firstName.toUpperCase()}
                  delay={0.15}
                  stagger={0.05}
                  duration={0.95}
                  from={{ opacity: 0, y: 60, filter: "blur(6px)" }}
                />
              </span>
              <span className="block text-[clamp(3.2rem,13.5vw,9.5rem)] font-bold text-fg lg:text-[clamp(3rem,11vw,8.5rem)]">
                <SplitText
                  text={profile.lastName.toUpperCase()}
                  delay={0.34}
                  stagger={0.05}
                  duration={0.95}
                  from={{ opacity: 0, y: 60, filter: "blur(6px)" }}
                />
                <motion.em
                  aria-hidden="true"
                  className="font-serif font-normal italic text-accent-bright"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
                >
                  .
                </motion.em>
              </span>
              {/* positioning line — what Suman actually builds */}
              <motion.p
                variants={tagline}
                initial="hidden"
                animate="visible"
                className="mx-auto mt-9 hidden max-w-2xl text-balance lg:block"
              >
                {tagAfter ? (
                  <span className="text-[15px] leading-relaxed text-muted">
                    {tagBefore}
                    <span aria-hidden="true" className="text-line-strong">{" — "}</span>
                    <span className="font-serif text-xl italic text-accent-bright">{tagAfter}</span>
                  </span>
                ) : (
                  <span className="text-[15px] leading-relaxed text-muted">{profile.tagline}</span>
                )}
              </motion.p>
            </h1>

            {/* mobile CTAs — an immediate, always-visible action on small screens */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={scrollToConnect}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-[0_10px_30px_-10px_rgba(255,122,26,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-bright"
              >
                Let&rsquo;s talk
              </button>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/85 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fg backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ok" aria-hidden="true" />
                Open to work
              </span>
            </div>
        </motion.div>
      </div>

      {/* the lanyard — the band hangs from the very top of the hero down to the
          card. z-20 keeps the card ABOVE the name on mobile (name is behind). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-20 lg:inset-x-auto lg:right-[5%] lg:w-[380px] xl:w-[400px]">
        <motion.div
          style={{ x: reduce ? 0 : mx, y: reduce ? 0 : my }}
          className="relative mx-auto h-full w-[min(76vw,300px)] lg:mx-0 lg:w-full"
        >
          {/* the card zone: on mobile the lanyard hangs in the upper part of the
              screen so the photo comes over (above) the name, not under it */}
          <div className="relative h-[min(52dvh,125vw)] lg:h-[min(calc(100%-5.5rem),138vw)]">
            {/* warm glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-10 bottom-0 top-[42%] -z-10 rounded-full bg-accent/15 blur-3xl"
            />
            <Suspense fallback={<LanyardFallback />}>
              <Lanyard frontImage={profile.characterImage || profile.heroImage} className="h-full w-full" />
            </Suspense>

            {/* the operator — a character peek beside the card */}
            <span aria-hidden="true" className="absolute -right-4 top-[16%] z-10 hidden sm:block lg:-right-6">
              <span className="absolute -top-5 right-2 rotate-[-6deg] font-serif text-base italic text-accent-bright">
                hey!
              </span>
              <CharacterHead className="w-20 lg:w-24" />
            </span>

            {/* open-to-work pill */}
            <span className="pointer-events-auto absolute right-[-0.5rem] top-[47%] hidden items-center gap-2 rounded-full border border-line bg-panel/85 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg backdrop-blur-md lg:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ok" aria-hidden="true" />
              Open to work
            </span>

            {/* contact CTA */}
            <button
              type="button"
              onClick={scrollToConnect}
              className="pointer-events-auto absolute bottom-[3%] left-[-0.5rem] hidden items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-[0_10px_30px_-10px_rgba(255,122,26,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-bright lg:inline-flex"
            >
              Let&rsquo;s talk
            </button>

            {heroChips.map((chip, i) => (
              <span
                key={chip}
                className={`pointer-events-auto absolute hidden animate-float rounded-full border border-line bg-panel/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm ${
                  i < 2 ? "sm:block" : "lg:block"
                } ${
                  ["top-[58%] -left-3", "top-[70%] -right-3", "top-[81%] -left-4", "top-[91%] -right-4"][i % 4]
                }`}
                style={{ animationDelay: `${i * 1.1}s` }}
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <SideWords
        side="left"
        words={SIDE_LEFT}
        style={reduce ? undefined : { opacity: sideOpacity, y: sideY }}
      />
      <SideWords
        side="right"
        words={SIDE_RIGHT}
        style={reduce ? undefined : { opacity: sideOpacity, y: sideY }}
      />

      {/* scroll cue — sits above the marquee, never overlapping it */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="absolute bottom-24 left-5 z-[3] hidden flex-col items-center gap-2.5 xl:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-full animate-scroll-dot bg-accent" />
        </span>
      </motion.div>

      <Marquee items={heroMarquee} className="border-y border-line py-4 sm:py-5" />
    </section>
  );
}

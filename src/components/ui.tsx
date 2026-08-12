import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "../lib/anim";
import { FoldText } from "./effects/FoldText";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Fade-up reveal on scroll. Honors prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  description,
  center = false,
  delay = 0.1,
  note,
}: {
  index: string;
  eyebrow: string;
  /** Heading text — each character unfolds into place on scroll. */
  title: string;
  /** A single word in `title` to render in the serif-italic accent. */
  highlight?: string;
  description?: ReactNode;
  center?: boolean;
  /** Delay before the title starts folding (seconds). */
  delay?: number;
  /** Small mono annotation on the right — an authored detail on wide screens. */
  note?: string;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em]">
          <span className="text-faint">{index}</span>
          <span className="mx-3 text-line-strong">/</span>
          <span className="text-accent-bright">{eyebrow}</span>
        </p>
      </Reveal>
      <FoldText
        as="h2"
        text={title}
        highlight={highlight}
        trigger="inView"
        delay={delay}
        className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
      />
      {description && (
        <Reveal delay={0.16}>
          <div className="mt-5 max-w-xl leading-relaxed text-muted">{description}</div>
        </Reveal>
      )}
      {note && (
        <Reveal delay={0.2}>
          <p className="mt-6 hidden items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-faint lg:flex">
            <span className="text-accent/70">//</span>
            {note}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg">
      {children}
    </li>
  );
}

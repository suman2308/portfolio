import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE } from "../../lib/anim";

/**
 * FoldText — an original take on the "fold text" idea: instead of rotating
 * whole words around a hinge, each character unfolds like a page from the
 * fold line, carrying a soft crease shadow that fades as it flattens.
 * The optional `highlight` word renders in the serif-italic accent used
 * throughout the design. Falls back to plain text for reduced-motion users.
 */
type FoldTextProps = {
  text: string;
  /** A single word inside `text` to render in the serif accent style. */
  highlight?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  splitBy?: "chars" | "words";
  /** Which edge the fold happens on. */
  hinge?: "top" | "bottom";
  trigger?: "mount" | "inView";
  duration?: number;
  /** Seconds between consecutive units. */
  stagger?: number;
  /** Seconds before the first unit starts. */
  delay?: number;
  /** Perspective distance for the 3D fold (px). */
  perspective?: number;
  /** 0 – 1 · strength of the crease shadow while folded. */
  crease?: number;
  /** Fraction of the element that must be visible to trigger (inView only). */
  threshold?: number;
  ariaLabel?: string;
};

export function FoldText({
  text,
  highlight,
  as = "span",
  className = "",
  splitBy = "chars",
  hinge = "top",
  trigger = "inView",
  duration = 0.7,
  stagger = 0.022,
  delay = 0,
  perspective = 900,
  crease = 0.8,
  threshold = 0.4,
  ariaLabel,
}: FoldTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.span;

  // Characters unfold from the fold line. A 3D rotateX fold extends beyond the
  // line box (its folded state is taller than its resting height), which can
  // paint over the eyebrow above the heading — so instead of rotating, each
  // character scales open from the fold edge. Same unfolding feel, but it
  // stays strictly inside the heading's own box.
  const origin = hinge === "top" ? "50% 0%" : "50% 100%";

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const charVariants: Variants = {
    hidden: { scaleY: 0.08, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration, ease: EASE } },
  };
  const creaseVariants: Variants = {
    hidden: { opacity: crease },
    visible: { opacity: 0, transition: { duration: duration * 1.1, ease: EASE } },
  };

  const words = text.split(" ");
  const creaseGradient =
    hinge === "top"
      ? "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%, rgba(255,255,255,0.10) 60%, rgba(0,0,0,0))"
      : "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%, rgba(255,255,255,0.10) 60%, rgba(0,0,0,0))";

  if (reduce) {
    return (
      <Tag className={className} aria-label={ariaLabel ?? text}>
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            {highlight && word.includes(highlight) ? (
              <em className="font-serif font-normal italic text-accent-bright">{word}</em>
            ) : (
              word
            )}
          </Fragment>
        ))}
      </Tag>
    );
  }

  const renderUnit = (key: string, ch: string, hl: boolean) => (
    <span
      key={key}
      className="relative inline-block will-change-transform"
      style={{ transformOrigin: origin, transformStyle: "preserve-3d" }}
    >
      <motion.span
        variants={charVariants}
        className={`inline-block will-change-transform ${hl ? "font-serif italic text-accent-bright" : ""}`}
        style={{ transformOrigin: origin }}
      >
        {ch}
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={creaseVariants}
        className="pointer-events-none absolute inset-0"
        style={{ background: creaseGradient }}
      />
    </span>
  );

  return (
    <Tag
      className={className}
      aria-label={ariaLabel ?? text}
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: threshold } })}
      variants={container}
      style={{ perspective }}
    >
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            {splitBy === "words" ? (
              renderUnit(`w-${wi}`, word, Boolean(highlight && word.includes(highlight)))
            ) : (
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((ch, ci) =>
                  renderUnit(`w${wi}c${ci}`, ch, Boolean(highlight && word.includes(highlight)))
                )}
              </span>
            )}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

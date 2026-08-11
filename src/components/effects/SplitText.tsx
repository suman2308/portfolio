import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE } from "../../lib/anim";

/**
 * SplitText — an original take on the "split text" idea. The string is split
 * into characters (or whole words) that rise, de-blur and settle into place
 * with a left-to-right stagger. Runs on mount or when scrolled into view.
 * Falls back to plain text for reduced-motion users.
 */
type SplitTextProps = {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  /** Seconds before the first unit starts. */
  delay?: number;
  /** Seconds between consecutive units. */
  stagger?: number;
  duration?: number;
  /** Starting state for each unit. `opacity`/`y` by default. */
  from?: { opacity?: number; y?: number; rotateX?: number; scale?: number; filter?: string };
  splitBy?: "chars" | "words";
  trigger?: "mount" | "inView";
  /** Fraction of the element that must be visible to trigger (inView only). */
  threshold?: number;
  ariaLabel?: string;
};

export function SplitText({
  text,
  as = "span",
  className = "",
  delay = 0,
  stagger = 0.045,
  duration = 0.9,
  from,
  splitBy = "chars",
  trigger = "mount",
  threshold = 0.3,
  ariaLabel,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.span;

  const base = { opacity: 0, y: 44, ...from };
  const to: Record<string, number | string> = { opacity: 1, y: 0 };
  if (base.filter !== undefined) to.filter = "blur(0px)";
  if (base.rotateX !== undefined) to.rotateX = 0;
  if (base.scale !== undefined) to.scale = 1;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const unit: Variants = {
    hidden: base,
    visible: { ...to, transition: { duration, ease: EASE } },
  };

  const words = text.split(" ");

  if (reduce) {
    return (
      <Tag className={className} aria-label={ariaLabel ?? text}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      aria-label={ariaLabel ?? text}
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: threshold } })}
      variants={container}
    >
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            {splitBy === "words" ? (
              <motion.span variants={unit} className="inline-block will-change-transform">
                {word}
              </motion.span>
            ) : (
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((ch, ci) => (
                  <motion.span key={`${wi}-${ci}`} variants={unit} className="inline-block will-change-transform">
                    {ch}
                  </motion.span>
                ))}
              </span>
            )}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

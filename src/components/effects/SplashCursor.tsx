import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * SplashCursor — an original take on the "splash cursor" idea: instead of a
 * fluid simulation, the pointer throws a short-lived trail of soft ember
 * blobs that bloom, drift and dissolve. Subtle, warm and GPU-cheap —
 * disabled entirely on touch devices and for reduced-motion users.
 */
type SplashCursorProps = {
  /** Warm hue range (degrees) the splashes cycle through, e.g. ember→gold. */
  hueRange?: [number, number];
  /** Saturation of the splash colors. */
  saturation?: number;
  /** Secondary color for the occasional bright spark. */
  accent?: string;
  /** 0 – 1 · radius of each splash, relative to viewport height. */
  radius?: number;
  /** 0 – 1 · how much momentum the pointer imparts to each splash. */
  force?: number;
  /** 0 – 1 · how quickly splashes fade (1 = shortest life). */
  dissipation?: number;
  /** 0 – 1 · overall alpha of the trail. */
  opacity?: number;
  /** Splashes spawned per 60px of pointer travel. */
  rate?: number;
  className?: string;
};

type Splash = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  age: number;
  life: number;
  color: string;
};

export function SplashCursor({
  hueRange = [12, 46],
  saturation = 92,
  accent = "#ffe9d6",
  radius = 0.5,
  force = 0.55,
  dissipation = 0.92,
  opacity = 0.4,
  rate = 1.4,
  className = "",
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const splashes: Splash[] = [];
    const last = { x: -1, y: -1, t: 0, dist: 0 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, px: number, py: number) => {
      const now = performance.now();
      const dt = Math.max(16, now - last.t);
      const dx = x - px;
      const dy = y - py;
      const travel = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.round((travel / 60) * rate));
      const rBase = Math.max(w, h) * 0.05 * radius;

      const hue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
      const base = `hsl(${hue.toFixed(0)} ${saturation}% 62%)`;
      for (let i = 1; i <= steps; i++) {
        const f = i / steps;
        const sx = px + dx * f;
        const sy = py + dy * f;
        const jitter = (Math.random() - 0.5) * rBase * 0.9;
        splashes.push({
          x: sx + jitter,
          y: sy + jitter * 0.6,
          vx: (dx / dt) * 0.016 * force + (Math.random() - 0.5) * 0.4,
          vy: (dy / dt) * 0.016 * force + (Math.random() - 0.5) * 0.4,
          r: rBase * (0.55 + Math.random() * 0.8),
          age: 0,
          life: 300 + Math.random() * 500 * (1.15 - dissipation),
          // mostly warm hues, with an occasional bright gold spark
          color: Math.random() > 0.82 ? accent : base,
        });
      }
      last.t = now;
    };

    const onMove = (e: PointerEvent) => {
      if (last.x < 0) {
        last.x = e.clientX;
        last.y = e.clientY;
        last.t = performance.now();
        return;
      }
      spawn(e.clientX, e.clientY, last.x, last.y);
      last.x = e.clientX;
      last.y = e.clientY;
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.age += 16;
        if (s.age >= s.life) {
          splashes.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.r *= 0.985;
        s.vx *= 0.98;
        s.vy *= 0.98;

        const p = 1 - s.age / s.life; // 1 → 0
        const a = p * p * opacity;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        g.addColorStop(0, s.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = a;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [accent, dissipation, force, hueRange, opacity, radius, rate, reduce, saturation]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[35] h-full w-full ${className}`}
    />
  );
}

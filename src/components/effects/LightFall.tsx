import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * LightFall — a field of falling light streaks (an original take on the
 * "lightfall" background idea). Streaks drift down with a soft glow trail,
 * a few embers twinkle between them, and the whole field bends subtly
 * around the cursor. Runs on a single canvas with additive blending.
 *
 * Everything is tuned through props; sensible defaults below are the ones
 * the Hero uses, tinted amber to match the palette.
 */
type LightFallProps = {
  /** Palette used by the streaks (cycled). */
  colors?: string[];
  /** Base fall speed multiplier (0.1 – 3). */
  speed?: number;
  /** Streaks per 1000px² of viewport. */
  density?: number;
  /** Horizontal length of each streak, as a fraction of its travel. */
  streakLength?: number;
  /** Glow radius of the streak head, in px. */
  glow?: number;
  /** 0 – 1 · chance of an ember twinkling between streaks. */
  twinkle?: number;
  /** 0 – 1 · vertical spread of the streaks across the canvas. */
  zoom?: number;
  /** 0 – 1 · radial warmth behind the field. */
  backgroundGlow?: number;
  /** 0 – 1 · overall opacity of the effect. */
  opacity?: number;
  /** Bend streaks near the pointer. */
  mouseInteraction?: boolean;
  /** 0 – 1 · how strongly the pointer bends the field. */
  mouseStrength?: number;
  /** 0 – 1 · radius of influence, as a fraction of the viewport width. */
  mouseRadius?: number;
  className?: string;
};

type Streak = {
  x: number;
  y: number;
  len: number;
  speed: number;
  width: number;
  drift: number;
  phase: number;
  color: string;
  alpha: number;
};

type Ember = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
};

export function LightFall({
  colors = ["#ffab5e", "#ff7a1a", "#ffd9a8", "#ff8c3b"],
  speed = 0.5,
  density = 0.06,
  streakLength = 0.28,
  glow = 14,
  twinkle = 0.5,
  zoom = 0.8,
  backgroundGlow = 0.35,
  opacity = 0.55,
  mouseInteraction = true,
  mouseStrength = 0.4,
  mouseRadius = 0.4,
  className = "",
}: LightFallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let streaks: Streak[] = [];
    let embers: Ember[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = (w * h) / 1_000_000; // per megapixel
      const count = Math.round(area * density * 120);
      const spread = h * zoom;
      streaks = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * spread - spread * 0.5,
        len: 0.08 + Math.random() * 0.22,
        speed: (0.5 + Math.random() * 1.7) * speed,
        width: 0.6 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        alpha: 0.12 + Math.random() * 0.5,
      }));
      embers = Array.from({ length: Math.round(count * (twinkle * 0.9)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.6,
      }));
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = false;
    };

    const influence = mouseInteraction && matchMedia("(pointer: fine)").matches;

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = opacity;

      // warm radial wash behind the streaks
      if (backgroundGlow > 0) {
        const gx = mouse.active ? mouse.x : w * 0.5;
        const gy = mouse.active ? mouse.y : h * 0.42;
        const rad = Math.max(w, h) * 0.6;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
        g.addColorStop(0, `rgba(255,122,26,${0.06 * backgroundGlow})`);
        g.addColorStop(0.55, "rgba(255,122,26,0.012)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // twinkling embers
      for (const e of embers) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0012 * e.speed + e.phase);
        if (pulse < 0.25) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,199,130,${pulse * 0.5 * twinkle})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const radius = mouseRadius * w;
      for (const s of streaks) {
        // gentle sway + cursor bend. Falls 25–100 px/s (scaled by `speed`),
        // looping from the bottom back to the top.
        let x = s.x + Math.sin(t * 0.0005 + s.phase) * 14 * s.drift;
        const range = h + s.len * h;
        let y = s.y + ((t / 1000) * 40 * s.speed) % range;
        y -= s.len * h;

        if (influence && mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const r2 = radius * radius;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / radius) * mouseStrength * 60;
            x += (dx / d) * force;
            y += (dy / d) * force;
          }
        }

        const len = Math.max(8, s.len * h * streakLength);
        const grad = ctx.createLinearGradient(0, y, 0, y + len);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = opacity * s.alpha;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + len);
        ctx.stroke();

        // glowing head
        if (glow > 0) {
          const head = ctx.createRadialGradient(x, y, 0, x, y, glow * s.width * 2.2);
          head.addColorStop(0, s.color);
          head.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = opacity * s.alpha * 0.35;
          ctx.fillStyle = head;
          ctx.fillRect(x - glow * s.width * 2.2, y - glow * s.width * 2.2, glow * s.width * 4.4, glow * s.width * 4.4);
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    build();
    if (reduce) {
      // static single frame — honors prefers-reduced-motion
      frame(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [colors, density, glow, mouseInteraction, mouseRadius, mouseStrength, opacity, reduce, speed, streakLength, twinkle, zoom, backgroundGlow]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

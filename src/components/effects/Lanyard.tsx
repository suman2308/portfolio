import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";

/**
 * Lanyard — a 3D ID card hanging from a lanyard band (an original
 * implementation of the "Lanyard" idea, built without any .glb assets).
 *
 * The band hangs from the pivot at the very TOP of the canvas, which the
 * Hero positions at the top of the screen — so the strip visually runs from
 * the top of the page down to the card. The card swings on a damped
 * pendulum in the SCREEN plane (side to side), so the band always reads as
 * a flat strap — it never revolves around the pivot or foreshortens into a
 * rope. On mount it drops down from the pivot; the instant the strap catches
 * it, the pendulum overshoots its rest angle and the strap stretches, so the
 * card bounces a couple of times (with a subtle squash & stretch) before it
 * settles — like a real ID card being dropped. It also leans gently toward
 * the cursor, and the swing amplitude is clamped to the canvas width so the
 * card never leaves the frame.
 *
 * - The band always renders BEHIND the card (its vertices are pushed back
 *   a few hundredths of a unit), so it never covers the photo.
 * - Reduced-motion users get a static, straight card.
 * - The render loop pauses when the section scrolls out of view.
 */
type LanyardProps = {
  /** Kept for API parity with the original snippet — the scene is self-framed. */
  position?: [number, number, number];
  /** Gravity applied to the pendulum, e.g. [0, -40, 0]. Only the y magnitude is used. */
  gravity?: [number, number, number];
  /** Photo for the front face (path under /public, or a URL). */
  frontImage?: string;
  /** Optional custom image for the back face; defaults to a generated branded card. */
  backImage?: string;
  className?: string;
  style?: React.CSSProperties;
};

// ---- scene constants -------------------------------------------------------
// The canvas maps exactly this vertical span: pivot (top edge) → card bottom.
const V = 2.385;
const PIVOT_Y = V / 2; // the neck, sitting on the canvas top edge
const CARD_W = 0.34 * V; // ~0.81
const CARD_H = 0.45 * V; // ~1.07
const CARD_T = 0.035;
const LEN = V - CARD_H / 2; // pivot → card centre (~1.85)
const BAND_SEG = 30;
const BAND_W = 0.04 * V; // slim strap — a real ID lanyard is a thin ribbon
const BAND_DEPTH = 0.05; // band sits this far behind the card plane

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Ribbon geometry for the band — vertices re-shaped every frame. */
function createRibbonGeometry() {
  const positions = new Float32Array((BAND_SEG + 1) * 2 * 3);
  const uvs = new Float32Array((BAND_SEG + 1) * 2 * 2);
  const indices: number[] = [];
  for (let i = 0; i < BAND_SEG; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }
  for (let i = 0; i <= BAND_SEG; i++) {
    uvs[i * 4] = i / BAND_SEG;
    uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = i / BAND_SEG;
    uvs[i * 4 + 3] = 1;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/** Trace a rounded-rectangle path (top-left x,y, size w×h, corner radius r). */
function traceRoundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.lineTo(x + w - rr, y);
  g.arcTo(x + w, y, x + w, y + rr, rr);
  g.lineTo(x + w, y + h - rr);
  g.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  g.lineTo(x + rr, y + h);
  g.arcTo(x, y + h, x, y + h - rr, rr);
  g.lineTo(x, y + rr);
  g.arcTo(x, y, x + rr, y, rr);
  g.closePath();
}

/** Front face: a cream card front with the portrait inset and rounded — like
 *  a real ID-card photo on a card. A black border ring with a thin gold
 *  hairline outside it frames the photo; the corners stay cream, so there are
 *  never dark corner patches. */
function makeCardFrontTexture(img: HTMLImageElement) {
  const W = 1024;
  const H = Math.round(W / (CARD_W / CARD_H)); // same ratio as the card face
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const m = Math.round(W * 0.03); // cream frame width
  const r = W * 0.05; // photo corner radius

  // cream card front — the corners are cream, never black
  g.fillStyle = "#f5eddf";
  g.fillRect(0, 0, W, H);

  // the portrait, inset inside the frame and clipped to rounded corners
  g.save();
  traceRoundRect(g, m, m, W - 2 * m, H - 2 * m, r);
  g.clip();
  g.drawImage(img, m, m, W - 2 * m, H - 2 * m);
  g.restore();

  // black border ring around the photo
  g.strokeStyle = "#000000";
  g.lineWidth = Math.max(4, Math.round(W * 0.014));
  traceRoundRect(g, m, m, W - 2 * m, H - 2 * m, r);
  g.stroke();

  // thin gold hairline just outside the black ring — the stylish accent
  g.strokeStyle = "#d4af37";
  g.lineWidth = 3;
  traceRoundRect(g, m + 12, m + 12, W - 2 * m - 24, H - 2 * m - 24, r + 10);
  g.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Branded back face — drawn to a canvas so no external image is needed. */
function makeBackTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 700;
  const g = c.getContext("2d")!;
  g.fillStyle = "#150e08";
  g.fillRect(0, 0, 512, 700);
  g.strokeStyle = "#ff7a1a";
  g.lineWidth = 4;
  g.strokeRect(14, 14, 484, 672);
  g.strokeStyle = "rgba(255,171,94,0.22)";
  g.lineWidth = 1;
  g.strokeRect(26, 26, 460, 648);
  g.fillStyle = "#b4a48f";
  g.font = "600 19px Arial, sans-serif";
  g.textAlign = "center";
  g.fillText("NARULA INSTITUTE OF TECHNOLOGY", 256, 62);
  g.fillStyle = "#ffab5e";
  g.font = "italic 150px Georgia, serif";
  g.fillText("SJ", 256, 236);
  g.fillStyle = "#f5eddf";
  g.font = "700 44px Arial, sans-serif";
  g.fillText("SUMAN JASH", 256, 302);
  g.fillStyle = "#ff7a1a";
  g.font = "600 28px Arial, sans-serif";
  g.fillText("SOFTWARE ENGINEER", 256, 350);
  g.fillStyle = "#b4a48f";
  g.font = "500 23px Arial, sans-serif";
  g.fillText("FULL-STACK · AI / ML", 256, 386);
  g.strokeStyle = "rgba(255,171,94,0.3)";
  g.beginPath();
  g.moveTo(120, 428);
  g.lineTo(392, 428);
  g.stroke();
  g.fillStyle = "#34d399";
  g.beginPath();
  g.arc(206, 474, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f5eddf";
  g.font = "600 25px Arial, sans-serif";
  g.fillText("OPEN TO WORK", 256, 482);
  let x = 150;
  g.fillStyle = "#c9b89e";
  for (let i = 0; i < 26; i++) {
    const bw = 3 + Math.round(Math.random() * 5);
    g.fillRect(x, 518, bw, 46);
    x += bw + 4;
  }
  g.fillStyle = "#75664f";
  g.font = "500 19px 'Courier New', monospace";
  g.fillText("ID · SJ-2308 · EST 2025", 256, 606);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Striped lanyard band texture — drawn to a canvas, repeats along the band. */
function makeBandTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 32;
  const g = c.getContext("2d")!;
  g.fillStyle = "#241811";
  g.fillRect(0, 0, 128, 32);
  g.strokeStyle = "rgba(255,122,26,0.75)";
  g.lineWidth = 6;
  for (let i = -1; i < 5; i++) {
    g.beginPath();
    g.moveTo(i * 32, 32);
    g.lineTo(i * 32 + 32, 0);
    g.stroke();
  }
  g.strokeStyle = "rgba(255,171,94,0.55)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(0, 2);
  g.lineTo(128, 2);
  g.moveTo(0, 30);
  g.lineTo(128, 30);
  g.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = 3;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---- scene rig -------------------------------------------------------------

function LanyardRig({
  gravity,
  frontImage,
  backImage,
  staticMode,
}: {
  gravity: [number, number, number];
  frontImage: string;
  backImage?: string;
  staticMode: boolean;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const bandRef = useRef<THREE.Mesh>(null);
  // start tilted to one side with a push so the drop turns into a natural swing.
  // stretch/sv drive the strap's elastic bounce after the card lands.
  const state = useRef({
    phi: staticMode ? 0 : 0.25,
    omega: staticMode ? 0 : 1.5,
    elapsed: 0,
    stretch: 0,
    sv: 0,
    kicked: false,
  });
  const mouse = useRef({ x: 0 });
  const { size } = useThree();

  const boxGeo = useMemo(() => new THREE.BoxGeometry(CARD_W, CARD_H, CARD_T), []);
  const ribbonGeo = useMemo(() => createRibbonGeometry(), []);

  // photo for the front face — preprocessed into a rounded, bordered card
  const [photo, setPhoto] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      setPhoto(makeCardFrontTexture(img));
    };
    img.src = frontImage;
    return () => {
      alive = false;
    };
  }, [frontImage]);

  const frontMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5, metalness: 0.08 }),
    []
  );
  useEffect(() => {
    if (photo) {
      frontMat.map = photo;
      frontMat.needsUpdate = true;
    }
  }, [photo, frontMat]);

  const edgeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#241811", roughness: 0.55, metalness: 0.15 }),
    []
  );

  // back face: custom image if given, else the generated branded card
  const [backPhoto, setBackPhoto] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!backImage) return;
    let alive = true;
    new THREE.TextureLoader().load(backImage, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      if (alive) setBackPhoto(tex);
    });
    return () => {
      alive = false;
    };
  }, [backImage]);

  const backTex = useMemo(() => (backImage ? null : makeBackTexture()), [backImage]);
  const backMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.45, metalness: 0.06 }),
    []
  );
  useEffect(() => {
    const map = backImage ? backPhoto : backTex;
    if (map) {
      backMat.map = map;
      backMat.needsUpdate = true;
    }
  }, [backImage, backPhoto, backTex, backMat]);

  const bandTex = useMemo(() => makeBandTexture(), []);
  const bandMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bandTex,
        roughness: 0.75,
        metalness: 0.08,
        side: THREE.DoubleSide,
        emissive: new THREE.Color("#7a3d10"),
        emissiveIntensity: 0.5,
      }),
    [bandTex]
  );

  // cursor influence: the pendulum's rest angle leans toward the pointer
  useEffect(() => {
    if (staticMode) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [staticMode]);

  /** Shape the band as a 3D bezier from the pivot down to the card top.
   *  The swing happens in the screen plane (X/Y), so the strap's width is
   *  its in-plane perpendicular — it always reads as a flat ribbon facing
   *  the camera, never as a thin rope. `stretch` is the elastic strap
   *  bounce: when the card is pulled down the band goes taut (less sag),
   *  when it rebounds the band slackens (more sag). */
  const updateRibbon = (phi: number, len: number, stretch = 0) => {
    const mesh = bandRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    // the card hangs straight below its centre (slight lean adds life)
    const rotZ = phi * 0.15;
    const cX = Math.sin(phi) * len;
    const cY = PIVOT_Y - Math.cos(phi) * len;
    const cardTopX = cX - Math.sin(rotZ) * (CARD_H / 2);
    const cardTopY = cY + Math.cos(rotZ) * (CARD_H / 2);

    const p0 = { x: 0, y: PIVOT_Y, z: 0 };
    const p2 = { x: cardTopX, y: cardTopY, z: 0 };
    // taut when the strap is stretched by the bounce, slack on the rebound
    const sag = Math.max(0.02, 0.07 + Math.abs(phi) * 0.08 - stretch * 0.35);
    const p1 = {
      x: (p0.x + p2.x) / 2,
      y: (p0.y + p2.y) / 2 - sag,
      z: 0,
    };

    const pts: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i <= BAND_SEG; i++) {
      const t = i / BAND_SEG;
      const mt = 1 - t;
      pts.push({
        x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
        y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
        z: mt * mt * p0.z + 2 * mt * t * p1.z + t * t * p2.z,
      });
    }

    const half = BAND_W / 2;
    for (let i = 0; i <= BAND_SEG; i++) {
      const prev = pts[Math.max(0, i - 1)];
      const next = pts[Math.min(BAND_SEG, i + 1)];
      let dx = next.x - prev.x;
      let dy = next.y - prev.y;
      let dz = next.z - prev.z;
      const lenT = Math.hypot(dx, dy, dz) || 1;
      dx /= lenT;
      dy /= lenT;
      dz /= lenT;
      // in-plane perpendicular: the strap's width stays horizontal on screen
      let px = -dy;
      let py = dx;
      let pz = 0;
      const pl = Math.hypot(px, py, pz) || 1;
      px /= pl;
      py /= pl;
      arr[i * 6] = pts[i].x + px * half;
      arr[i * 6 + 1] = pts[i].y + py * half;
      arr[i * 6 + 2] = pts[i].z - BAND_DEPTH;
      arr[i * 6 + 3] = pts[i].x - px * half;
      arr[i * 6 + 4] = pts[i].y - py * half;
      arr[i * 6 + 5] = pts[i].z - BAND_DEPTH;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  };

  useFrame((_, delta) => {
    if (staticMode) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;
    s.elapsed += dt;
    const t = s.elapsed;

    // drop-in: the card falls from the pivot over ~1.4s
    const drop = easeOutCubic(clamp(t / 1.4, 0, 1));

    // landing kick — the instant the strap catches the card, the pendulum
    // overshoots its rest angle (fresh push in the direction it's already
    // swinging) and the strap stretches, so the card bounces a few times
    // before settling.
    if (!s.kicked && drop >= 0.97) {
      s.kicked = true;
      s.omega += (Math.sign(s.omega) || 1) * 1.2; // pendulum overshoot
      s.sv = 0.5; // strap stretch impulse
    }

    // strap spring: elastic stretch that damps out — a subtle vertical bounce
    if (s.kicked) {
      s.sv += (-90 * s.stretch - 4.5 * s.sv) * dt;
      s.stretch += s.sv * dt;
    }

    const len = LEN * Math.max(drop, 0.001) * (1 + s.stretch);

    // pendulum in the SCREEN plane — the card swings side to side, staying
    // vertical, so the band always shows as a proper flat strap
    const g = Math.abs(gravity[1]) || 40;
    const damp = t < 2.4 ? 1.1 : 2.1;
    // rest angle: leans toward the cursor, plus a faint idle drift
    const target = clamp(mouse.current.x * 0.22, -0.3, 0.3) + Math.sin(t * 0.6) * 0.02;
    let alpha = 0;
    if (drop > 0.01) {
      alpha = -(g / len) * Math.sin(s.phi - target) - damp * s.omega;
    }
    s.omega += clamp(alpha, -40, 40) * dt;
    s.phi += s.omega * dt;
    s.omega *= 1 - Math.min(1, dt * 0.5);

    // keep the card inside the canvas: clamp the angle to the available width
    const maxSwingX = Math.max(0.1, ((size.width / size.height) * V) / 2 - CARD_W / 2);
    const phiMax = Math.min(0.4, Math.asin(Math.min(1, maxSwingX / Math.max(len, 0.3))));
    s.phi = clamp(s.phi, -phiMax, phiMax);

    const x = Math.sin(s.phi) * len;
    const y = PIVOT_Y - Math.cos(s.phi) * len;
    if (cardRef.current) {
      cardRef.current.position.set(x, y, 0);
      // subtle squash & stretch on the bounce — flattens as the strap
      // stretches, elongates on the rebound
      cardRef.current.scale.set(1 + s.stretch * 0.25, 1 - s.stretch * 0.5, 1);
      cardRef.current.rotation.set(0, 0, s.phi * 0.15);
    }
    updateRibbon(s.phi, len, s.stretch);
  });

  // one initial ribbon shape for static/reduced-motion users
  useEffect(() => {
    updateRibbon(0, LEN);
  }, []);

  return (
    <>
      <ambientLight intensity={0.95} color="#ffe8d1" />
      <directionalLight position={[2.5, 4, 5]} intensity={1.7} color="#fff6ea" />
      <directionalLight position={[-3, 0.5, -2]} intensity={0.5} color="#ff8a3d" />
      <pointLight position={[0, 2.6, 3.5]} intensity={5} color="#ffb066" distance={8} />

      {/* the band — culling must stay off: its shape is rebuilt every frame */}
      <mesh ref={bandRef} geometry={ribbonGeo} material={bandMat} frustumCulled={false} />

      {/* the card */}
      <group ref={cardRef} position={[0, PIVOT_Y - LEN, 0]}>
        <mesh geometry={boxGeo} material={[edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]} />
        {/* keyring clip */}
        <mesh position={[0, CARD_H / 2, 0]}>
          <torusGeometry args={[0.04, 0.011, 8, 24]} />
          <meshStandardMaterial color="#c8a46a" roughness={0.3} metalness={0.85} />
        </mesh>
      </group>
    </>
  );
}

export function Lanyard({
  gravity = [0, -40, 0],
  frontImage = "/images/hero.jpg",
  backImage,
  className = "",
  style,
}: LanyardProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, V / (2 * Math.tan((44 * Math.PI) / 360))], fov: 44 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        frameloop={reduce || !inView ? "never" : "always"}
        className="pointer-events-none"
      >
        <LanyardRig gravity={gravity} frontImage={frontImage} backImage={backImage} staticMode={Boolean(reduce)} />
      </Canvas>
    </div>
  );
}

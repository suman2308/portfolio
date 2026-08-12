import { useReducedMotion } from "motion/react";

/**
 * The Suman Jash character — the approved base design.
 *
 * The face is the identity: a smart, young, cool version of Suman in black
 * wayfarer sunglasses, with a styled haircut that frames the face, a youthful
 * angular jaw, a relaxed confident mouth, a light-blue shirt and an
 * understated ID card on a lanyard.
 *
 * The face is pixel-identical in every appearance — only the pose changes:
 *   - "relaxed"  (About)      arms crossed
 *   - "laptop"   (Coding)     focused, holding a terminal laptop
 *   - "wave"     (Connect)    natural farewell
 *   - CharacterHead            hero peek, project stamps, skills cameo
 *
 * Purely decorative — render inside aria-hidden wrappers.
 */

export type CharacterPose = "relaxed" | "laptop" | "wave";

const PAL = {
  outline: "#23262b",
  hair: "#16181d",
  hairHi: "#3a424d",
  hairHi2: "#2a313a",
  skin: "#d19a72",
  skinShade: "#bd8a61",
  skinDeep: "#a9764f",
  line: "#23262b",
  shirt: "#8fabcf",
  collar: "#f2ecdf",
  accent: "#ff7a1a",
  ink: "#171a1e",
  cream: "#f2ecdf",
  glass: "#0f1113",
  glassFrame: "#0d0f11",
};

function Sleeve({ d }: { d: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={PAL.outline} strokeWidth={37} strokeLinecap="round" />
      <path d={d} fill="none" stroke={PAL.shirt} strokeWidth={31} strokeLinecap="round" />
    </g>
  );
}

function Hand({ cx, cy, r = 10.5 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2.5} fill={PAL.outline} />
      <circle cx={cx} cy={cy} r={r} fill={PAL.skin} />
    </g>
  );
}

/** The approved face — used unchanged everywhere. */
function Face() {
  return (
    <g>
      {/* head — youthful, slightly angular, defined natural jaw */}
      <path
        d="M120 56 C144 56 162 68 166 90 C169 104 168 122 162 136 C156 150 146 162 136 170 C129 176 125 179 120 181 C115 179 111 176 104 170 C94 162 84 150 78 136 C72 122 71 104 74 90 C78 68 96 56 120 56 Z"
        fill={PAL.skin}
      />
      {/* soft cheek/jaw shading */}
      <path
        d="M162 136 C156 150 146 162 136 170 C129 176 125 179 120 181 C128 176 136 170 142 162 C148 154 152 144 154 134 Z"
        fill={PAL.skinShade}
        opacity={0.4}
      />
      {/* hair — volume on top, frames the face */}
      <path
        d="M60 118 C46 58 62 30 96 20 C108 16 132 16 144 20 C178 30 194 58 180 118 C182 96 172 74 158 68 C146 62 134 60 120 62 C104 60 92 64 82 70 C70 74 62 92 60 118 Z"
        fill={PAL.hair}
      />
      {/* front locks */}
      <path d="M104 62 C102 68 102 72 104 76 C107 71 107 66 107 62" fill={PAL.hair} />
      <path d="M130 61 C128 67 128 71 130 74 C133 69 133 65 133 61" fill={PAL.hair} />
      {/* crown highlights */}
      <path d="M96 30 C112 22 132 22 150 30" fill="none" stroke={PAL.hairHi} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M104 42 C116 36 130 36 144 42" fill="none" stroke={PAL.hairHi2} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      {/* nose */}
      <path d="M120 122 L119 134" fill="none" stroke={PAL.skinDeep} strokeWidth={2} strokeLinecap="round" />
      {/* mouth — relaxed, a quiet lift */}
      <path d="M110 150 Q117 152 130 149" fill="none" stroke={PAL.line} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M118 156 Q123 158 128 156" fill="none" stroke={PAL.skinDeep} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
      {/* chin shadow */}
      <path d="M113 168 Q120 171 127 168" fill="none" stroke={PAL.skinDeep} strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
      {/* black sunglasses — the identity */}
      <g>
        <g fill={PAL.glass} stroke={PAL.glassFrame} strokeWidth={3}>
          <path d="M84 92 C84 85 90 82 100 82 L110 82 C114 82 115 86 115 91 L114 112 C114 117 110 119 103 119 L91 119 C86 119 84 115 84 109 Z" />
          <path d="M125 82 L140 82 C150 82 156 85 156 92 L156 109 C156 115 154 119 149 119 L137 119 C130 119 126 117 126 112 L125 91 C125 86 125 82 125 82 Z" />
        </g>
        <path d="M115 92 L125 92" fill="none" stroke={PAL.glassFrame} strokeWidth={3.5} />
        <path d="M84 90 L76 98" fill="none" stroke={PAL.glassFrame} strokeWidth={3} strokeLinecap="round" />
        <path d="M156 90 L164 98" fill="none" stroke={PAL.glassFrame} strokeWidth={3} strokeLinecap="round" />
        <path d="M87 90 Q100 84 112 90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeLinecap="round" />
        <path d="M128 90 Q140 84 153 90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Shirt, collar, neck and the lanyard ID card. */
function Body({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      {/* shirt — light blue */}
      <path d="M64 198 C88 180 152 180 176 198 L190 320 C120 330 50 318 50 320 Z" fill={PAL.shirt} />
      {/* collar */}
      <path d="M80 200 L106 242 L82 254 Z" fill={PAL.collar} />
      <path d="M160 200 L134 242 L158 254 Z" fill={PAL.collar} />
      {/* lanyard + ID card */}
      <path d="M110 160 L117 214" fill="none" stroke={PAL.cream} strokeWidth={2.5} />
      <path d="M130 160 L123 214" fill="none" stroke={PAL.cream} strokeWidth={2.5} />
      <rect x={103} y={214} width={34} height={42} rx={6} fill={PAL.ink} />
      <circle cx={120} cy={225} r={2.5} fill={PAL.accent} />
      <path d="M109 233 L131 233" stroke={PAL.cream} strokeWidth={1.5} opacity={0.4} />
      {/* neck */}
      <path d="M108 148 L132 148 L134 200 L106 200 Z" fill={PAL.skinShade} />
      <path d="M124 152 L132 152 L134 200 L126 200 Z" fill={PAL.skinDeep} opacity={0.7} />
      {children}
    </g>
  );
}

/** Open laptop with a glowing terminal screen. */
function Laptop() {
  return (
    <g>
      <rect x={82} y={194} width={76} height={52} rx={6} fill={PAL.ink} stroke={PAL.outline} strokeWidth={2.5} />
      <rect x={88} y={200} width={64} height={40} rx={3} fill="#14100b" />
      <rect x={94} y={209} width={42} height={3.5} rx={1.75} fill={PAL.accent} />
      <rect x={94} y={218} width={30} height={3.5} rx={1.75} fill="rgba(245,237,223,0.55)" />
      <rect x={94} y={227} width={48} height={3.5} rx={1.75} fill="rgba(245,237,223,0.38)" />
      <rect x={94} y={236} width={9} height={3.5} rx={1.75} fill={PAL.accent} />
      <rect x={108} y={234} width={3} height={8} rx={1.5} fill="#ffab5e" className="animate-blink" />
      <circle cx={120} cy={192} r={1.5} fill="rgba(245,237,223,0.4)" />
      <rect x={80} y={246} width={80} height={12} rx={5} fill={PAL.ink} stroke={PAL.outline} strokeWidth={2.5} />
      <rect x={112} y={251} width={16} height={3} rx={1.5} fill="rgba(245,237,223,0.2)" />
    </g>
  );
}

export function Character({ pose = "relaxed", className = "" }: { pose?: CharacterPose; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 240 320" data-character className={`h-auto w-full ${reduce ? "" : "char-bob"}`}>
        <Body />
        <Face />

        {pose === "relaxed" && (
          <g>
            <Sleeve d="M78 186 C90 214 104 230 122 238" />
            <Sleeve d="M162 186 C150 214 136 230 118 238" />
            <Hand cx={126} cy={244} />
            <Hand cx={114} cy={244} />
          </g>
        )}

        {pose === "wave" && (
          <g>
            {/* down arm */}
            <Sleeve d="M78 188 C70 212 68 238 70 262" />
            <Hand cx={70} cy={266} />
            {/* raised farewell arm — relaxed */}
            <Sleeve d="M162 188 C174 164 180 140 178 118" />
            <Hand cx={178} cy={112} />
            <g transform="rotate(-8 176 100)">
              <rect x={170} y={86} width={7} height={15} rx={3.5} fill={PAL.skin} stroke={PAL.outline} strokeWidth={2} />
              <rect x={179} y={84} width={7} height={17} rx={3.5} fill={PAL.skin} stroke={PAL.outline} strokeWidth={2} />
              <rect x={188} y={87} width={7} height={14} rx={3.5} fill={PAL.skin} stroke={PAL.outline} strokeWidth={2} />
            </g>
          </g>
        )}

        {pose === "laptop" && (
          <g>
            <Sleeve d="M80 188 C74 212 82 234 96 250" />
            <Sleeve d="M160 188 C166 212 158 234 144 250" />
            <Laptop />
            {/* hands grip the base edges */}
            <Hand cx={88} cy={254} r={10} />
            <Hand cx={152} cy={254} r={10} />
          </g>
        )}
      </svg>
    </div>
  );
}

/** Head-only avatar — the same face, cropped. */
export function CharacterHead({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="42 6 156 188" data-character className={`h-auto w-full ${reduce ? "" : "char-bob"}`}>
        <Face />
      </svg>
    </div>
  );
}

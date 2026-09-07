import type { SneakerArtSpec } from '../types';

interface Props {
  art: SneakerArtSpec;
  className?: string;
  /** Unique suffix so clip/gradient ids don't collide between instances. */
  uid?: string;
}

/*
 * Parametric side-profile sneaker (toe left, heel right) on a 320×200 canvas.
 *
 * Every product shares this geometry, so the catalogue reads as one uniform set
 * of product shots; only the colourway and the ankle cut change. Colour panels
 * (toe cap, heel, collar, swoosh) are deliberately drawn oversized and then
 * CLIPPED to the upper's outline — that's what keeps them following the
 * silhouette instead of floating on top of it.
 *
 * To adjust the drawing, edit the path constants below; nothing else reads them.
 */

/** Outline colour — keeps pale colourways (Triple White) legible on the panel. */
const EDGE = 'rgba(0,0,0,0.18)';

/* Upper outlines, one per ankle cut. Shared toe + vamp, different collar. */
const UPPER = {
  low: 'M24 146C22 132 32 121 48 117L112 101C130 97 143 91 151 84C155 74 155 64 160 58C166 49 186 48 192 58L197 84C200 94 206 100 214 102L244 100C262 98 276 92 284 82C290 73 304 76 306 100L307 146Z',
  mid: 'M24 146C22 132 32 121 48 117L112 101C130 97 143 91 149 82C152 70 151 56 157 48C163 39 186 38 193 48L199 68C202 78 206 84 212 86C216 76 226 66 242 63L266 60C283 58 291 70 292 90C295 110 300 130 305 146Z',
  high: 'M24 146C22 132 32 121 48 117L112 101C130 97 143 91 149 82C152 68 150 52 156 44C162 35 186 34 193 44L199 62C202 72 205 76 210 78C214 66 224 54 240 50L266 47C284 45 293 58 294 80C297 102 302 124 306 146Z',
} as const;

/** Padded ankle cuff — only drawn for mid and high cuts. */
const COLLAR = {
  mid: 'M206 42L320 42L320 104C300 94 266 90 244 92L218 98C208 100 202 92 204 80Z',
  high: 'M204 30L320 30L320 96C300 86 266 82 244 84L216 90C206 92 200 84 202 70Z',
} as const;

const MIDSOLE = 'M22 165C17 154 24 145 42 143L296 143C310 145 317 154 317 164L317 167L22 167Z';
const OUTSOLE =
  'M26 159L304 159C310 159 314 163 314 168C314 174 307 178 298 178L38 178C25 178 16 172 16 166C16 162 19 159 26 159Z';
const TOE_CAP = 'M0 60L96 60C92 110 76 138 48 152L0 152Z';
const HEEL_PANEL = 'M320 0L320 200L242 200C252 140 254 70 250 0Z';
const SWOOSH =
  'M106 138C136 133 184 122 230 102C238 98 245 104 239 111C214 128 162 140 116 144C109 145 102 141 106 138Z';
const LACES = ['M158 82 192 88', 'M161 73 190 79', 'M165 63 187 69'];

/** Toe-box perforations — the detail that stops it reading as a flat decal. */
const PERFS = [
  [46, 130],
  [56, 126],
  [66, 122],
  [50, 138],
  [60, 134],
  [70, 130],
] as const;

/** Laces and tongue tag ride up with the collar on taller cuts. */
const LACE_SHIFT = { low: 0, mid: -9, high: -17 } as const;

export function SneakerArt({ art, className, uid = 'a' }: Props) {
  const { cut } = art;
  const upper = UPPER[cut];
  const collar = cut === 'low' ? null : COLLAR[cut];
  const dy = LACE_SHIFT[cut];
  const clipId = `clip-${uid}`;
  const sheenId = `sheen-${uid}`;

  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label={`${art.label} illustration`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={upper} />
        </clipPath>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.17" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <ellipse cx="164" cy="184" rx="132" ry="7" fill="#000" opacity="0.12" />

      <path d={MIDSOLE} fill={art.midsole} stroke={EDGE} strokeWidth="1.5" />
      <path d={OUTSOLE} fill={art.outsole} stroke={EDGE} strokeWidth="1.5" />

      {/* Visible Air unit (Air Max models) */}
      {art.air && (
        <ellipse
          cx="284"
          cy="153"
          rx="22"
          ry="8"
          fill={art.accent}
          stroke={EDGE}
          strokeWidth="1.5"
        />
      )}

      <path d={upper} fill={art.base} />

      <g clipPath={`url(#${clipId})`}>
        <path d={TOE_CAP} fill={art.overlay} />
        <path d={HEEL_PANEL} fill={art.overlay} />

        <g fill="#000" opacity="0.12">
          {PERFS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
          ))}
        </g>

        <path d={SWOOSH} fill={art.swoosh} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

        {collar && <path d={collar} fill={art.collar} />}

        <g
          transform={`translate(0 ${dy})`}
          stroke={art.laces}
          strokeWidth="4.5"
          strokeLinecap="round"
        >
          {LACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <rect x="168" y={52 + dy} width="18" height="8" rx="2.5" fill={art.accent} />
        <rect x="262" y="112" width="22" height="8" rx="4" fill={art.accent} opacity="0.85" />

        {/* Shared sheen so every colourway reads as the same product shot */}
        <path d={upper} fill={`url(#${sheenId})`} />
      </g>

      <path d={upper} fill="none" stroke={EDGE} strokeWidth="1.5" />
    </svg>
  );
}

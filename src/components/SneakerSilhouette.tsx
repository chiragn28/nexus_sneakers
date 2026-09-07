interface Props {
  className?: string;
}

/**
 * Line-art sneaker matching the low-cut geometry used by <SneakerArt>. Stroked
 * rather than filled so the upper and sole stay readable as separate parts at
 * any size. Decorative only — used behind headings and in empty states.
 */
export function SneakerSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 146C22 132 32 121 48 117L112 101C130 97 143 91 151 84C155 74 155 64 160 58C166 49 186 48 192 58L197 84C200 94 206 100 214 102L244 100C262 98 276 92 284 82C290 73 304 76 306 100L307 146Z" />
      <path d="M22 165C17 154 24 145 42 143L296 143C310 145 317 154 317 164L317 167L22 167Z" />
      <path d="M26 159L304 159C310 159 314 163 314 168C314 174 307 178 298 178L38 178C25 178 16 172 16 166C16 162 19 159 26 159Z" />
    </svg>
  );
}

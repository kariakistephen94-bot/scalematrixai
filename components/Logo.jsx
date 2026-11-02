const PATHS = [
  ["M30 3H6L2 7V17L6 21H26L30 25V35L26 39H2", 2],
  ["M30 3H7L2 8V34L7 39H30", 41],
  ["M1 39L13 3H20L32 39M7 26H26", 80],
  ["M3 3V39H30", 119],
  ["M30 3H3V39H30M3 20H25", 158],
  ["M2 39V3H7L17 23L27 3H32V39", 197],
  ["M1 39L13 3H20L32 39M7 26H26", 236],
  ["M1 3H33M17 3V39", 275],
  ["M3 39V3H26L31 8V17L26 22H3M19 22L32 39", 314],
  ["M5 3H27M16 3V39M5 39H27", 353],
  ["M2 3L31 39M31 3L2 39", 392],
];

/** The wordmark, inlined so every stroke can draw itself on. */
export default function Logo({ id, className = "", reveal = false }) {
  return (
    <svg
      className={`logo ${className}`}
      viewBox="0 0 490 50"
      role="img"
      aria-label="ScaleMatrix AI"
      data-reveal={reveal ? "" : undefined}
    >
      <defs>
        <linearGradient id={id}>
          <stop stopColor="#f3efff" />
          <stop offset=".35" stopColor="#c8b7ff" />
          <stop offset="1" stopColor="#954bff" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="5.5"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      >
        {PATHS.map(([d, x], i) => (
          <path
            key={x}
            d={d}
            transform={`translate(${x} 4)`}
            pathLength="1"
            className="draw"
            style={{ "--i": i }}
          />
        ))}
      </g>
      <g fill="none" stroke="#b581ff" strokeWidth="5.5" strokeLinejoin="round">
        <path
          d="M414 43L430 7H438L454 43M421 29H447M468 16V43"
          pathLength="1"
          className="draw"
          style={{ "--i": 11 }}
        />
      </g>
      <circle className="dot" cx="468" cy="7" r="3.3" fill="#b581ff" />
    </svg>
  );
}

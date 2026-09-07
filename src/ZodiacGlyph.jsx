const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const GLYPHS = {
  aries: (
    <>
      <path d="M18 52c0-16 4-28 14-28s14 12 14 28" {...STROKE} />
      <path d="M20 24c-6-6-8-14-3-17" {...STROKE} />
      <path d="M44 24c6-6 8-14 3-17" {...STROKE} />
    </>
  ),
  taurus: (
    <>
      <circle cx="32" cy="38" r="14" {...STROKE} />
      <path d="M16 18c6 10 10 12 16 12s10-2 16-12" {...STROKE} />
    </>
  ),
  gemini: (
    <>
      <path d="M18 14h28" {...STROKE} />
      <path d="M18 50h28" {...STROKE} />
      <path d="M24 14v36" {...STROKE} />
      <path d="M40 14v36" {...STROKE} />
    </>
  ),
  cancer: (
    <>
      <path d="M18 24a10 10 0 1 1 10 10" {...STROKE} />
      <path d="M46 40a10 10 0 1 1-10-10" {...STROKE} />
      <path d="M14 28c8 4 16 4 22 0" {...STROKE} />
      <path d="M50 36c-8-4-16-4-22 0" {...STROKE} />
    </>
  ),
  leo: (
    <>
      <circle cx="28" cy="30" r="12" {...STROKE} />
      <path d="M38 36c8 2 12 10 8 16-6 2-12-2-10-8" {...STROKE} />
    </>
  ),
  virgo: (
    <>
      <path d="M16 50V18c0-4 6-6 10 0v32" {...STROKE} />
      <path d="M26 50V18c0-4 6-6 10 0v32" {...STROKE} />
      <path d="M36 50V22c4-2 12 2 12 12 0 10-6 14-14 12" {...STROKE} />
    </>
  ),
  libra: (
    <>
      <path d="M14 42h36" {...STROKE} />
      <path d="M18 50h28" {...STROKE} />
      <path d="M20 42c0-14 8-22 12-22s12 8 12 22" {...STROKE} />
    </>
  ),
  scorpio: (
    <>
      <path d="M16 50V18c0-4 6-6 10 0v32" {...STROKE} />
      <path d="M26 50V18c0-4 6-6 10 0v32" {...STROKE} />
      <path d="M36 18c0-4 6-6 10 0v26c0 8 8 10 12 6" {...STROKE} />
      <path d="M52 44l6 6-8 1" {...STROKE} />
    </>
  ),
  sagittarius: (
    <>
      <path d="M18 46L46 18" {...STROKE} />
      <path d="M30 18h16v16" {...STROKE} />
      <path d="M22 30l12 12" {...STROKE} />
    </>
  ),
  capricorn: (
    <>
      <path d="M14 48V20c0-4 6-6 10 2l8 16c2 4 8 2 8-4V20" {...STROKE} />
      <path d="M40 36c8 0 14 8 10 16-8 4-16-2-12-10" {...STROKE} />
    </>
  ),
  aquarius: (
    <>
      <path d="M12 28l8-6 8 6 8-6 8 6 8-6" {...STROKE} />
      <path d="M12 42l8-6 8 6 8-6 8 6 8-6" {...STROKE} />
    </>
  ),
  pisces: (
    <>
      <path d="M18 14c12 10 12 26 0 36" {...STROKE} />
      <path d="M46 14c-12 10-12 26 0 36" {...STROKE} />
      <path d="M16 32h32" {...STROKE} />
    </>
  ),
}

export default function ZodiacGlyph({ id, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      {GLYPHS[id] || (
        <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
      )}
    </svg>
  )
}

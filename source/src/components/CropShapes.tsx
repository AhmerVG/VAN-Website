/**
 * CROP SHAPES — one drawn plant per crop family, added 9 September 2026.
 *
 * Tahir's instruction: pick a crop and the simulator should show that crop, drawn so it visually
 * matches the real thing. A wheat plant is a spike on a thin stem; cotton is a boll that splits
 * open; sugarcane is a jointed pole; a date palm is nothing like either. Showing the same generic
 * green stick for all twenty-eight is what made the preview read as a toy.
 *
 * These are FAMILY shapes, not portraits. Fourteen drawings cover all twenty-eight programmes, and
 * a crop is mapped to the family whose growth habit it actually shares — not to its market
 * category. Rice sits with wheat because both are spikes on tillers; potato sits alone because the
 * part that matters is underground and no other crop on the site is drawn that way.
 *
 * Two states, both driven by the simulator's own dials rather than decoration:
 *   `thin`     — a thinner stand, drawn as fewer plants by the caller, and a lighter plant here
 *   `stressed` — a crop that has missed water or nitrogen: paler, and the head or fruit smaller
 */
export type CropFamily =
  | 'spike' | 'maize' | 'cotton' | 'cane' | 'potato' | 'brassica' | 'sunflower'
  | 'legume' | 'fruiting' | 'bulb' | 'tree' | 'palm' | 'broadleaf' | 'vine'

/** Every crop slug on the site, mapped to the shape it actually grows like. */
export const CROP_FAMILY: Record<string, CropFamily> = {
  wheat: 'spike', 'rice-basmati': 'spike', 'rice-hybrid': 'spike', sesame: 'spike',
  maize: 'maize',
  cotton: 'cotton',
  sugarcane: 'cane', 'sugarcane-ratoon': 'cane',
  potato: 'potato',
  canola: 'brassica',
  sunflower: 'sunflower',
  chickpea: 'legume', lentil: 'legume', 'mungbean-mash': 'legume', soybean: 'legume',
  tomato: 'fruiting', chili: 'fruiting', strawberry: 'fruiting',
  onion: 'bulb', garlic: 'bulb',
  citrus: 'tree', mango: 'tree', guava: 'tree',
  'date-palm': 'palm',
  'banana-year1': 'broadleaf', 'banana-year2': 'broadleaf', turmeric: 'broadleaf',
  watermelon: 'vine',
}
export const familyFor = (slug: string): CropFamily => CROP_FAMILY[slug] ?? 'spike'

const GREEN = '#2F6B3A', PALE = '#A9C7A0', GOLD = '#D9A21B', RUST = '#9C4E2A'
const SOIL = '#7A5230'

/**
 * One plant, drawn in a 100 wide by 120 tall box with the soil line at y=100. Everything below 100
 * is root or tuber, which only the potato uses.
 */
export function Plant({ family, stressed = false }: { family: CropFamily; stressed?: boolean }) {
  const g = stressed ? PALE : GREEN
  const sw = 3.2
  const head = stressed ? 0.72 : 1     // a stressed crop makes a smaller head, cob, boll or fruit

  const leaves = (y: number, spread = 26, drop = 16) => (
    <>
      <path d={`M50 ${y} c-${spread} -4 -${spread + 6} -${drop} -${spread + 4} -${drop + 10}`} stroke={g} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={`M50 ${y + 8} c${spread} -4 ${spread + 6} -${drop} ${spread + 4} -${drop + 10}`} stroke={g} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </>
  )

  switch (family) {
    case 'spike': return (
      <g>
        <path d="M50 100 V34" stroke={g} strokeWidth={sw} strokeLinecap="round" />
        {leaves(72)}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 34 + i * 5.4 * head
          return <g key={i}><path d={`M50 ${y} l-8 -3.5`} stroke={stressed ? PALE : GOLD} strokeWidth="3" strokeLinecap="round" /><path d={`M50 ${y} l8 -3.5`} stroke={stressed ? PALE : GOLD} strokeWidth="3" strokeLinecap="round" /></g>
        })}
        <path d="M50 34 v-9" stroke={stressed ? PALE : GOLD} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    )
    case 'maize': return (
      <g>
        <path d="M50 100 V22" stroke={g} strokeWidth="4.2" strokeLinecap="round" />
        {leaves(78, 30, 20)}{leaves(58, 27, 18)}
        <path d="M50 22 c-6 -10 -3 -16 0 -20 M50 22 c6 -10 3 -16 0 -20" stroke={stressed ? PALE : GOLD} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <ellipse cx="60" cy={62} rx={7 * head} ry={15 * head} fill={stressed ? PALE : GOLD} />
        <path d={`M60 ${62 - 15 * head} v-6`} stroke={g} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    )
    case 'cotton': return (
      <g>
        <path d="M50 100 V40" stroke={g} strokeWidth={sw} strokeLinecap="round" />
        {leaves(76, 24, 14)}{leaves(58, 20, 12)}
        <circle cx="50" cy="34" r={11 * head} fill="#fff" stroke={stressed ? PALE : GREEN} strokeWidth="2.4" />
        <circle cx="43" cy="38" r={6 * head} fill="#fff" stroke={stressed ? PALE : GREEN} strokeWidth="2" />
        <circle cx="58" cy="39" r={6 * head} fill="#fff" stroke={stressed ? PALE : GREEN} strokeWidth="2" />
        <path d="M50 45 l-5 6 M50 45 l5 6" stroke={g} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    )
    case 'cane': return (
      <g>
        <path d="M50 100 V16" stroke={g} strokeWidth="5" strokeLinecap="round" />
        {[86, 70, 54, 38].map(y => <path key={y} d={`M45 ${y} h10`} stroke={stressed ? PALE : SOIL} strokeWidth="2.4" strokeLinecap="round" />)}
        <path d="M50 22 c-16 -6 -22 -14 -24 -22 M50 20 c16 -6 22 -14 24 -22 M50 26 c-10 -10 -12 -18 -12 -26" stroke={g} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )
    case 'potato': return (
      <g>
        <path d="M50 100 V52" stroke={g} strokeWidth={sw} strokeLinecap="round" />
        <path d="M50 62 c-16 -2 -22 -10 -24 -18 M50 56 c16 -2 22 -10 24 -18 M50 72 c-13 -2 -18 -8 -19 -14" stroke={g} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M14 100 H86" stroke={SOIL} strokeWidth="2" opacity=".5" strokeDasharray="4 4" />
        <ellipse cx="36" cy={110} rx={9 * head} ry={7 * head} fill={stressed ? '#C9B79A' : '#C8A165'} />
        <ellipse cx="58" cy={113} rx={10 * head} ry={7.5 * head} fill={stressed ? '#C9B79A' : '#C8A165'} />
        <ellipse cx="70" cy={106} rx={6.5 * head} ry={5.5 * head} fill={stressed ? '#C9B79A' : '#C8A165'} />
      </g>
    )
    case 'brassica': return (
      <g>
        <path d="M50 100 V38" stroke={g} strokeWidth={sw} strokeLinecap="round" />
        {leaves(78, 22, 14)}
        <path d="M50 44 c-12 -4 -16 -10 -17 -18 M50 40 c12 -4 16 -10 17 -18" stroke={g} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {[[50, 30], [36, 26], [64, 27], [43, 20], [57, 20]].map(([cx, cy], i) =>
          <circle key={i} cx={cx} cy={cy} r={4.4 * head} fill={stressed ? '#D9CE9A' : GOLD} />)}
      </g>
    )
    case 'sunflower': return (
      <g>
        <path d="M50 100 V38" stroke={g} strokeWidth="4" strokeLinecap="round" />
        {leaves(76, 26, 16)}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30) * Math.PI / 180, r = 17 * head
          return <ellipse key={i} cx={50 + Math.cos(a) * r} cy={28 + Math.sin(a) * r} rx={6 * head} ry={3.4 * head}
            transform={`rotate(${i * 30} ${50 + Math.cos(a) * r} ${28 + Math.sin(a) * r})`} fill={stressed ? '#D9CE9A' : GOLD} />
        })}
        <circle cx="50" cy="28" r={10 * head} fill={stressed ? '#8A7A5B' : '#5B4327'} />
      </g>
    )
    case 'legume': return (
      <g>
        <path d="M50 100 V56" stroke={g} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M50 84 c-14 -2 -18 -8 -19 -14 M50 76 c14 -2 18 -8 19 -14 M50 66 c-12 -2 -15 -7 -16 -12" stroke={g} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {[[38, 62], [60, 58], [50, 50]].map(([cx, cy], i) =>
          <ellipse key={i} cx={cx} cy={cy} rx={8 * head} ry={3.6 * head} transform={`rotate(${-25 + i * 25} ${cx} ${cy})`} fill={stressed ? PALE : '#8FB877'} stroke={g} strokeWidth="1.6" />)}
      </g>
    )
    case 'fruiting': return (
      <g>
        <path d="M64 100 V26" stroke={SOIL} strokeWidth="2.4" opacity=".55" strokeLinecap="round" />
        <path d="M50 100 V34" stroke={g} strokeWidth={sw} strokeLinecap="round" />
        {leaves(80, 22, 13)}{leaves(60, 19, 11)}
        {[[38, 66], [60, 74], [46, 50]].map(([cx, cy], i) =>
          <circle key={i} cx={cx} cy={cy} r={6.5 * head} fill={stressed ? '#D8A9A2' : RUST} />)}
      </g>
    )
    case 'bulb': return (
      <g>
        <path d="M14 100 H86" stroke={SOIL} strokeWidth="2" opacity=".5" strokeDasharray="4 4" />
        <ellipse cx="50" cy="104" rx={14 * head} ry={12 * head} fill={stressed ? '#D9C9AE' : '#C8A165'} />
        <path d="M50 92 V40 M50 92 c-10 -12 -14 -26 -13 -40 M50 92 c10 -12 14 -26 13 -40 M50 92 c-5 -16 -6 -30 -5 -44"
          stroke={g} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
    )
    case 'tree': return (
      <g>
        <path d="M50 100 V64" stroke={SOIL} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M50 70 l-14 -12 M50 74 l14 -12" stroke={SOIL} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="50" cy="42" r={26 * (stressed ? 0.86 : 1)} fill={stressed ? PALE : GREEN} opacity=".9" />
        <circle cx="33" cy="52" r={13 * (stressed ? 0.86 : 1)} fill={stressed ? PALE : GREEN} opacity=".9" />
        <circle cx="67" cy="52" r={13 * (stressed ? 0.86 : 1)} fill={stressed ? PALE : GREEN} opacity=".9" />
        {[[40, 38], [58, 44], [50, 28]].map(([cx, cy], i) =>
          <circle key={i} cx={cx} cy={cy} r={5 * head} fill={stressed ? '#D9CE9A' : GOLD} />)}
      </g>
    )
    case 'palm': return (
      <g>
        <path d="M50 100 V38" stroke={SOIL} strokeWidth="6" strokeLinecap="round" />
        {[92, 80, 68, 56].map(y => <path key={y} d={`M46 ${y} h8`} stroke="#5E3F26" strokeWidth="2.2" />)}
        {[-70, -40, -12, 12, 40, 70].map((a, i) => (
          <path key={i} d={`M50 36 q${Math.sin(a * Math.PI / 180) * 34} ${-16 - Math.cos(a * Math.PI / 180) * 10} ${Math.sin(a * Math.PI / 180) * 44} ${4 - Math.cos(a * Math.PI / 180) * 8}`}
            stroke={stressed ? PALE : GREEN} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ))}
        {[[40, 46], [60, 46]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={5 * head} ry={7 * head} fill={stressed ? '#C9A98A' : '#B5651D'} />)}
      </g>
    )
    case 'broadleaf': return (
      <g>
        <path d="M50 100 V56" stroke={g} strokeWidth="5" strokeLinecap="round" />
        {[[-1, 0], [1, 0], [-1, 14], [1, 14]].map(([dir, dy], i) => (
          <path key={i} d={`M50 ${56 + dy} q${dir * 26} -14 ${dir * 34} -${34 - dy}`} stroke={stressed ? PALE : GREEN} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".92" />
        ))}
        <path d="M50 56 V30" stroke={stressed ? PALE : GREEN} strokeWidth="6" strokeLinecap="round" />
      </g>
    )
    case 'vine': return (
      <g>
        <path d="M18 100 q16 -14 32 -6 q16 8 32 -4" stroke={g} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M34 94 c-8 -6 -9 -13 -6 -18 M66 92 c8 -6 9 -13 6 -18" stroke={g} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy={90} rx={17 * head} ry={13 * head} fill={stressed ? '#9FBE93' : '#3F7D3A'} />
        <path d={`M${50 - 17 * head} 90 q17 -8 ${34 * head} 0`} stroke="#2A5A28" strokeWidth="2" fill="none" opacity=".7" />
      </g>
    )
    default: return null
  }
}

/** A drawn stand: `count` plants of one family on a soil line, thinner and paler under stress. */
export function Stand({ family, count, stressed, className = '' }: { family: CropFamily; count: number; stressed: boolean; className?: string }) {
  const n = Math.max(2, count)
  const step = 100 / n
  return (
    <svg viewBox="0 0 100 128" width="100%" className={className} role="img"
      aria-label={`A stand of ${n} plants${stressed ? ', showing stress' : ''}`} preserveAspectRatio="xMidYMax meet">
      <rect x="0" y="100" width="100" height="28" fill={SOIL} opacity=".28" />
      <line x1="0" y1="100" x2="100" y2="100" stroke={SOIL} strokeWidth="1.2" opacity=".6" />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${step * i + step / 2 - 50} 0) scale(${Math.min(1, 5 / n)}) translate(${50 - 50 * Math.min(1, 5 / n) * 0 } ${100 - 100 * Math.min(1, 5 / n)})`}>
          <Plant family={family} stressed={stressed} />
        </g>
      ))}
    </svg>
  )
}

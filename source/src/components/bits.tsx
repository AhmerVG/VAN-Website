import type { ReactNode, CSSProperties } from 'react'
import { PACK_WEBP, PACK_PNG } from '@/data/assets'
import { PRODUCTS, type Product } from '@/data/catalogue'

export function SectionHead({ eyebrow, title, lead, tone, right, id }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; tone?: 'green' | 'soil' | 'gold' | 'navy' | 'rust'; right?: ReactNode; id?: string }) {
  return (
    // O-14: 40px between a heading and its own content, on top of the 128px band above it. 24px.
    <div id={id} className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-10 mb-5 lg:mb-6">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className={`eyebrow ${tone ?? ''}`}>{eyebrow}</span>}
        {/* 11 Sep 2026 · this was max-w-[22ch] = 584px, while the lead underneath it ran the full
            1016px column. The largest type on the page had the narrowest measure and the smallest
            type had the widest, which is backwards, and it orphaned the last word of most headings
            ("...reaches the / crop."). 30ch with text-balance puts the heading above its own lead
            and lets the balancer choose where to break. */}
        <h2 className="max-w-[30ch]" style={{ textWrap: 'balance' }}>{title}</h2>
        {lead && <p className="lead mt-4">{lead}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

export const WaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.3 4.4c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.5z"/></svg>
)

export function WaButton({ href, children, className = 'btn-wa', lg }: { href: string; children: ReactNode; className?: string; lg?: boolean }) {
  return <a className={`btn ${className} ${lg ? 'btn-lg' : ''}`} href={href} target="_blank" rel="noopener"><WaIcon size={lg ? 24 : 20} />{children}</a>
}

export function productBySlug(slug: string): Product | undefined { return PRODUCTS.find(p => p.slug === slug) }
/**
 * The published deck file names were fixed when those PDFs were uploaded, so deriving the URL from
 * the display name breaks the link the moment a product is renamed — which is exactly what happened
 * when V-Phosphate became "V. Ammonium Phosphate" on 8 Sep 2026 (the derived URL 404s; the real file
 * is still VAN-LMS-V-Phosphate.pdf). Renamed products are pinned here by slug. Verified against the
 * live server before shipping.
 */
const LMS_FILE_BY_SLUG: Record<string, string> = {
  'v-phosphate': 'VAN-LMS-V-Phosphate',
}
export function lmsUrl(p: Product) {
  const file = LMS_FILE_BY_SLUG[p.slug] ?? `VAN-LMS-${p.name.replace(/%/g, '').replace(/\s+/g, '-')}`
  return `https://www.van.com.pk/lms/${file}.pdf`
}

/** Pack shot — the WEBP for every slug; the high-res PNG when one exists and `hi` is asked for. */
export function PackShot({ slug, hi, className = '', style, alt }: { slug: string | null; hi?: boolean; className?: string; style?: CSSProperties; alt?: string }) {
  // D-151: the plan cell prints the product name beside this drawing, so the drawing is decorative.
  if (!slug) return <DrawnBag grey label={alt ?? ''} className={className} decorative />
  const p = productBySlug(slug)
  const src = (hi && p?.png && PACK_PNG[p.png]) || PACK_WEBP[slug]
  if (!src) return <DrawnBag className={className} />
  return <img src={src} alt={alt ?? p?.name ?? slug} className={className} style={style} />
}

/** Split a bag label into at most 3 short lines so a long name ("Calcium Ammonium Nitrate") fits. */
function bagLines(label: string): string[] {
  const words = label.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  for (const w of words) {
    const last = lines[lines.length - 1]
    if (last !== undefined && (last + ' ' + w).length <= 9) lines[lines.length - 1] = last + ' ' + w
    else lines.push(w)
  }
  return lines.length > 3 ? [...lines.slice(0, 2), lines.slice(2).join(' ')] : lines
}

/** A drawn bag silhouette, used for commodity inputs and where no pack render exists.
 *  B7, 24 Sep 2026: the default label was "Urea", so every commodity row (CAN, MgSO₄, farmyard
 *  manure...) was drawn as a urea bag. Callers now pass the row's own product name; with no label
 *  the bag is drawn blank. Revert: restore `label = 'Urea'` and the single <text> line. */
export function DrawnBag({ grey, label = '', sub, className = '', width = 70, decorative = false }: { grey?: boolean; label?: string; sub?: string; className?: string; width?: number; decorative?: boolean }) {
  const fill = grey ? '#D9DDE1' : '#FFFFFF'
  const stroke = grey ? '#8A968C' : '#14231A'
  const lines = bagLines(label)
  const longest = Math.max(1, ...lines.map(l => l.length))
  const fs = longest <= 6 ? 11 : Math.max(6, Math.floor(62 / longest))
  const top = 49 - ((lines.length - 1) * (fs + 1)) / 2
  return (
    // D-151 (QA 5): below 11px rendered, the drawn label is a picture of print, not text to read; the
    // product's name is always printed beside the bag, so the drawing is then marked decorative.
    <svg width={width} viewBox="0 0 70 100" className={className} {...(decorative || fs * width / 70 < 11 ? { 'aria-hidden': true } : { 'aria-label': label || 'Commodity input', role: 'img' })}>
      <path d="M12 12h46l4 8v66a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V20z" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 12l-4 8h54l-4-8" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="10" y="30" width="50" height="38" rx="3" fill={grey ? '#C3C9CE' : '#E6EEE8'} />
      {lines.map((l, i) => <text key={i} x="35" y={top + i * (fs + 1) + fs / 3} textAnchor="middle" fontFamily="Public Sans, sans-serif" fontWeight="700" fontSize={fs} fill={stroke}>{l}</text>)}
      {sub && <text x="35" y="80" textAnchor="middle" fontFamily="Public Sans, sans-serif" fontSize="8" fill={stroke}>{sub}</text>}
    </svg>
  )
}

/** The analysis to print on a drawn bag: only a real analysis (it carries a figure), never a name. */
export const bagSub = (analysis?: string) => (analysis && /\d/.test(analysis) ? analysis.trim() : undefined)

/** Small method icon by name — the five methods are distinct and never synonyms. */
export function MethodIcon({ method, size = 22 }: { method: string; size?: number }) {
  const m = method.toLowerCase()
  const c = 'currentColor'
  if (m.includes('placement') || m.includes('drill') || m.includes('basal')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 19h18M8 19v-7h8v7" /><circle cx="12" cy="15.5" r="1.4" fill={c} /><path d="M12 12V5" /></svg>
  if (m.includes('broadcast')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 19h18" /><circle cx="6" cy="14" r="1.3" fill={c} /><circle cx="11" cy="11" r="1.3" fill={c} /><circle cx="16" cy="14" r="1.3" fill={c} /><circle cx="9" cy="16.5" r="1.3" fill={c} /><circle cx="14" cy="16.5" r="1.3" fill={c} /><circle cx="19" cy="11" r="1.3" fill={c} /><path d="M4 8l3-4M8 6l2-3" /></svg>
  if (m.includes('side')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 19h18" /><path d="M12 19v-8M9 14l3-3 3 3" /><circle cx="6" cy="16.5" r="1.3" fill={c} /><circle cx="18" cy="16.5" r="1.3" fill={c} /></svg>
  if (m.includes('fertigation') || m.includes('drip') || m.includes('pivot')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 6h14a4 4 0 0 1 4 4v9" /><path d="M8 6v3M13 6v3" /><path d="M8 13c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5zM13 13c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5z" fill={c} stroke="none" /></svg>
  if (m.includes('spray') || m.includes('foliar') || m.includes('drone')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 20l6-6M8 10l6 6M6 13l2-2 5 5-2 2z" /><path d="M14 5l1 2M18 4l-1 2M20 8l-2 1M17 9l3 3" /></svg>
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>
}

/** A patchwork of small plots — the smallholder's countryside, drawn. */
export function Plots({ cols = 8, rows = 3, seed = 3, className = '' }: { cols?: number; rows?: number; seed?: number; className?: string }) {
  const pal = ['#2F6B3A', '#4F8A3E', '#6DA35C', '#D9A21B', '#7A5230', '#A9C7A0', '#C9A86A', '#8FB996']
  const cells = []
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  for (let i = 0; i < cols * rows; i++) cells.push(pal[Math.floor(rnd() * pal.length)])
  return (
    <div className={`plots ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} aria-hidden="true">
      {cells.map((c, i) => <i key={i} style={{ background: c, opacity: 0.85 }} />)}
    </div>
  )
}

/** Field rows — wheat lines drawn, sway when in view. */
export function FieldRows({ n = 9, height = 90, colour = '#2F6B3A', className = '' }: { n?: number; height?: number; colour?: string; className?: string }) {
  const w = 600
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={className} preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height }}>
      <rect x="0" y={height - 14} width={w} height="14" fill="#7A5230" opacity=".55" />
      {Array.from({ length: n }).map((_, i) => {
        const x = (w / n) * i + w / n / 2
        return (
          <g key={i} className="a-sway" style={{ animationDelay: `${(i % 4) * 0.35}s` }}>
            <path d={`M${x} ${height - 14} v-${height * 0.55}`} stroke={colour} strokeWidth="3" strokeLinecap="round" />
            <path d={`M${x} ${height - 14 - height * 0.3} c-10 -6 -16 -14 -18 -22`} stroke={colour} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d={`M${x} ${height - 14 - height * 0.4} c10 -6 16 -14 18 -22`} stroke={colour} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx={x} cy={height - 14 - height * 0.6} rx="5" ry="10" fill="#D9A21B" />
          </g>
        )
      })}
    </svg>
  )
}

/**
 * `compact` added 10 Sep 2026 for the About hero. The six stats used to sit in a full-width band of
 * their own below the fold; Tahir asked for them beside the headline instead, and six full-size
 * tiles will not go in half a hero. Same numbers, smaller type, and the sentence under each is
 * clamped to two lines so the six tiles stay one height. Every other caller is untouched.
 */
export function Stat({ v, l, tone, compact = false }: { v: string; l: string; tone?: 'green' | 'gold' | 'soil' | 'navy'; compact?: boolean }) {
  const col = tone === 'green' ? 'var(--green)' : tone === 'gold' ? '#B0841A' : tone === 'soil' ? 'var(--soil)' : 'var(--navy)'
  const big = v.length > 8 ? 'clamp(24px, 2.4vw, 32px)' : 'clamp(32px, 3.2vw, 42px)'
  const small = v.length > 8 ? 'clamp(17px, 1.5vw, 21px)' : 'clamp(20px, 1.9vw, 26px)'
  return (
    <div className={compact ? 'panel p-3' : 'panel p-5'}>
      {/* D-141: "About 50,000 t" (ruling 9) is too long to hold on one line in a half-width phone cell,
          so a value over 12 characters may wrap. Revert: always `num nowrap`. */}
      <div className={`num ${v.length > 12 ? '' : 'nowrap'}`} style={{ fontSize: compact ? small : big, color: col, lineHeight: v.length > 12 ? 1.1 : 1 }}>{v}</div>
      <div className={compact ? 'cap mt-1' : 'small mt-2'}
        style={compact
          ? { color: 'var(--muted)' } /* D-151 (QA 17): was clamped to 4 lines, which cut the About '23 brands' label mid-sentence */
          : { color: 'var(--muted)' }}>{l}</div>
    </div>
  )
}

export const ArrowR = () => <span aria-hidden="true">→</span>

/**
 * D-144, owner's ruling 1 (24 Sep 2026): a small, quiet tag on every crop with a live calculator,
 * in the crops index, the home crop picker, the menu search and the crop page itself. VAN green on
 * green-soft, no icon beyond a dot. `compact` drops the padding for tight rows.
 */
export function LiveCalcTag({ compact = false }: { compact?: boolean }) {
  return <span className={`live-calc${compact ? ' live-calc-sm' : ''}`}>Live calculator</span>
}

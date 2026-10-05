import { useEffect, useRef, useState } from 'react'
import { ABOUT } from '@/data/site'

/**
 * FARM, PLANT, LABORATORY — one drawing, 10 September 2026.
 *
 * Tahir: "we slide a slider in about page, VAN started with a research farm in 2009, a year before
 * the company. Slider should show not real pictures but something as we did in the VGreen website.
 * CLEAN BUT IT INDICATES A FARM BUILDING BESIDE INTO A MANUFACTURING R&D, CHEMISTRY AND SCIENCE."
 *
 * "SLIDER" MEANS WHAT IT MEANS ON VGREEN: a drawn scene, not a carousel of photographs. So this is
 * one continuous picture across the hero. The research farm is on the left, the plant in the middle,
 * the laboratory on the right, and one ground line runs under all three, because all three are one
 * site. A reader gets the whole company in a glance before he reads a sentence.
 *
 * THE SIX TIMELINE CARDS ARE IN HERE NOW. They were a separate section of six text boxes further
 * down, telling the same story a second time in prose. The years are the scene's rail: picking one
 * raises the part of the drawing it belongs to and puts its sentence underneath. The rail is the
 * time axis, the drawing is the place, which is why 2018 (Vital Green, carrying nutrition to the
 * field) points back to the left-hand end.
 *
 * MOTION IS SLOW AND SMALL, the treatment that worked on the VGreen Hubs hero: the crop shimmers,
 * the coating drum turns, grain climbs the belt, the flask fills and empties, the balance settles.
 * Nothing flies in and nothing slides. Two rules carried over from that build:
 *   · NO RADIATING SUN RAYS. They were tried there and rejected: they read as a child's drawing.
 *     The sun here is a plain disc with a halo.
 *   · An INFINITE animation still cycles under the global reduced-motion clamp, so every animation
 *     in this scene is switched off explicitly in its own media block in index.css.
 *
 * ON A PHONE the drawing pans sideways at a readable height rather than being squeezed into a 100px
 * strip where none of it can be made out. Tapping a year pans it to that part of the picture.
 */

const NAVY = '#14231A', GREEN = '#2F6B3A', GOLD = '#D9A21B', SOIL = '#7A5230', SAND = '#FBF9F3', SAND2 = '#F0EEE5', SKY = '#E6EEE8'
const FONT = 'Public Sans, system-ui, sans-serif'

type Zone = 'farm' | 'plant' | 'lab' | 'all'

/** Which part of the picture each year belongs to, and where to pan on a phone. */
/** One accent per tile, cycled. The site's own colours, so the rail reads as VAN and not as a rainbow. */
const SC_ACCENTS = ['var(--navy)', 'var(--green)', 'var(--gold)', 'var(--rust)']
// D-151 (QA 9): the year numbers as TEXT use the deeper shade of each accent (gold on white was 2.1:1).
const SC_TEXT = ['var(--navy)', 'var(--green-text)', 'var(--gold-text)', 'var(--rust-text)']   // VAN's four, nothing else (his ruling on the preview, 11 Sep)

const YEAR_ZONE: Record<string, Zone> = {
  '2007': 'plant',   // humic acid, made here. A material being made, so the plant end
  '2009': 'farm',
  '2010': 'plant',
  '2011': 'plant',   // the first blend
  '2012': 'plant',   // D-177: largest humic acid producer
  '2014': 'plant',   // the coated line, boron-coated nitro potash (and the soil baseline)
  '2015': 'farm',    // crop-specific, soil-specific
  '2017': 'farm',    // VAN's own shops, out towards the field
  '2019': 'plant',   // Vital Urea launched; Vital Green founded (was 2018)
  '2023': 'plant',   // potash from ash
  '2024': 'lab',
  '2026': 'all',     // D-173: patent, biological laboratory and the NP line
  Today: 'all',
}
const ZONE_X: Record<Zone, number> = { farm: 0, plant: 0.42, lab: 0.86, all: 0 }

/**
 * D-147: `exclude` drops years from the rail and `initial` picks the year shown first. The company
 * profile page leaves out 'Today', because that card carries the tonnage made a year and ruling 13
 * keeps every sales and capacity quantity off the public profile. With no props the About page is
 * unchanged. Revert: delete both props and the `rail` filter.
 */
/** D-173: `compact` draws only the plant and the laboratory (the right two thirds of the same picture),
 *  with no year rail. It is the About hero's drawing (Tahir 25 Sep: split hero, words left, drawing right;
 *  and the research farm's location is not stated, so the hero does not draw it). */
export function AboutScene({ exclude = [], initial = 'Today', compact = false }: { exclude?: string[]; initial?: string; compact?: boolean } = {}) {
  const rail = ABOUT.timeline.filter(t => !exclude.includes(t.year))
  const [year, setYear] = useState<string>(initial)
  const scroller = useRef<HTMLDivElement | null>(null)
  const first = useRef(true)
  const zone = YEAR_ZONE[year] ?? 'all'
  // D-147: a year outside the rail (the profile's empty start) shows no card; on About 'Today' is always there.
  const item = rail.find(t => t.year === year) ?? (year ? rail[rail.length - 1] : undefined)
  const dim = (z: Zone) => (compact || zone === 'all' || zone === z ? 1 : 0.32)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    const box = scroller.current
    if (!box || box.scrollWidth <= box.clientWidth) return
    const span = box.scrollWidth - box.clientWidth
    box.scrollTo({ left: Math.round(span * ZONE_X[zone]), behavior: 'smooth' })
  }, [year, zone])

  return (
    <div>
      <div ref={scroller} className="sc-wrap">
        {/* The viewBox starts at y=96, not 0: the drawing occupies 240 to 470 and the top third of
              the frame was empty sky doing nothing on a page whose whole complaint was wasted space. */}
        <svg viewBox={compact ? '560 150 1040 320' : '0 128 1600 342'} className="sc-svg" role="img"
          aria-label={compact ? 'A drawing of VAN: the plant and the laboratory.' : 'A drawing of VAN: the research farms on the left, the plant in the middle, the laboratory on the right.'}>
          <defs>
            <clipPath id="sc-flask"><path d="M1356 328h26v18l30 54a10 10 0 0 1-9 15h-68a10 10 0 0 1-9-15l30-54v-18z" /></clipPath>
          </defs>

          {/* The sun. A disc and a halo. No rays: they were tried on VGreen and read as a child's drawing. */}
          <circle cx="196" cy="196" r="46" fill="none" stroke={GOLD} strokeWidth="2" opacity=".22" />
          <circle cx="196" cy="196" r="30" fill={GOLD} opacity=".22" />

          {/* The ground all three sit on. */}
          <rect x="0" y="392" width="1600" height="78" fill={SAND2} />
          <line x1="0" y1="392" x2="1600" y2="392" stroke={NAVY} strokeWidth="2" opacity=".5" />

          {/* THE RESEARCH FARM */}
          <g opacity={dim('farm')} style={{ transition: 'opacity .4s' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1={64} y1={386 - i * 12} x2={476 - i * 26} y2={386 - i * 12} stroke={GREEN} strokeWidth="2" opacity={0.34 - i * 0.04} />
            ))}
            {Array.from({ length: 22 }, (_, i) => (
              <line key={i} className="sc-crop" x1={78 + i * 18} y1={386} x2={78 + i * 18} y2={366}
                stroke={GREEN} strokeWidth="2.4" opacity=".85" style={{ animationDelay: `${(i % 7) * 260}ms` }} />
            ))}
            {[214, 262].map(x => (
              <g key={x}>
                <line x1={x} y1="392" x2={x} y2="346" stroke={SOIL} strokeWidth="2.5" />
                <rect x={x - 3} y="332" width="26" height="15" rx="2" fill={GOLD} opacity=".85" stroke={SOIL} strokeWidth="1.5" />
              </g>
            ))}
            <polygon points="292,302 356,262 420,302" fill={SOIL} opacity=".8" />
            <rect x="300" y="302" width="112" height="90" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            <rect x="342" y="336" width="30" height="56" fill={SKY} stroke={NAVY} strokeWidth="2" />
            <line x1="118" y1="392" x2="118" y2="322" stroke={SOIL} strokeWidth="7" />
            <circle cx="118" cy="308" r="34" fill={GREEN} opacity=".78" />
            <circle cx="94" cy="326" r="21" fill={GREEN} opacity=".62" />
            <circle cx="142" cy="326" r="19" fill={GREEN} opacity=".62" />
          </g>

          {/* THE PLANT */}
          <g opacity={dim('plant')} style={{ transition: 'opacity .4s' }}>
            {[600, 660].map(x => (
              <g key={x}>
                <rect x={x} y="248" width="46" height="144" rx="4" fill={SAND2} stroke={NAVY} strokeWidth="2.5" />
                <path d={`M${x} 248 a23 15 0 0 1 46 0`} fill={SAND} stroke={NAVY} strokeWidth="2.5" />
                <line x1={x} y1="296" x2={x + 46} y2="296" stroke={NAVY} strokeWidth="1.5" opacity=".45" />
                <line x1={x} y1="340" x2={x + 46} y2="340" stroke={NAVY} strokeWidth="1.5" opacity=".45" />
              </g>
            ))}
            <line x1="718" y1="386" x2="814" y2="282" stroke={NAVY} strokeWidth="2.5" opacity=".7" />
            <circle cx="718" cy="386" r="7" fill="none" stroke={NAVY} strokeWidth="2.5" />
            <circle cx="814" cy="282" r="7" fill="none" stroke={NAVY} strokeWidth="2.5" />
            {[0, 1, 2, 3].map(i => (
              <rect key={i} className="sc-grain" x="714" y="380" width="9" height="9" rx="2" fill={GOLD}
                style={{ animationDelay: `${i * 1100}ms` }} />
            ))}
            {[0, 1, 2, 3].map(i => (
              <polygon key={i} points={`${824 + i * 62},278 ${824 + i * 62},248 ${886 + i * 62},278`} fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            ))}
            <rect x="824" y="278" width="248" height="114" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            {[0, 1, 2, 3].map(i => <rect key={i} x={850 + i * 58} y="308" width="32" height="42" fill={SKY} stroke={NAVY} strokeWidth="2" />)}
            <circle cx="1140" cy="336" r="46" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            <g className="sc-drum" style={{ transformOrigin: '1140px 336px' }}>
              {[0, 60, 120, 180, 240, 300].map(a => (
                <line key={a} x1="1140" y1="336" x2="1140" y2="300" stroke={SOIL} strokeWidth="3" opacity=".7" transform={`rotate(${a} 1140 336)`} />
              ))}
            </g>
            <circle cx="1140" cy="336" r="8" fill={NAVY} opacity=".8" />
            <path d="M1102 380 l16 -22 M1178 380 l-16 -22" stroke={NAVY} strokeWidth="2.5" fill="none" />
            <rect x="1206" y="356" width="34" height="36" rx="4" fill={GREEN} opacity=".8" stroke={NAVY} strokeWidth="2" />
            <rect x="1246" y="356" width="34" height="36" rx="4" fill={GOLD} opacity=".85" stroke={NAVY} strokeWidth="2" />
            <rect x="1226" y="318" width="34" height="36" rx="4" fill={SAND} stroke={NAVY} strokeWidth="2" />
          </g>

          {/* THE LABORATORY */}
          <g opacity={dim('lab')} style={{ transition: 'opacity .4s' }}>
            <rect x="1330" y="248" width="252" height="144" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            <rect x="1330" y="248" width="252" height="16" fill={NAVY} opacity=".8" />
            {[0, 1, 2, 3].map(i => <rect key={i} x={1352 + i * 60} y="282" width="38" height="46" fill={SKY} stroke={NAVY} strokeWidth="2" />)}
            <g transform="translate(1456 186)">
              <polygon points="0,-34 29,-17 29,17 0,34 -29,17 -29,-17" fill="none" stroke={NAVY} strokeWidth="2.5" opacity=".8" />
              {[[0, -34], [29, -17], [29, 17], [0, 34], [-29, 17], [-29, -17]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5.5" fill={i % 2 ? GREEN : GOLD} stroke={NAVY} strokeWidth="1.6" />
              ))}
            </g>
            {/* D-151 (QA 14): the flask is lifted 18 units so it no longer sits on "THE LABORATORY". Revert: drop the <g transform>. */}
            <g transform="translate(0 -18)">
            <path d="M1356 328h26v18l30 54a10 10 0 0 1-9 15h-68a10 10 0 0 1-9-15l30-54v-18z" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
            <g clipPath="url(#sc-flask)">
              <rect className="sc-liquid" x="1320" y="372" width="120" height="70" fill={GREEN} opacity=".55" />
            </g>
            <line x1="1352" y1="328" x2="1386" y2="328" stroke={NAVY} strokeWidth="3" />
            </g>
            <rect x="1468" y="376" width="56" height="16" rx="3" fill={SAND2} stroke={NAVY} strokeWidth="2.5" />
            <line x1="1496" y1="376" x2="1496" y2="342" stroke={NAVY} strokeWidth="2.5" />
            <g className="sc-beam" style={{ transformOrigin: '1496px 342px' }}>
              <line x1="1460" y1="342" x2="1532" y2="342" stroke={NAVY} strokeWidth="2.5" />
              <path d="M1448 342 h24 l-12 16 z" fill={GOLD} opacity=".8" stroke={NAVY} strokeWidth="1.6" />
              <path d="M1520 342 h24 l-12 16 z" fill={SAND} stroke={NAVY} strokeWidth="1.6" />
            </g>
          </g>

          {/* Three names, so the picture explains itself without a caption under it. */}
          <g className="sc-lbl" fontSize="17" fontWeight="800" letterSpacing="2.4" fill={NAVY} opacity=".8" style={{ fontFamily: FONT }}>
            <text x="64" y="428" opacity={dim('farm')}>RESEARCH FARMS</text>
            <text x="600" y="428" opacity={dim('plant')}>THE PLANT</text>
            <text x="1582" y="428" textAnchor="end" opacity={dim('lab')}>THE LABORATORY</text>
          </g>
          <g className="sc-cap" fontSize="16.5" fontWeight="600" fill="#5B6A5E" style={{ fontFamily: FONT }}>{/* D-151: was fill={NAVY} opacity=".45" (2.5:1) */}
            <text x="64" y="452" opacity={dim('farm')}>2009 · trials every season since</text>
            <text x="600" y="452" opacity={dim('plant')}>2010 · company incorporated, land bought</text>
            <text x="1582" y="452" textAnchor="end" opacity={dim('lab')}>2024 · PNAC accredited, LAB 336</text>
          </g>
        </svg>
      </div>

      {!compact && <>
      {/* The ten years on ONE line. 11 Sep 2026, Tahir: "put the journey facts in one line, smart
          interactive colourful tabs." The grid used to wrap the tenth tile onto a second row on a
          laptop. Now one row of ten on desktop, each tile carrying its own accent, and a scrolling
          strip with a fade below 1024px rather than a wrap. */}
      <div className="sc-rail tbl-scroll" role="tablist" aria-label="VAN by year" style={{ gridTemplateColumns: `repeat(${rail.length}, minmax(0, 1fr))` }}>
        {rail.map((t, i) => {
          const on = t.year === year
          return (
            <button key={t.year} role="tab" aria-selected={on} className={`sc-year ${on ? 'on' : ''}`} style={{ ['--sc-accent' as string]: SC_ACCENTS[i % SC_ACCENTS.length], ['--sc-text' as string]: SC_TEXT[i % SC_TEXT.length] }} onClick={() => setYear(t.year)}>
              <span className="num">{t.year}</span>
              <span className="cap">{t.title}</span>
            </button>
          )
        })}
      </div>

      <div className="panel-soft p-4 lg:p-5 mt-3" style={{ minHeight: 96 }}>
        {item ? (
          <>
            <span className="num mr-2" style={{ color: 'var(--green-text)', fontWeight: 700 }}>{item.year}</span>
            <b style={{ color: 'var(--navy)' }}>{item.title}</b>
            <p className="small mt-1 max-w-[140ch]">{item.text}</p>
          </>
        ) : (
          // D-147: with no year picked yet (the profile page), the whole drawing stays lit and this says what to do.
          <>
            <b style={{ color: 'var(--navy)' }}>{rail[0]?.year} to {rail[rail.length - 1]?.year}</b>
            <p className="small mt-1 max-w-[140ch]">Pick a year to read what happened.</p>
          </>
        )}
      </div>
      </>}
    </div>
  )
}

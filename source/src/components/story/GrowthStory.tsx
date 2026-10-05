import { useEffect, useRef } from 'react'
import { ABOUT } from '@/data/site'
import { useStepper } from './useStepper'

/**
 * THE GROWTH STORY — top of the About page. D-178, 26 Sep 2026.
 *
 * Tahir: "show building from a farm to factory, from one small plant to large buildings, new equipment,
 * from few people to 150 people, something more powerful that shows transformation." His answers the
 * same day: top of the About page, the rest of the page below it unchanged; the milestones in
 * ABOUT.timeline (D-177); "more than 150 people today" and no team figure for earlier years; the plant
 * story as "land purchased 2010, building started 2011", lines added in the order water-soluble, liquid,
 * granular, coated (2014), compounded, then the biologicals.
 *
 * One drawing that fills in year by year, in the same hand as the About and Lab scenes (same palette,
 * same ground line, no photographs). Every element appears in the year the timeline gives it and not
 * before. The people along the ground grow in number without a figure: only "Today" carries one, the
 * figure he gave. The line order is shown as an order, not with invented years.
 */
const NAVY = '#14231A', GREEN = '#2F6B3A', GOLD = '#D9A21B', RUST = '#9C4E2A', SAND = '#FBF9F3', SAND2 = '#F0EEE5', SKY = '#E6EEE8', SOIL = '#7A5230'
const FONT = 'Public Sans, system-ui, sans-serif'
const yr = (y: string) => (y === 'Today' ? 2027 : Number(y))
/** People drawn along the ground at each year. A drawing, not a headcount: only Today has a number. */
const PEOPLE: [number, number][] = [[2011, 1], [2012, 2], [2014, 4], [2015, 5], [2017, 7], [2019, 9], [2023, 11], [2024, 12], [2026, 13], [2027, 16]]
/** Where in the drawing each year's change sits, so a phone (which pans the drawing) scrolls to it. */
const FOCUS_X: Record<string, number> = { '2007': 390, '2009': 180, '2010': 640, '2011': 550, '2012': 660, '2014': 700, '2015': 180, '2017': 1100, '2019': 820, '2023': 680, '2024': 960, '2026': 540, Today: 640 }
const LINES_ORDER = ['Water-soluble', 'Liquid', 'Granular', 'Coated (2014)', 'Compounded', 'then the biological laboratory (2026)']

export function GrowthStory() {
  const T = ABOUT.timeline
  const { ref, i, setI, playing, toggle } = useStepper(T.length, 2700)
  const now = yr(T[i].year)
  const on = (y: number) => now >= y
  const g = (y: number) => ({ className: `gs-el ${on(y) ? 'on' : ''}` })
  const people = PEOPLE.filter(([y]) => now >= y).pop()?.[1] ?? 0
  const cur = T[i]
  const pan = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const c = chips.current, b = c?.children[i] as HTMLElement | undefined
    if (c && b && c.scrollWidth > c.clientWidth) c.scrollTo({ left: b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' })
  }, [i])
  useEffect(() => {
    const w = pan.current
    if (!w || w.scrollWidth <= w.clientWidth + 4) return
    const x = (FOCUS_X[cur.year] ?? 600) / 1200 * w.scrollWidth - w.clientWidth / 2
    w.scrollTo({ left: Math.max(0, x), behavior: 'smooth' })
  }, [cur.year])

  return (
    <div ref={ref} className="gs">
      <div className="gs-stage">
        <div className="sc-wrap" ref={pan}>
          <svg viewBox="0 150 1200 330" className="sc-svg gs-svg" role="img"
            aria-label={`A drawing of VAN growing year by year, now showing ${cur.year}: ${cur.title}.`}>
            {/* sky and ground */}
            <rect x="0" y="150" width="1200" height="240" fill={SAND} />
            <rect x="0" y="390" width="1200" height="90" fill={SAND2} />
            <line x1="0" y1="390" x2="1200" y2="390" stroke={NAVY} strokeWidth="2" opacity=".5" />
            {/* the road the plant is reached by */}
            <g {...g(2010)}><path d="M430 450 H1190" stroke={NAVY} strokeWidth="2" strokeDasharray="14 10" opacity=".35" /></g>

            {/* ── RESEARCH FARM, 2009 → soil baseline 2014 → crop- and soil-specific plots 2015 ── */}
            <g {...g(2009)}>
              {[0, 1, 2].map(b => (
                <rect key={b} x={30 + b * 100} y="376" width="96" height="14" fill={on(2015) ? [GREEN, GOLD, SOIL][b] : GREEN} opacity={on(2015) ? 0.35 : 0.18} />
              ))}
              {Array.from({ length: 13 }, (_, k) => 44 + k * 23).map((x, k) => (
                <g key={x} className="gs-crop" style={{ animationDelay: `${(k % 5) * 0.3}s` }}>
                  <path d={`M${x} 390 V${340 - (k % 3) * 8}`} stroke={GREEN} strokeWidth="3" />
                  <path d={`M${x} ${366 - (k % 3) * 4} q-10 -6 -16 -2 M${x} ${356 - (k % 3) * 6} q10 -6 16 -2 M${x} ${346 - (k % 3) * 7} q-9 -5 -14 -1`} stroke={GREEN} strokeWidth="2.4" fill="none" />
                  {k % 2 === 0 && <ellipse cx={x + 4} cy={352 - (k % 3) * 6} rx="3.5" ry="8" fill={GOLD} stroke={NAVY} strokeWidth="1" />}
                </g>
              ))}
            </g>
            <g {...g(2014)}>
              {[70, 170, 270].map(x => (
                <g key={x}><line x1={x} y1="392" x2={x} y2="356" stroke={NAVY} strokeWidth="2" /><path d={`M${x} 356 h16 l-4 6 l4 6 h-16`} fill={RUST} /></g>
              ))}
            </g>

            {/* ── THE FOUNDER'S HUMIC ACID, 2007: a shed and a pot ── */}
            <g {...g(2007)}>
              <path d="M352 390 V330 L392 306 L432 330 V390 Z" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <rect x="372" y="352" width="40" height="38" fill={SAND2} stroke={NAVY} strokeWidth="2" />
              <path d="M378 352 q14 -16 28 0" fill={SOIL} opacity=".8" />
              <path d="M386 340 q-4 -8 2 -14 M398 338 q4 -9 -2 -16" stroke={NAVY} strokeWidth="1.8" fill="none" opacity=".5" className="gs-steam" />
            </g>

            {/* ── THE PLANT: land 2010, building 2011, humic tanks 2012, coating tower 2014, Vital Urea silo 2019,
                ash recovery 2023, biological laboratory 2026 ── */}
            <g {...g(2010)}>
              <rect x="458" y="250" width="420" height="140" fill="none" stroke={NAVY} strokeWidth="1.6" strokeDasharray="6 7" opacity=".45" />
              <g opacity={on(2011) ? 0 : 1} style={{ transition: 'opacity .6s' }}>
                <line x1="470" y1="390" x2="470" y2="350" stroke={NAVY} strokeWidth="2" /><path d="M470 350 h26 v14 h-26" fill={GOLD} stroke={NAVY} strokeWidth="1.5" />
                <text x="504" y="362" fontSize="15" fontWeight="700" fill={NAVY} style={{ fontFamily: FONT }}>land bought</text>
              </g>
            </g>
            <g {...g(2011)}>
              <rect x="474" y="306" width="150" height="84" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <path d="M468 306 L549 276 L630 306 Z" fill={NAVY} opacity=".85" />
              <rect x="532" y="344" width="34" height="46" fill={SKY} stroke={NAVY} strokeWidth="2" />
              <rect x="490" y="322" width="28" height="18" fill={SKY} stroke={NAVY} strokeWidth="1.6" />
              <rect x="580" y="322" width="28" height="18" fill={SKY} stroke={NAVY} strokeWidth="1.6" />
            </g>
            <g {...g(2012)}>
              {[640, 670].map(x => (
                <g key={x}><rect x={x} y="318" width="24" height="72" rx="12" fill={SOIL} opacity=".8" stroke={NAVY} strokeWidth="2" /><line x1={x + 4} y1="340" x2={x + 20} y2="340" stroke={SAND} strokeWidth="2" opacity=".6" /></g>
              ))}
            </g>
            <g {...g(2014)}>
              <rect x="706" y="252" width="56" height="138" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <rect x="700" y="244" width="68" height="12" fill={GOLD} stroke={NAVY} strokeWidth="2" />
              <circle cx="734" cy="300" r="17" fill={SAND2} stroke={NAVY} strokeWidth="2.2" />
              <g className="gs-drum" style={{ transformOrigin: '734px 300px' }}><path d="M734 283 V317 M717 300 H751" stroke={NAVY} strokeWidth="2" /></g>
              <rect x="720" y="344" width="28" height="46" fill={SKY} stroke={NAVY} strokeWidth="2" />
            </g>
            <g {...g(2019)}>
              <rect x="778" y="286" width="44" height="104" rx="4" fill={SAND2} stroke={NAVY} strokeWidth="2.4" />
              <path d="M778 290 q22 -26 44 0" fill={GOLD} stroke={NAVY} strokeWidth="2.2" />
              {[0, 1, 2].map(r => [0, 1].map(c => <rect key={`${r}${c}`} x={830 + c * 22 + (r % 2) * 11} y={376 - r * 13} width="20" height="12" rx="2" fill={GOLD} stroke={NAVY} strokeWidth="1.3" />))}
            </g>
            <g {...g(2023)}>
              <path d="M628 390 q18 -26 40 0 Z" fill="#9C9486" stroke={NAVY} strokeWidth="1.6" />
              <path d="M660 390 l14 -24 h22 l12 24 Z" fill={SAND} stroke={NAVY} strokeWidth="2" />
              <text x="685" y="384" textAnchor="middle" fontSize="13" fontWeight="800" fill={GREEN} style={{ fontFamily: FONT }}>K</text>
            </g>
            <g {...g(2026)}>
              <rect x="474" y="262" width="100" height="44" fill={SAND} stroke={NAVY} strokeWidth="2.2" />
              <rect x="474" y="256" width="100" height="10" fill={GREEN} stroke={NAVY} strokeWidth="1.8" />
              <path d={`M498 296 h10 v-14 l6 -8 h-2 v-4 h-8 v4 h-2 l6 8`} fill="none" stroke={GREEN} strokeWidth="1.8" />
              <circle cx="545" cy="284" r="9" fill="none" stroke={GREEN} strokeWidth="1.8" /><circle cx="545" cy="284" r="3" fill={GREEN} />
              <circle cx="606" cy="268" r="16" fill={GOLD} stroke={NAVY} strokeWidth="2" />
              <path d="M600 268 l4 5 l9 -10" fill="none" stroke={NAVY} strokeWidth="2.4" />
            </g>

            {/* ── THE ACCREDITED LABORATORY, 2024 ── */}
            <g {...g(2024)}>
              <rect x="908" y="300" width="120" height="90" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <rect x="908" y="300" width="120" height="12" fill={NAVY} opacity=".85" />
              <path d="M944 372 h18 M950 334 h6 v12 l12 20 a4 4 0 0 1 -4 6 h-22 a4 4 0 0 1 -4 -6 l12 -20 z" fill={SKY} stroke={NAVY} strokeWidth="1.8" />
              <rect x="980" y="326" width="36" height="20" rx="3" fill={GREEN} />
              <text x="998" y="340" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" style={{ fontFamily: FONT }}>336</text>
            </g>

            {/* ── VAN'S OWN SHOP, 2017, and Vital Green on the road, 2019 ── */}
            <g {...g(2017)}>
              <rect x="1068" y="320" width="104" height="70" fill={SAND} stroke={NAVY} strokeWidth="2.4" />
              <path d="M1062 320 h116 l-8 -18 h-100 Z" fill={GREEN} stroke={NAVY} strokeWidth="2" />
              {[0, 1, 2, 3, 4].map(k => <path key={k} d={`M${1070 + k * 20} 320 q10 12 20 0`} fill={k % 2 ? SAND : GREEN} stroke={NAVY} strokeWidth="1.4" />)}
              <rect x="1104" y="346" width="30" height="44" fill={SKY} stroke={NAVY} strokeWidth="2" />
            </g>
            <g {...g(2019)}>
              <g className="gs-truck">
                <rect x="930" y="428" width="50" height="20" rx="3" fill={GREEN} stroke={NAVY} strokeWidth="2" />
                <path d="M980 434 h14 l9 8 v6 h-23 Z" fill={SAND} stroke={NAVY} strokeWidth="2" />
                <circle cx="944" cy="450" r="5" fill={NAVY} /><circle cx="992" cy="450" r="5" fill={NAVY} />
              </g>
            </g>

            {/* ── PEOPLE: a drawing, not a headcount ── */}
            {Array.from({ length: 16 }, (_, k) => 480 + k * 26).map((x, k) => (
              <g key={x} className={`gs-el ${k < people ? 'on' : ''}`} style={{ transitionDelay: `${(k % 4) * 60}ms` }}>
                <circle cx={x} cy="402" r="5" fill={NAVY} />
                <path d={`M${x - 6} 424 q6 -18 12 0`} fill={[NAVY, GREEN, RUST, GOLD][k % 4]} />
              </g>
            ))}
            {now === 2027 && <text x="892" y="404" fontSize="16" fontWeight="800" fill={NAVY} style={{ fontFamily: FONT }}>more than 150 people</text>}

            {/* place names */}
            <g fontSize="14" fontWeight="800" letterSpacing="2" fill={NAVY} opacity=".7" style={{ fontFamily: FONT }}>
              <text x="30" y="470" className={`gs-el ${on(2009) ? 'on' : ''}`}>RESEARCH FARMS</text>
              <text x="352" y="470" className={`gs-el ${on(2007) ? 'on' : ''}`}>2007</text>
              <text x="474" y="470" className={`gs-el ${on(2011) ? 'on' : ''}`}>THE PLANT</text>
              <text x="908" y="470" className={`gs-el ${on(2024) ? 'on' : ''}`}>LAB 336</text>
              <text x="1188" y="470" textAnchor="end" className={`gs-el ${on(2017) ? 'on' : ''}`}>VAN SHOPS</text>
            </g>
          </svg>
        </div>

        {/* Every year's card is laid in the same cell, so the box is always as tall as the longest one and
            the page below does not jump while it plays. Only the current one is visible. */}
        <div className="gs-card" aria-live={playing ? 'off' : 'polite'}>
          {T.map((t, k) => (
            <div key={t.year} className={`gs-cell ${k === i ? 'on' : ''}`} aria-hidden={k !== i}>
              <div className="gs-year num">{t.year}</div>
              <div>
                <h2 className="gs-title">{t.title}</h2>
                <p className="gs-text">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gs-controls">
        <button className="gs-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play the years'}>
          {playing
            ? <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor" /><rect x="14" y="5" width="4" height="14" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5 L19 12 L7 19 Z" fill="currentColor" /></svg>}
        </button>
        <div className="gs-years" ref={chips} aria-label="Years">
          {T.map((t, k) => (
            <button key={t.year} aria-pressed={k === i} className={`gs-y ${k === i ? 'on' : ''} ${k < i ? 'past' : ''}`} onClick={() => setI(k)}>
              <span className="gs-dot" aria-hidden="true" />{t.year}
            </button>
          ))}
        </div>
      </div>
      <p className="gs-lines"><b>Production lines added, in order:</b> {LINES_ORDER.slice(0, -1).join(' → ')}, {LINES_ORDER[LINES_ORDER.length - 1]}.</p>
    </div>
  )
}

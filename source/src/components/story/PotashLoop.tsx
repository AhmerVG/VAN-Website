import { useEffect, useRef } from 'react'
import { useStepper } from './useStepper'

/**
 * THE POTASH LOOP — top of the Circular economy page. D-179, 26 Sep 2026.
 *
 * Tahir: "where is the circularity and whole story of potash recovery hidden? ... make someone land in the
 * field and feel what is grown, like corn, removes potash from soil, harvested, goes to the boiler, becomes
 * ash, we bring the ash, recover potash, and how Pakistan ..." His answers the same day: draw corn but say
 * "crop residue" in the text; yes, Pakistan has no potash mine in production and imports its potash.
 *
 * Every figure below is already on the site: 40 to 61 kg K₂O removed per acre a year against 0.6 kg applied
 * (Why Pakistan must shift / soil pages, FAOSTAT and the review cited there); 10 t of ash per 1 t of potash,
 * 3,000 t of ash processed, about 20% of VAN's potash intake, about 300 t of imported potash replaced
 * 2023-2026, 500 t a year planned for 2027, PCSIR heavy-metal screening (the ash page, CIRCULAR_ASH).
 * The drawing moves a potassium mark (K) from the soil round the loop and back.
 */
const NAVY = '#14231A', GREEN = '#2F6B3A', GOLD = '#D9A21B', RUST = '#9C4E2A', SAND = '#FBF9F3', SAND2 = '#F0EEE5', SKY = '#E6EEE8', SOIL = '#7A5230', ASH = '#9C9486'
const FONT = 'Public Sans, system-ui, sans-serif'

const STEPS: { chip: string; h: string; p: string; k: [number, number]; soil: number; x: number }[] = [
  { chip: 'The field', h: 'A crop takes potassium out of the soil', p: 'Every crop draws potassium from the ground it grows in. Pakistani cropping removes 40 to 61 kg of K₂O per acre every year. Farmers apply about 0.6 kg.', k: [170, 356], soil: 0.85, x: 170 },
  { chip: 'Harvest', h: 'The harvest carries it away', p: 'The grain goes to market. The crop residue leaves the field too, and the potassium in it goes with it.', k: [382, 286], soil: 0.5, x: 380 },
  { chip: 'Boiler', h: 'The residue fires a boiler', p: 'Crop residue is burned as fuel in bio-power boilers. Burning takes the carbon and the water. The minerals stay behind.', k: [540, 250], soil: 0.5, x: 540 },
  { chip: 'Ash', h: 'The potassium ends up in the ash', p: 'The potassium and silicon the crop took from the soil are left concentrated in the crop residue ash.', k: [672, 316], soil: 0.5, x: 670 },
  { chip: 'Recovery', h: 'VAN brings the ash back and recovers the potash', p: 'VAN assays every batch of ash for potassium and silicon and sends it to PCSIR, a government laboratory, for heavy-metal screening. Then it extracts the potassium: about 1 tonne of potash from every 10 tonnes of ash. 3,000 t of ash has been processed so far.', k: [852, 262], soil: 0.5, x: 850 },
  { chip: 'Fertilizer', h: 'It goes into VAN’s fertilizer', p: 'The recovered potassium is a raw material in VAN’s own manufacturing, in place of imported potash, held to the same guaranteed analysis. About 1 in 5 tonnes of the potash VAN uses now comes from ash.', k: [535, 98], soil: 0.5, x: 700 },
  { chip: 'Back to the field', h: 'And back onto the field', p: 'The potassium the crop took out of the soil goes back into it. Burning removed the carbon. VAN recovers the minerals.', k: [170, 352], soil: 0.8, x: 170 },
  { chip: 'Pakistan', h: 'Pakistan imports its potash', p: 'Pakistan has no potash mine in production, so each tonne VAN recovers replaces a tonne of imported potash. Between 2023 and 2026 VAN replaced about 300 t of imported potash. The line being built for 2027 will recover 500 t a year from 5,000 t of ash.', k: [852, 262], soil: 0.8, x: 1080 },
]

export function PotashLoop() {
  const { ref, i, setI, playing, toggle } = useStepper(STEPS.length, 3400)
  const st = STEPS[i]
  const pan = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const c = chips.current, b = c?.children[i] as HTMLElement | undefined
    if (c && b && c.scrollWidth > c.clientWidth) c.scrollTo({ left: b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' })
  }, [i])
  useEffect(() => {
    const w = pan.current
    if (!w || w.scrollWidth <= w.clientWidth + 4) return
    w.scrollTo({ left: Math.max(0, st.x / 1200 * w.scrollWidth - w.clientWidth / 2), behavior: 'smooth' })
  }, [st.x])
  const lit = (k: number) => `pl-st ${i === k ? 'on' : ''} ${i > k ? 'past' : ''}`

  return (
    <div ref={ref} className="gs">
      <div className="gs-stage">
        <div className="sc-wrap" ref={pan}>
          <svg viewBox="0 20 1200 420" className="sc-svg gs-svg" role="img"
            aria-label={`The potash loop: from the field, through the harvest, a boiler and its ash, to VAN's recovery and back to the field. Now showing: ${st.h}.`}>
            <rect x="0" y="20" width="1200" height="310" fill={SAND} />
            <rect x="0" y="330" width="1000" height="110" fill={SAND2} />
            <rect x="1000" y="330" width="200" height="110" fill={SKY} />
            <line x1="0" y1="330" x2="1000" y2="330" stroke={NAVY} strokeWidth="2" opacity=".5" />
            <path d="M1000 348 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke={NAVY} strokeWidth="1.5" fill="none" opacity=".3" />

            {/* the loop: forward along the ground, back over the top */}
            <path d="M170 318 H380 L540 300 L672 318 H852" stroke={GOLD} strokeWidth="3" strokeDasharray="9 8" fill="none" opacity=".75" />
            <path d="M852 226 C 760 30, 300 30, 170 238" stroke={GREEN} strokeWidth="3" strokeDasharray="9 8" fill="none" opacity={i >= 5 ? 0.85 : 0.25} style={{ transition: 'opacity .8s' }} />
            <path d="M178 226 l-8 14 l-4 -16" stroke={GREEN} strokeWidth="3" fill="none" opacity={i >= 5 ? 0.85 : 0.25} />

            {/* 1 · THE FIELD: corn, and the potassium in the soil below it */}
            <g className={lit(0)}>
              {Array.from({ length: 11 }, (_, k) => 50 + k * 24).map((x, k) => {
                const cut = i >= 1 && i < 6
                return (
                  <g key={x} className={cut ? '' : 'gs-crop'} style={{ animationDelay: `${(k % 5) * 0.3}s` }}>
                    {cut
                      ? <path d={`M${x} 330 v-10`} stroke={SOIL} strokeWidth="3" />
                      : <>
                        <path d={`M${x} 330 V${262 - (k % 3) * 8}`} stroke={GREEN} strokeWidth="3" />
                        <path d={`M${x} ${306 - (k % 3) * 4} q-11 -7 -18 -2 M${x} ${294 - (k % 3) * 5} q11 -7 18 -2 M${x} ${280 - (k % 3) * 6} q-10 -6 -16 -1 M${x} ${268 - (k % 3) * 7} q9 -6 14 -1`} stroke={GREEN} strokeWidth="2.4" fill="none" />
                        <ellipse cx={x + 5} cy={286 - (k % 3) * 5} rx="4" ry="10" fill={GOLD} stroke={NAVY} strokeWidth="1" />
                      </>}
                  </g>
                )
              })}
              <rect x="40" y="398" width="270" height="14" rx="7" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
              <rect x="42" y="400" width={266 * st.soil} height="10" rx="5" fill={GREEN} style={{ transition: 'width 1.2s ease' }} />
              <text x="40" y="388" fontSize="14" fontWeight="700" fill={NAVY} style={{ fontFamily: FONT }}>Potassium in the soil</text>
            </g>

            {/* 2 · HARVEST: a trailer of residue */}
            <g className={lit(1)}>
              <path d="M338 300 h86 l-8 -26 h-70 Z" fill={GOLD} stroke={NAVY} strokeWidth="2" />
              {[350, 364, 378, 392, 406].map(x => <path key={x} d={`M${x} 276 l6 -14`} stroke={SOIL} strokeWidth="2.5" />)}
              <rect x="334" y="300" width="94" height="12" fill={SAND2} stroke={NAVY} strokeWidth="2" />
              <circle cx="360" cy="318" r="9" fill={NAVY} /><circle cx="404" cy="318" r="9" fill={NAVY} />
            </g>

            {/* 3 · THE BOILER */}
            <g className={lit(2)}>
              <rect x="480" y="240" width="120" height="90" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <rect x="566" y="150" width="22" height="90" fill={SAND2} stroke={NAVY} strokeWidth="2.2" />
              <circle cx="530" cy="286" r="20" fill={RUST} opacity=".25" stroke={NAVY} strokeWidth="2" />
              <path d="M522 296 q8 -24 8 -30 q6 12 10 18 q4 -6 2 -14 q10 12 4 26 Z" fill={RUST} className="pl-flame" />
              <g className="pl-smoke"><circle cx="577" cy="134" r="8" fill={ASH} opacity=".5" /><circle cx="590" cy="116" r="11" fill={ASH} opacity=".35" /><circle cx="606" cy="96" r="14" fill={ASH} opacity=".2" /></g>
            </g>

            {/* 4 · THE ASH */}
            <g className={lit(3)}>
              <path d="M628 330 q44 -54 88 0 Z" fill={ASH} stroke={NAVY} strokeWidth="2" />
              {[648, 664, 684, 700].map((x, k) => <circle key={x} cx={x} cy={318 - (k % 2) * 8} r="2.5" fill={SAND} />)}
            </g>

            {/* 5 · VAN: tested, then recovered */}
            <g className={lit(4)}>
              <rect x="770" y="230" width="170" height="100" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
              <path d="M764 230 L855 196 L946 230 Z" fill={NAVY} opacity=".85" />
              <path d="M790 330 v-40 h26 v40" fill={SKY} stroke={NAVY} strokeWidth="2" />
              <path d="M836 270 h36 l-10 24 h-16 Z" fill={SAND2} stroke={NAVY} strokeWidth="2" />
              <path d="M854 294 v18" stroke={NAVY} strokeWidth="2" />
              <rect x="842" y="312" width="24" height="14" rx="2" fill={GREEN} opacity=".7" stroke={NAVY} strokeWidth="1.5" />
              <path d="M896 284 h14 M900 262 h6 v10 l8 12 a3 3 0 0 1 -3 4 h-16 a3 3 0 0 1 -3 -4 l8 -12 z" fill={SKY} stroke={NAVY} strokeWidth="1.6" />
              <text x="855" y="222" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" style={{ fontFamily: FONT }}>VAN</text>
              <text x="855" y="352" textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY} opacity=".8" style={{ fontFamily: FONT }}>10 t ash → 1 t potash</text>
            </g>

            {/* 6 · INTO FERTILIZER: a bag at the top of the loop */}
            <g className={lit(5)}>
              <path d="M510 60 h50 l4 6 v42 l-4 6 h-50 l-4 -6 v-42 Z" fill={GOLD} stroke={NAVY} strokeWidth="2" />
              <text x="535" y="92" textAnchor="middle" fontSize="15" fontWeight="800" fill={NAVY} style={{ fontFamily: FONT }}>K</text>
            </g>

            {/* 8 · PAKISTAN: the import ship that each recovered tonne replaces */}
            <g className={lit(7)} style={{ opacity: i === 7 ? 1 : 0.55, transition: 'opacity .8s' }}>
              <path d="M1030 368 h130 l-16 22 h-100 Z" fill={NAVY} opacity={i === 7 ? 0.35 : 0.85} style={{ transition: 'opacity 1s' }} />
              <rect x="1062" y="344" width="56" height="24" fill={RUST} opacity={i === 7 ? 0.3 : 0.8} stroke={NAVY} strokeWidth="1.5" style={{ transition: 'opacity 1s' }} />
              <text x="1100" y="420" textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY} style={{ fontFamily: FONT }}>imported potash</text>
              {i === 7 && <path d="M1050 336 L1150 396 M1150 336 L1050 396" stroke={GREEN} strokeWidth="4" opacity=".8" />}
            </g>

            {/* the potassium itself, moving round the loop */}
            <g style={{ transform: `translate(${st.k[0]}px, ${st.k[1]}px)`, transition: 'transform 1.3s cubic-bezier(.5,0,.3,1)' }}>
              <circle r="15" fill={GREEN} stroke="#fff" strokeWidth="3" />
              <text y="5.5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" style={{ fontFamily: FONT }}>K</text>
            </g>
          </svg>
        </div>
        <div className="gs-card" aria-live={playing ? 'off' : 'polite'}>
          {STEPS.map((s, k) => (
            <div key={s.chip} className={`gs-cell ${k === i ? 'on' : ''}`} aria-hidden={k !== i}>
              <div className="gs-year num">{k + 1}<span className="pl-of">/{STEPS.length}</span></div>
              <div>
                <h3 className="gs-title">{s.h}</h3>
                <p className="gs-text">{s.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="gs-controls">
        <button className="gs-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play the loop'}>
          {playing
            ? <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor" /><rect x="14" y="5" width="4" height="14" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5 L19 12 L7 19 Z" fill="currentColor" /></svg>}
        </button>
        <div className="gs-years" ref={chips} aria-label="Steps">
          {STEPS.map((s, k) => (
            <button key={s.chip} aria-pressed={k === i} className={`gs-y ${k === i ? 'on' : ''} ${k < i ? 'past' : ''}`} onClick={() => setI(k)}>
              <span className="gs-dot" aria-hidden="true" />{s.chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

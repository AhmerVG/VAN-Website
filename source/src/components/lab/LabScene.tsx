/**
 * THE LAB HERO SCENE — D-167, 25 Sep 2026.
 *
 * Tahir, 11 Sep (D-112): company pages get a drawn scene like About. 25 Sep: "BUILT IT."
 *
 * The drawing is the blind chain as a place, left to right, in the same hand as AboutScene (same
 * palette, same ground line, same stroke weights, no photographs, no radiating anything):
 *   your parcel, with your name on it (gold tag)
 *   → Sample Reception, a separate building, where the name tag comes off and a code goes on (rust)
 *   → a coded parcel travelling to the laboratory (navy)
 *   → the laboratory: a retained portion kept back, 2 analysts working independently (A and B)
 *   → your report, a PDF on your phone (his ruling: digital only, WhatsApp and email).
 * The labels under it name the four places, so it explains itself without a caption.
 *
 * Motion is slow and small: the coded parcel moves between the two buildings and the two flasks
 * fill. Both are switched off under reduced motion in index.css (the global clamp would otherwise
 * make an infinite animation cycle faster, not stop).
 * On a phone it pans sideways at a readable height, like the About scene (.sc-wrap / .sc-svg).
 */
const NAVY = '#14231A', GREEN = '#2F6B3A', GOLD = '#D9A21B', RUST = '#9C4E2A', SAND = '#FBF9F3', SAND2 = '#F0EEE5', SKY = '#E6EEE8'
const FONT = 'Public Sans, system-ui, sans-serif'

const FLASK = (x: number) => `M${x} 318h18v14l22 40a8 8 0 0 1-7 12h-48a8 8 0 0 1-7-12l22-40v-14z`

export function LabScene() {
  return (
    <div className="sc-wrap">
      <svg viewBox="0 206 1600 264" className="sc-svg" role="img"
        aria-label="A drawing of how a sample is handled: your parcel goes to Sample Reception, where your name is replaced by a code; the coded parcel goes to the laboratory, where a portion is retained and 2 analysts work independently; the report reaches you as a PDF on your phone.">
        <defs>
          <clipPath id="lab-fa"><path d={FLASK(1046)} /></clipPath>
          <clipPath id="lab-fb"><path d={FLASK(1214)} /></clipPath>
        </defs>

        {/* The ground everything sits on. */}
        <rect x="0" y="392" width="1600" height="78" fill={SAND2} />
        <line x1="0" y1="392" x2="1600" y2="392" stroke={NAVY} strokeWidth="2" opacity=".5" />

        {/* YOUR PARCEL, with your name on it */}
        <g>
          <rect x="70" y="330" width="96" height="62" rx="3" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
          <line x1="146" y1="330" x2="146" y2="392" stroke={SOIL_TAPE} strokeWidth="6" opacity=".45" />
          <rect x="84" y="344" width="44" height="22" rx="3" fill={GOLD} stroke={NAVY} strokeWidth="1.8" />
          <line x1="91" y1="352" x2="121" y2="352" stroke={NAVY} strokeWidth="1.6" opacity=".7" />
          <line x1="91" y1="358" x2="112" y2="358" stroke={NAVY} strokeWidth="1.6" opacity=".7" />
        </g>
        {/* your name travels this far */}
        <line x1="178" y1="370" x2="262" y2="370" stroke={GOLD} strokeWidth="3" strokeDasharray="8 7" />
        <path d="M262 363 l10 7 l-10 7" fill="none" stroke={GOLD} strokeWidth="3" />

        {/* SAMPLE RECEPTION: a separate building. The name tag comes off, a code goes on. */}
        <g>
          <rect x="284" y="262" width="300" height="130" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
          <rect x="284" y="262" width="300" height="16" fill={RUST} opacity=".85" />
          <rect x="304" y="298" width="46" height="40" fill={SKY} stroke={NAVY} strokeWidth="2" />
          <rect x="520" y="316" width="40" height="76" fill={SKY} stroke={NAVY} strokeWidth="2" />
          {/* the counter */}
          <rect x="366" y="350" width="136" height="42" fill={SAND2} stroke={NAVY} strokeWidth="2.2" />
          <rect x="378" y="330" width="40" height="20" rx="3" fill={GOLD} stroke={NAVY} strokeWidth="1.6" />
          <path d="M424 340 h24" stroke={NAVY} strokeWidth="2" />
          <path d="M442 334 l8 6 l-8 6" fill="none" stroke={NAVY} strokeWidth="2" />
          <rect x="456" y="330" width="40" height="20" rx="3" fill={NAVY} />
          <text x="476" y="345" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" style={{ fontFamily: FONT }}>#</text>
        </g>

        {/* only a code travels on */}
        <line x1="596" y1="380" x2="900" y2="380" stroke={NAVY} strokeWidth="2.5" strokeDasharray="8 7" opacity=".7" />
        <path d="M900 373 l10 7 l-10 7" fill="none" stroke={NAVY} strokeWidth="2.5" opacity=".7" />
        <g className="lab-move">
          <rect x="612" y="352" width="44" height="30" rx="3" fill={SAND} stroke={NAVY} strokeWidth="2.2" />
          <rect x="622" y="359" width="24" height="14" rx="2" fill={NAVY} />
        </g>

        {/* THE LABORATORY: a retained portion locked away, 2 benches with a wall between them. */}
        <g>
          <rect x="924" y="232" width="420" height="160" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
          <rect x="924" y="232" width="420" height="16" fill={NAVY} opacity=".85" />
          {/* the retained portion */}
          <rect x="944" y="290" width="58" height="102" fill={SAND2} stroke={NAVY} strokeWidth="2.2" />
          <rect x="960" y="318" width="26" height="34" rx="4" fill={GREEN} opacity=".5" stroke={NAVY} strokeWidth="1.8" />
          <rect x="958" y="312" width="30" height="8" rx="2" fill={SAND} stroke={NAVY} strokeWidth="1.6" />
          {/* bench A */}
          <rect x="1018" y="384" width="112" height="8" fill={NAVY} opacity=".75" />
          <path d={FLASK(1046)} fill={SAND} stroke={NAVY} strokeWidth="2.2" />
          <g clipPath="url(#lab-fa)"><rect className="sc-liquid" x="1020" y="358" width="90" height="60" fill={GREEN} opacity=".55" /></g>
          <text x="1074" y="290" textAnchor="middle" fontSize="15" fontWeight="800" fill={NAVY} opacity=".7" style={{ fontFamily: FONT }}>A</text>
          {/* D-169: the two analysts work independently. Drawn as a dashed divide, not a wall: the
              page does not claim a physical wall, and the independent review caught the first draft doing so. */}
          <line x1="1155" y1="262" x2="1155" y2="392" stroke={NAVY} strokeWidth="2.5" strokeDasharray="7 7" opacity=".6" />
          {/* bench B */}
          <rect x="1186" y="384" width="112" height="8" fill={NAVY} opacity=".75" />
          <path d={FLASK(1214)} fill={SAND} stroke={NAVY} strokeWidth="2.2" />
          <g clipPath="url(#lab-fb)"><rect className="sc-liquid" x="1188" y="358" width="90" height="60" fill={GREEN} opacity=".55" style={{ animationDelay: '1.6s' }} /></g>
          <text x="1242" y="290" textAnchor="middle" fontSize="15" fontWeight="800" fill={NAVY} opacity=".7" style={{ fontFamily: FONT }}>B</text>
        </g>

        {/* at release the system reconnects the code to you */}
        <line x1="1356" y1="340" x2="1430" y2="340" stroke={GOLD} strokeWidth="3" strokeDasharray="8 7" />
        <path d="M1430 333 l10 7 l-10 7" fill="none" stroke={GOLD} strokeWidth="3" />

        {/* YOUR REPORT, a PDF on your phone */}
        <g>
          <rect x="1462" y="262" width="84" height="130" rx="12" fill={SAND} stroke={NAVY} strokeWidth="2.5" />
          <rect x="1474" y="280" width="60" height="84" rx="3" fill="#fff" stroke={NAVY} strokeWidth="1.6" />
          <rect x="1474" y="280" width="60" height="14" fill={RUST} opacity=".8" />
          <text x="1504" y="291" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" style={{ fontFamily: FONT }}>PDF</text>
          {[304, 314, 324, 334].map(y => <line key={y} x1="1482" y1={y} x2={y === 334 ? 1508 : 1526} y2={y} stroke={NAVY} strokeWidth="1.6" opacity=".5" />)}
          <circle cx="1518" cy="350" r="9" fill={GREEN} />
          <path d="M1513 350 l4 4 l7 -8" fill="none" stroke="#fff" strokeWidth="2.2" />
          <rect x="1494" y="374" width="20" height="4" rx="2" fill={NAVY} opacity=".5" />
        </g>

        {/* The four places, named, so the picture explains itself. */}
        <g fontSize="17" fontWeight="800" letterSpacing="2.4" fill={NAVY} opacity=".8" style={{ fontFamily: FONT }}>
          <text x="64" y="428">YOUR PARCEL</text>
          <text x="284" y="428">SAMPLE RECEPTION</text>
          <text x="924" y="428">THE LABORATORY</text>
          <text x="1582" y="428" textAnchor="end">YOUR REPORT</text>
        </g>
        <g fontSize="16.5" fontWeight="600" fill="#5B6A5E" style={{ fontFamily: FONT }}>
          <text x="64" y="452">your name on it</text>
          <text x="284" y="452">knows your name, never your result</text>
          <text x="924" y="452">sees a code, never your name</text>
          <text x="1582" y="452" textAnchor="end">PDF, WhatsApp and email</text>
        </g>
      </svg>
    </div>
  )
}

const SOIL_TAPE = '#7A5230'

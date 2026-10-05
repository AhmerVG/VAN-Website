import { useMemo } from 'react'
import { GRID, districtByKey, medianStats, ANALYTES, fmtVal, type AnalyteKey } from '@/lib/soil'
import { SOIL_SOURCE } from '@/data/soilLens'

/**
 * ONE LEVEL BELOW THE DISTRICT — O-20, 9 September 2026.
 *
 * Tahir: "if its farmer, he should be appealed to see his district OR ONE LEVEL DOWN as data."
 *
 * That data was already on this page and nobody could reach it. SOIL_GRID holds 4,911 cells of
 * 0.05° — about 5.5 km by 4.8 km at Punjab's latitude, roughly 27 km² or 6,600 acres, which is
 * below tehsil. All 36 districts are covered, median 127 cells each, and 769,720 of the 770,160
 * samples sit inside them. Each cell carries its own pH, organic matter, P, K, zinc, carbonate,
 * boron, salinity and sample count. Until now the page used all of that only to colour a map: a
 * reader could hover a square, and that was the end of it.
 *
 * THE FINDING THIS PUTS IN FRONT OF A FARMER, and it is measured rather than argued:
 * Sheikhupura is the most alkaline district in the province at a mean pH of 8.73. Its own cells run
 * from 8.19 to 9.22 — the district figure hides a full point. Its zinc runs from 0.42 to 2.91 ppm,
 * from badly deficient to nearly three times the threshold, inside one district.
 *
 * So a farmer told his district mean is being told a number that may not describe his field at all.
 * That is the eye-opener, it is the honest case for testing a field, and it costs nothing to show
 * because the data was already loaded.
 *
 * NOT A PREDICTION. A cell is the median of real samples inside it (D-241, 1 Oct 2026; it was the mean). It is not an estimate for any
 * particular field, and the panel says so rather than letting a farmer read it as one.
 *
 * KNOWN LIMIT, and Tahir has been asked to rule on it: a farmer knows his tehsil, his union council
 * and his mauza — he does not know his 0.05° cell. The raw workbooks carry all three columns; the
 * generator kept only district and grid. Regenerating by tehsil is a rerun over the same workbooks.
 */

const SHOWN: AnalyteKey[] = ['ph', 'om', 'p', 'k', 'zn', 'b']

export function MyGround({ selected }: { selected: string | null }) {
  const d = districtByKey(selected)
  const cells = useMemo(() => (d ? GRID.cells.filter(c => c.dist === d.key) : []), [d])

  if (!d) {
    return (
      <div className="panel p-5" id="soil-myground">
        <span className="eyebrow soil">One level down</span>
        <h3 className="mt-1">Pick your district above and this reads the ground inside it.</h3>
        <p className="small muted mt-2 max-w-[140ch]">
          The survey is not only district averages. It carries <b>{GRID.cells.length.toLocaleString()} cells</b> of
          about 5.5 by 4.8 kilometres, roughly 6,600 acres each, and every district has its own. That is closer
          to a neighbourhood than to a district, and it is where a district average starts to fall apart.
        </p>
      </div>
    )
  }

  const stats = SHOWN.map(k => {
    const a = ANALYTES.find(x => x.key === k)!
    const vals = cells.map(c => c[k]).filter((v): v is number => v != null).sort((x, y) => x - y)
    const mean = (d.summary as unknown as Record<string, number | null>)[k]
    const median = (medianStats(d.summary, d.key) as unknown as Record<string, number | null>)[k]
    return { a, k, lo: vals[0] ?? null, hi: vals[vals.length - 1] ?? null, n: vals.length, mean: mean ?? null, median: median ?? null }
  }).filter(s => s.n > 1)

  // The widest spread is the one worth leading with, measured as a share of the district median.
  const widest = stats
    .filter(s => s.median && s.lo != null && s.hi != null)
    .map(s => ({ ...s, rel: (s.hi! - s.lo!) / (s.median as number) }))
    .sort((x, y) => y.rel - x.rel)[0]

  return (
    <div className="panel p-5" id="soil-myground">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className="eyebrow soil">One level down · {d.name}</span>
        <span className="cap">{cells.length} cells · {d.summary.n.toLocaleString()} samples</span>
      </div>
      <h3 className="mt-1 max-w-[30ch]">Your district is not one soil.</h3>

      {widest && (
        <p className="lead mt-3 max-w-[140ch]">
          {d.name}'s median {widest.a.label.toLowerCase()} is <b>{fmtVal(widest.k, widest.median)}</b>.
          Across its own {widest.n} cells it runs from <b>{fmtVal(widest.k, widest.lo)}</b> to <b>{fmtVal(widest.k, widest.hi)}</b>.
        </p>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="tbl" style={{ minWidth: 560 }}>
          <thead><tr><th>Reading</th><th className="r">District median</th><th className="r">District mean</th><th className="r">Lowest cell</th><th className="r">Highest cell</th></tr></thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.k}>
                <td className="font-semibold">{s.a.label}</td>
                <td className="r num">{fmtVal(s.k, s.median)}</td>
                <td className="r num">{fmtVal(s.k, s.mean)}</td>
                <td className="r num">{fmtVal(s.k, s.lo)}</td>
                <td className="r num">{fmtVal(s.k, s.hi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="small mt-4 max-w-[140ch]">
        <b>Every one of those numbers is real, and none of them is your field.</b> A cell is the median of the
        samples that fell inside about 6,600 acres. Your own ground sits somewhere in that range, and the only
        way to know where is to test it.
      </p>
      <div className="flex flex-wrap gap-3 mt-4">
        <a className="btn btn-navy btn-sm" href="#/lab">Have your field tested →</a>
        <a className="btn btn-ghost btn-sm" href="#/crops">Build a plan from a soil report →</a>
      </div>
      <p className="src mt-3"><b>Source ·</b> {SOIL_SOURCE.short}. Cells of {GRID.deg}° with at least three samples; no interpolation and no boundary file. A farmer knows his tehsil rather than his cell. Reading these by tehsil and mauza is possible from the same workbooks and is not built yet.</p>
    </div>
  )
}

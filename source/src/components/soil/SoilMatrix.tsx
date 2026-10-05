import { useEffect, useMemo, useRef, useState } from 'react'
import { SOIL } from '@/data/soil'
import { DISTRICTS, medianStats, thousands } from '@/lib/soil'
import { SOIL_COLS, SOIL_BAND_COLOR, SOIL_BAND_LABEL, SOIL_BAND_ORDER, bandOf, bandTint, fmt, readVal, urgencyScore, notComparable, type SoilColKey } from '@/lib/soilSeverity'

/**
 * THIRTY-SIX DISTRICTS BY EIGHT PARAMETERS — 10 September 2026.
 *
 * Tahir: "Thirty-six districts, one gradient IS TOO DENSE, think to make it compact but clear" and,
 * on the map, "one should be able to make an interactive soil heat map based on soil parameter and
 * district combination. Keep it very clear and readable and highly interactive, visually clear."
 *
 * WHAT WAS THERE. A wall of thirty-six chips, each carrying the district name and ONE number — the
 * one you had sorted by. To compare two districts on two analytes you had to sort twice and hold
 * four numbers in your head. Three hundred and sixty numbers existed in the data and the page showed
 * you thirty-six of them at a time.
 *
 * WHAT IS HERE NOW. Every district a row, every parameter a column, every cell carrying its value on
 * VAN's own 5-band colour. The whole province is one picture: you can see down a column which
 * districts are worst on zinc, and along a row that a district short of phosphorus is usually short
 * of potash too. Sorting by a column re-orders the rows under it. Clicking a cell takes that
 * district AND that parameter to the map and the vitals above.
 *
 * COMPACT, which was the actual instruction. The chip wall ran to five wrapped rows of pills at
 * 1440px and carried 36 numbers. This carries 288 in less vertical space, because a number in a
 * coloured cell needs no pill around it and no name beside it.
 *
 * THE PHONE. A 36 x 8 table cannot be made to fit 390px and should not be pretended into it. The
 * district column is pinned and the parameters scroll under the reader's thumb, which is how every
 * table on a phone that carries real data behaves.
 */

type Sort = { key: SoilColKey | 'name' | 'n' | 'worst'; dir: 1 | -1 }

export function SoilMatrix({ selected, onSelect, param, onParam }: {
  selected: string | null
  onSelect: (k: string | null) => void
  param: SoilColKey
  onParam: (k: SoilColKey) => void
}) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>({ key: 'worst', dir: -1 })
  const [extra, setExtra] = useState(false)

  // D-242, Tahir 1 Oct 2026: a "median / mean" label that shows only when the reader points at a
  // cell (or taps or tabs to it), saying which number is which. Drawn into one fixed-position box by
  // hand rather than through React state: Row is re-created on every render here, so a state change
  // on hover would remount every row under the pointer.
  const tipRef = useRef<HTMLDivElement>(null)
  const shownAt = useRef(0)
  const showTip = (el: HTMLElement, lines: [string, string][]) => {
    const t = tipRef.current; if (!t) return
    t.replaceChildren(...lines.map(([cls, txt]) => { const d = document.createElement('div'); d.className = cls; d.textContent = txt; return d }))
    const r = el.getBoundingClientRect()
    const below = r.top < 150
    const half = Math.min(130, (window.innerWidth - 32) / 2)
    t.style.left = `${Math.min(Math.max(r.left + r.width / 2, half + 16), window.innerWidth - half - 16)}px`
    t.style.top = `${below ? r.bottom + 8 : r.top - 8}px`
    t.style.transform = below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
    t.style.display = 'block'
    shownAt.current = Date.now()
  }
  const hideTip = () => { if (tipRef.current) tipRef.current.style.display = 'none' }
  // A tap selects the district, the panel above grows and the browser shifts the page to keep the
  // cell still; that shift is not the reader scrolling, so a scroll within 800 ms of showing is ignored.
  useEffect(() => {
    const h = () => { if (Date.now() - shownAt.current > 800) hideTip() }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const cols = useMemo(() => SOIL_COLS.filter(c => extra || !c.extra), [extra])

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    const list = DISTRICTS.filter(d => !t || d.name.toLowerCase().includes(t))
    return [...list].sort((a, b) => {
      if (sort.key === 'name') return a.name.localeCompare(b.name) * sort.dir
      const ma = medianStats(a.summary, a.key), mb = medianStats(b.summary, b.key)
      if (sort.key === 'worst') return (urgencyScore(ma, a.key) - urgencyScore(mb, b.key)) * sort.dir
      if (sort.key === 'n') return (a.summary.n - b.summary.n) * sort.dir
      const va = readVal(ma, sort.key), vb = readVal(mb, sort.key)
      if (va == null) return 1
      if (vb == null) return -1
      return (va - vb) * sort.dir
    })
  }, [q, sort])

  // A column header sorts by that column AND makes it the parameter the rest of the page reads,
  // because a reader who sorts by zinc is asking to look at zinc.
  const head = (k: Sort['key']) => {
    setSort(s => (s.key === k ? { key: k, dir: s.dir === 1 ? -1 : 1 } : { key: k, dir: k === 'name' ? 1 : -1 }))
    if (k !== 'name' && k !== 'n' && k !== 'worst') onParam(k)
  }
  const arrow = (k: Sort['key']) => (sort.key === k ? (sort.dir === -1 ? ' ↓' : ' ↑') : '')

  const Row = ({ name, s, k, bold }: { name: string; s: typeof SOIL.province; k: string | null; bold?: boolean }) => {
    const on = selected === k
    const sm = medianStats(s, k)   // D-241: cells show and band the median; the mean sits under it
    return (
      <tr className={`mx-row ${on ? 'sel' : ''}`}>
        <th scope="row" className={`mx-name ${bold ? 'font-bold' : 'font-semibold'}`}>
          <button onClick={() => onSelect(on ? null : k)} aria-pressed={on}>{name}</button>
          <span className="cap num">{thousands(s.n)}</span>
        </th>
        {cols.map(c => {
          const v = readVal(sm, c.key)
          const mv = readVal(s, c.key)
          const nc = notComparable(k, c.key)
          const b = nc ? undefined : bandOf(c.key, v)
          const hot = param === c.key
          const u = c.unit ? (c.unit === '%' ? '%' : ` ${c.unit}`) : ''
          const pull = v == null || mv == null || Math.abs(mv - v) < Math.pow(10, -c.dec) / 2 ? 'about the same as the median'
            : mv > v ? 'the simple average, pulled up by a few very high samples' : 'the simple average, pulled down by a few very low samples'
          const lines: [string, string][] = [
            ['mx-tip-h', `${name} · ${c.label}`],
            ['mx-tip-l', v == null ? 'Not determined in this survey.' : `${fmt(c.key, v)}${u} (big) = median, the typical field.${nc ? ' Not banded: likely a different laboratory method.' : b ? ` Sets the colour: ${SOIL_BAND_LABEL[b]}.` : ' No band in VAN’s table.'}`],
          ]
          if (v != null) lines.push(['mx-tip-l', `${fmt(c.key, mv)}${u} (small) = mean, ${pull}.`])
          const label = lines.map(l => l[1]).join(' ')
          return (
            <td key={c.key} className={`mx-cell ${hot ? 'hot' : ''} ${nc ? 'mx-nc' : ''}`} style={{ background: nc ? undefined : bandTint(b) }}>
              <button
                onClick={() => { onSelect(k); onParam(c.key) }}
                aria-label={label}
                onMouseEnter={e => showTip(e.currentTarget, lines)} onMouseLeave={hideTip}
                onFocus={e => showTip(e.currentTarget, lines)} onBlur={hideTip}>
                <span className="num">{fmt(c.key, v)}{nc ? '*' : ''}</span>
                <span className="num mx-mean">{fmt(c.key, mv)}</span>
              </button>
            </td>
          )
        })}
      </tr>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input className="input input-sm" style={{ maxWidth: 220 }} placeholder="My district…" value={q} onChange={e => setQ(e.target.value)} aria-label="Find a district" />
        <button className={`chip chip-xs ${sort.key === 'worst' ? 'on' : ''}`} onClick={() => head('worst')} aria-pressed={sort.key === 'worst'}>Worst first{arrow('worst')}</button>
        <button className={`chip chip-xs ${sort.key === 'name' ? 'on' : ''}`} onClick={() => head('name')} aria-pressed={sort.key === 'name'}>A–Z{arrow('name')}</button>
        <button className={`chip chip-xs ${sort.key === 'n' ? 'on' : ''}`} onClick={() => head('n')} aria-pressed={sort.key === 'n'}>Samples{arrow('n')}</button>
        <button className={`chip chip-xs ${extra ? 'on' : ''}`} onClick={() => setExtra(x => !x)} aria-pressed={extra}>
          {extra ? 'Fewer columns' : 'Add Cu · Mn · CaCO₃'}
        </button>
        {selected && <button className="btn btn-ghost btn-sm ml-auto" onClick={() => onSelect(null)}>Show all 36</button>}
      </div>

      <div ref={tipRef} className="mx-tip" role="tooltip" style={{ display: 'none' }} />
      <div className="mx-wrap" onScroll={() => { if (Date.now() - shownAt.current > 800) hideTip() }}>
        <table className="mx-tbl">
          <thead>
            <tr>
              <th className="mx-name mx-head"><button onClick={() => head('name')}>District{arrow('name')}</button></th>
              {cols.map(c => (
                <th key={c.key} className={`mx-head ${param === c.key ? 'hot' : ''}`} title={`${c.label}${c.unit ? ` (${c.unit})` : ''} · sort, and read the map on it`}>
                  <button onClick={() => head(c.key)}>
                    <span className="s">{c.short}{arrow(c.key)}</span>
                    <span className="u">{c.unit || '\u00a0'}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row name="Punjab · all 36" s={SOIL.province} k={null} bold />
            {rows.map(d => <Row key={d.key} name={d.name} s={d.summary} k={d.key} />)}
          </tbody>
        </table>
        {!rows.length && <p className="cap p-3">No district by that name among the 36.</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
        <span className="cap">Each cell: the median, banded; the mean in small under it.</span>
        <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>How bad</span>
        {SOIL_BAND_ORDER.map(b => (
          <span key={b} className="cap inline-flex items-center gap-1.5">
            <i style={{ width: 13, height: 13, borderRadius: 3, background: `${SOIL_BAND_COLOR[b]}2E`, border: `2px solid ${SOIL_BAND_COLOR[b]}`, display: 'inline-block' }} />
            {SOIL_BAND_LABEL[b]}
          </span>
        ))}
      </div>
      <p className="cap mt-2 max-w-[140ch]">
        The bands are VAN's own 5-band soil-test table, the same one printed on a VAN soil report,
        read against the district median, the typical field; the mean sits under each value. Calcium carbonate has no row in that table, so it carries a value and no
        colour. Copper and manganese have 3 bands there rather than 5. N.d. = not determined; Jhelum returns no
        valid zinc. * Iron and copper in Faisalabad, Jhang, Chiniot and Toba Tek Singh read far below every other district,
        which points to a different laboratory method rather than different soil. They are shown as surveyed and not banded.
        <b> Tap any cell</b> to take that district and that parameter to the map and the readings above.
      </p>
    </div>
  )
}

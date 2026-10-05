import { SOIL } from '@/data/soil'
import { useFitWidth } from '@/hooks/useFitWidth'
import { SOIL_SOURCE } from '@/data/soilLens'
import { PROVINCE_HIST, districtByKey, medianStats, shareRows, textureSplit, thousands, num, pct } from '@/lib/soil'
import { useInView } from '@/hooks/useInView'

/** A histogram drawn as bars, with named marks. Bars grow when the district changes (the key re-mounts them). */
function Hist({ title, bins, counts, marks, unit, colour, id }: { title: string; bins: number[]; counts: number[]; marks: { v: number; l: string }[]; unit: string; colour: string; id: string }) {
  // D-151 (QA 5): W follows the box, so labels render at their own size on a phone. Was W = 320, fonts 10 and 10.5.
  const fit = useFitWidth(320, 200)
  const W = fit.W, H = 130, padB = 22, padT = 8
  const total = counts.reduce((a, b) => a + b, 0) || 1
  const max = Math.max(...counts, 1)
  const bw = W / counts.length
  const x = (v: number) => ((v - bins[0]) / (bins[bins.length - 1] - bins[0])) * W
  return (
    <div ref={fit.ref}>
      <div className="flex items-baseline justify-between gap-2"><span className="font-bold" style={{ fontSize: 14 }}>{title}</span><span className="cap">{thousands(total)} in range · count per bin</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-1" role="img" aria-label={`${title} distribution`}>
        <g key={id}>
          {counts.map((c, i) => {
            const h = (c / max) * (H - padB - padT)
            return <rect key={i} className="hist-bar" x={i * bw + 0.5} y={H - padB - h} width={Math.max(0.5, bw - 1)} height={h} fill={colour} opacity={.85} style={{ animationDelay: `${i * 25}ms` }}><title>{`${bins[i]}–${bins[i + 1]}${unit}: ${thousands(c)} (${((c / total) * 100).toFixed(1)}%)`}</title></rect>
          })}
        </g>
        <line x1={0} x2={W} y1={H - padB} y2={H - padB} stroke="var(--line-2)" />
        {marks.map(m => <g key={m.l}><line x1={x(m.v)} x2={x(m.v)} y1={padT} y2={H - padB} stroke="#14231A" strokeDasharray="3 3" strokeWidth="1.2" /><text x={x(m.v)} y={H - padB + 14} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#14231A" className="num">{m.l}</text></g>)}
        <text x={0} y={H - 2} fontSize="11" fill="var(--muted)" className="num">{bins[0]}{unit}</text>
        <text x={W} y={H - 2} fontSize="11" fill="var(--muted)" textAnchor="end" className="num">{bins[bins.length - 1]}{unit}</text>
      </svg>
    </div>
  )
}

/** The distribution panel for a district — or the province when nothing is picked. */
export function Distribution({ selected }: { selected: string | null }) {
  const d = districtByKey(selected)
  const s = d ? d.summary : SOIL.province
  const m = medianStats(s, d ? d.key : null)   // D-241: median first, mean after the slash
  const hist = d ? d.hist : PROVINCE_HIST
  const tex = textureSplit(d ? d.texture : SOIL.province_texture)
  const id = d?.key ?? 'PROVINCE'
  const { ref, inView } = useInView({ threshold: 0.2 })
  return (
    <div ref={ref} className={`panel p-5 ${inView ? 'on in' : ''}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div><span className="eyebrow soil" style={{ marginBottom: 2 }}>{d ? 'District' : 'Province'}</span><h3>{d ? d.name : 'Punjab, all 36 districts'}</h3></div>
        <div className="cap num">{thousands(s.n)} samples · median / mean: pH {num(m.ph)} / {num(s.ph)} · OM {num(m.om)} / {num(s.om)}% · P {num(m.p, 1)} / {num(s.p, 1)} ppm · K {num(m.k, 0)} / {num(s.k, 0)} ppm · Zn {s.zn == null ? 'not determined' : `${num(m.zn)} / ${num(s.zn)} ppm`} · B {num(m.b)} / {num(s.b)} ppm · CaCO₃ {num(m.caco3)} / {num(s.caco3)}%</div>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mt-4">
        <Hist id={id} title="pH" bins={SOIL.hist_bins.ph} counts={hist.ph} marks={[{ v: 7.5, l: '7.5' }, { v: 8.0, l: '8.0' }, { v: 8.5, l: '8.5' }]} unit="" colour="#9C4E2A" />
        <Hist id={id} title="Organic matter" bins={SOIL.hist_bins.om} counts={hist.om} marks={[{ v: 0.86, l: '0.86' }]} unit="%" colour="#7A5230" />
        <Hist id={id} title="Available phosphorus" bins={SOIL.hist_bins.p} counts={hist.p} marks={[{ v: 7, l: '7' }, { v: 15, l: '15' }]} unit=" ppm" colour="#1F4B28" />
      </div>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-5">
        <div>
          <div className="font-bold" style={{ fontSize: 14 }}>Share below Punjab’s working threshold</div>
          <p className="cap mb-2">shares of samples, not a diagnosis of any field</p>
          <div className="grid gap-2">
            {shareRows(s).map(r => (
              <div key={r.label + r.threshold} className="share-row">
                <span><b>{r.label}</b> <span className="cap">{r.threshold}</span></span>
                <span className="track"><i style={{ width: inView ? `${r.v ?? 0}%` : 0, background: r.label === 'Salinity' ? '#14231A' : undefined }} /></span>
                <span className="v">{r.v == null ? 'n.d.' : pct(r.v)}</span>
              </div>
            ))}
          </div>
          {s.zn == null && <p className="cap mt-2" style={{ color: 'var(--rust-text)' }}>Zinc: not determined. The workbook returns no valid zinc data for this district.</p>}
        </div>
        <div>
          <div className="font-bold" style={{ fontSize: 14 }}>Texture, as recorded</div>
          <p className="cap mb-2">share of samples by class</p>
          <div className="flex h-5 rounded-md overflow-hidden" style={{ background: 'var(--sand-2)' }}>
            {tex.map((t, i) => <div key={t.label} title={`${t.label}: ${thousands(t.n)} (${t.share.toFixed(1)}%)`} style={{ width: `${t.share}%`, background: ['#7A5230', '#C9A86A', '#5A3A20', '#A9C7A0', '#4F8A3E', '#E6EEE8', '#8A968C'][i % 7], transition: 'width .8s' }} />)}
          </div>
          <div className="grid gap-1 mt-2 cap">
            {tex.map((t, i) => <div key={t.label} className="flex items-center gap-2"><i style={{ width: 10, height: 10, borderRadius: 3, background: ['#7A5230', '#C9A86A', '#5A3A20', '#A9C7A0', '#4F8A3E', '#E6EEE8', '#8A968C'][i % 7], flex: 'none' }} /><span className="flex-1">{t.label}</span><span className="num">{t.share.toFixed(1)}% · {thousands(t.n)}</span></div>)}
          </div>
        </div>
      </div>
      <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. Thresholds: {SOIL.meta.thresholds} <a href="#/soil#caveats">Read this before quoting ›</a></p>
    </div>
  )
}

/**
 * THE CHIP WALL IS GONE — 10 September 2026.
 *
 * `DistrictStrip` lived here: thirty-six pills, each carrying a district name and the one number you
 * had sorted by, wrapping to five rows at 1440px. Tahir: "Thirty-six districts, one gradient IS TOO
 * DENSE, think to make it compact but clear." It is replaced by SoilMatrix, which puts all eight
 * parameters against all thirty-six districts in less height than the pills used, on VAN's own
 * 5-band colour. The component is deleted rather than left unused, so that nobody rebuilds the
 * page around it by accident. `Distribution` above is unchanged and still reads the selected
 * district.
 */

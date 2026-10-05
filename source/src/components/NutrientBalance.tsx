import { useMemo, useState } from 'react'
import { planUpdateNote } from '@/data/planNotes'
import { programmeSupply, allStages, NUTRIENT_LABEL, type Nutrient } from '@/lib/nutrientBalance'
import { removalFor, removalGapFor, uptakeFor, REMOVAL_SOURCE, KG_PER_MAUND } from '@/data/removal'
import { nutrientRanges, cropHasRange, fmtRange, fmtPair, RANGE_NOTE } from '@/lib/planRange'
import { SectionHead } from './bits'

/**
 * NUTRIENT REMOVAL AND REPLACEMENT — added 9 September 2026.
 *
 * The site's knowledge pages argue that Pakistan's soils are being mined: more leaves each season
 * than goes back, and the 770,160-sample survey the site publishes is what that looks like after
 * thirty years. Until now that argument has been national and abstract. This is the same argument
 * about one field, in kilograms, for the programme the reader has just been reading.
 *
 * TWO HALVES FROM TWO VERY DIFFERENT PLACES, and the page says which is which.
 *
 *   WHAT GOES ON is VAN's own: the published plan's own rows, at the published rates, read against
 *   each row's own printed analysis. Arithmetic on VAN's numbers, nothing sourced from outside.
 *
 *   WHAT COMES OFF is not VAN's and cannot be: no Pakistani nutrient-removal table exists on the
 *   public record. These are IPNI's, a North-American compilation, named on the page with IPNI's
 *   own caution that local data should be preferred. If VAN or SFRI ever measures Pakistani
 *   coefficients they replace these outright.
 *
 * THE NUMBER THIS PRODUCES IS COMMERCIALLY AWKWARD AND IS PUBLISHED ANYWAY. On wheat at 60 maunds
 * with the straw sold — which is most Punjab farms, because bhusa is fodder — the programme returns
 * a fraction of the potash the crop takes away. A fertiliser company's own website saying so is the
 * point, not an oversight: it is the site's national argument holding when it is turned on VAN.
 *
 * WHAT IT REFUSES. Crops with no credible removal coefficient get the section's reason, not a
 * plausible figure — cotton above all, where the only published number is per tonne of LINT and a
 * Pakistani grower weighs phutti, so using it would overstate removal about threefold.
 */
export function NutrientBalance({ cropKey, cropName, defaultYieldMaunds }: { cropKey: string; cropName: string; defaultYieldMaunds?: number }) {
  const removal = removalFor(cropKey)
  const gap = removalGapFor(cropKey)
  const uptake = uptakeFor(cropKey)
  const supply = useMemo(() => programmeSupply(cropKey, allStages(cropKey)), [cropKey])
  // 11 Sep 2026, Tahir's ruling. On wheat and potato VAN holds two documents for the same
  // programme and they do not agree, so "what the programme puts on" is printed as a range rather
  // than as whichever of the two this component happens to read. See src/lib/planRange.ts.
  const ranges = useMemo(() => nutrientRanges(cropKey), [cropKey])
  const ranged = cropHasRange(cropKey)

  const [yieldMaunds, setYieldMaunds] = useState<string>(defaultYieldMaunds ? String(defaultYieldMaunds) : '')
  const [residueOff, setResidueOff] = useState(false)

  // No coefficient: say why, show what the programme puts on, and stop.
  if (!removal) {
    return (
      <div className="panel p-5 lg:p-6" id="balance">
        <span className="eyebrow">Removal and replacement</span>
        <h3 className="mt-1">What the {cropName} programme puts on your field.</h3>
        <SupplyTable supply={supply} cropName={cropName} cropKey={cropKey} />
        {/* B5, 24 Sep 2026: crops with no removal coefficient (onion among them) printed the supply
            total without saying which rows it leaves out. The same note now shows here. */}
        <NotCounted supply={supply} where="in the total above" />
        <p className="cap mt-4 max-w-[140ch]">
          <b>What the crop takes out is not shown for {cropName}, and here is why.</b>{' '}
          {gap ?? 'No credible per-tonne removal coefficient was found for this crop in any source, so none is shown.'}
        </p>
      </div>
    )
  }

  const t = Number(yieldMaunds) > 0 ? (Number(yieldMaunds) * KG_PER_MAUND) / 1000 : 0
  const taken: Partial<Record<Nutrient, number>> = {}
  for (const n of ['N', 'P', 'K', 'S'] as Nutrient[]) {
    const grain = (removal as unknown as Record<string, number | undefined>)[n] ?? 0
    const res = residueOff && removal.residue ? ((removal.residue as unknown as Record<string, number | undefined>)[n] ?? 0) : 0
    if (grain || res) taken[n] = (grain + res) * t
  }

  const rows = (['N', 'P', 'K', 'S'] as Nutrient[]).filter(n => (supply.perAcre[n] ?? 0) > 0 || (taken[n] ?? 0) > 0)

  return (
    <div id="balance">
      <SectionHead
        eyebrow="Removal and replacement"
        title="What goes on, and what comes off."
        tone="soil"
        lead={`Every season takes nutrients out of the field in the harvest. The programme puts some back. This is both sides of that, per acre, for ${cropName}, and the gap is the reason this site argues about soil the way it does.`}
      />

      <div className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-1">
            <span className="cap">What yield are you expecting?</span>
            <span className="flex items-center gap-2">
              <input
                className="input num" style={{ width: 110 }} inputMode="decimal"
                value={yieldMaunds} onChange={e => setYieldMaunds(e.target.value.replace(/[^\d.]/g, ''))}
                aria-label={`Expected ${cropName} yield in maunds per acre`} placeholder="maunds"
              />
              <span className="cap">maunds/acre</span>
            </span>
            {/* 11 Sep 2026 · the prefill on potato is the discipline simulator's CEILING, 686.25
                maunds an acre, not a typical crop. Left unlabelled under "What yield are you
                expecting?" it reads as an expectation, and it drives the most alarming figure on the
                page. It is named now, and it is still there to be typed over. */}
            {defaultYieldMaunds && String(defaultYieldMaunds) === yieldMaunds && (
              <span className="cap" style={{ color: 'var(--rust)' }}>
                Prefilled with what a good progressive farmer achieves. Type your own.
              </span>
            )}
          </label>
          {removal.residue && (
            <label className="flex items-center gap-2 pb-1">
              <input type="checkbox" checked={residueOff} onChange={e => setResidueOff(e.target.checked)} />
              <span>I take the {removal.residue.label.toLowerCase()} off the field too</span>
            </label>
          )}
        </div>

        {t === 0 ? (
          <p className="small mt-4 max-w-[140ch]">Put your expected yield in and both sides appear. Until then, here is what the programme itself delivers.</p>
        ) : null}

        <div className="mt-5 overflow-x-auto tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th className="r">The programme puts on</th>
                <th className="r">{t > 0 ? `${yieldMaunds} maunds takes off` : 'The harvest takes off'}</th>
                <th className="r">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(n => {
                const r = ranges?.[n]
                const on = supply.perAcre[n] ?? 0
                const lo = r?.differs ? r.low : on
                const hi = r?.differs ? r.high : on
                const off = taken[n] ?? 0
                // A range on what goes on is a range on the balance. Both ends are shown signed, so
                // a balance that is negative at one end and positive at the other cannot be read as
                // a single verdict it does not support.
                const balLo = lo - off
                const balHi = hi - off
                const sign = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`
                return (
                  <tr key={n}>
                    <td className="font-bold">{NUTRIENT_LABEL[n]}</td>
                    <td className="r num">{hi ? fmtPair(lo, hi) : 'n/a'}</td>
                    <td className="r num">{t > 0 && off ? `${off.toFixed(1)} kg` : 'n/a'}</td>
                    <td className="r num" style={{ color: t > 0 && off ? (balHi < 0 ? 'var(--rust)' : balLo > 0 ? 'var(--green)' : undefined) : undefined, fontWeight: 700 }}>
                      {t > 0 && off
                        ? (Math.abs(balHi - balLo) > 0.05 ? `${sign(balLo)}–${sign(balHi)} kg` : `${sign(balHi)} kg`)
                        : 'n/a'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {ranged && (
          <p className="cap mt-3 max-w-[140ch]" style={{ color: 'var(--rust)' }}>
            <b>Why some figures are a range.</b> {RANGE_NOTE}
          </p>
        )}

        <p className="cap mt-3 max-w-[140ch]">
          Per acre, per season. A minus means the crop takes more of that nutrient off the field than
          the programme puts back. The difference comes out of what the soil already holds, and does
          so every season. It is not a fault in the plan: no crop nutrition programme is written to
          replace everything a harvest removes, and this is why a soil test matters more than any
          published rate.
        </p>

        <NotCounted supply={supply} where="on the left" />
        {supply.usedLitreAssumption && (
          <p className="cap mt-2 max-w-[140ch]">
            Liquid packs are counted at 1 litre to 1 kilogram. The plans give the pack in litres
            and the analysis as a percentage without saying whether it is by weight or by volume, so
            a density has to be assumed and 1.0 is it. Every liquid here is a micronutrient or a
            foliar at a litre or two an acre, so it moves the totals by a fraction of a kilogram.
          </p>
        )}
      </div>

      {uptake && t > 0 && (
        <div className="panel-soft p-5 mt-4">
          <span className="eyebrow">Removed is not the same as taken up</span>
          <p className="mt-1 max-w-[140ch]">
            The table above is what physically <b>leaves the field</b>. The crop takes up more than
            that and leaves the rest standing in the residue. At {yieldMaunds} maunds, {cropName} takes
            up about{' '}
            {(['N', 'P', 'K'] as Nutrient[]).map(n => `${(((uptake as unknown as Record<string, number>)[n] ?? 0) * t).toFixed(0)} kg ${NUTRIENT_LABEL[n].replace(/.*\(|\)/g, '')}`).join(', ')}, 
            against what the table shows leaving. Whether that difference goes back into your soil or
            onto a trolley is decided at harvest, not at sowing.
          </p>
        </div>
      )}

      <p className="cap mt-4 max-w-[140ch]">
        <b>Where these 2 sides come from, because they do not come from the same place.</b>{' '}
        <b>What goes on</b> is VAN's own published {cropName} plan. Its rows, its rates, its printed
        analyses. Multiplied out. Nothing is modelled.{planUpdateNote(cropKey) ? <> {planUpdateNote(cropKey)}</> : null} <b>What comes off</b> is not VAN's: no
        Pakistani nutrient-removal table exists on the public record, so these are the{' '}
        {REMOVAL_SOURCE.name} ({removal.region}), for “{removal.verbatim}”, per {removal.basis}.
        IPNI's own note applies and is worth repeating: “{REMOVAL_SOURCE.footnote}” A Pakistani
        measurement would replace these outright, and should.
      </p>
    </div>
  )
}

function SupplyTable({ supply, cropName, cropKey }: { supply: ReturnType<typeof programmeSupply>; cropName: string; cropKey: string }) {
  const rows = (['N', 'P', 'K', 'S', 'Zn', 'B', 'Mg'] as Nutrient[]).filter(n => (supply.perAcre[n] ?? 0) > 0)
  const ranges = nutrientRanges(cropKey)
  if (!rows.length) return <p className="small mt-3">The published {cropName} programme prints no analysis this page can total.</p>
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {rows.map(n => (
          <div key={n}>
            <div className="display text-[22px]">{ranges?.[n]?.differs ? fmtRange(ranges[n]) : `${supply.perAcre[n]!.toFixed(1)} kg`}</div>
            <div className="cap">{NUTRIENT_LABEL[n]}</div>
          </div>
        ))}
      </div>
      {/* B3, 24 Sep 2026: on mango the per-tree rows are left out of this total, and the caption
          said "across the whole programme", so a grower read 0.2 kg N as the orchard's dose. */}
      {supply.perPlantRows.length > 0
        ? <p className="cap mt-3 max-w-[140ch]">Per acre, from the rows published per acre only. The per-tree doses ({[...new Set(supply.perPlantRows.map(r => r.product))].join(', ')}) are not included in this total. The published rates multiplied by the analysis printed on each row.</p>
        : <p className="cap mt-3 max-w-[140ch]">Per acre, across the whole programme. The published rates multiplied by the analysis printed on each row. Nothing modelled.</p>}
    </>
  )
}

/** Rows the supply total leaves out, and why. Shared by the balance table and the supply-only panel. */
function NotCounted({ supply, where }: { supply: ReturnType<typeof programmeSupply>; where: string }) {
  return (
    <>
      {supply.uncounted.length > 0 && (
        <p className="cap mt-2 max-w-[140ch]">
          <b>Not counted {where}:</b> {supply.uncounted.map(u => u.product).join(', ')}. The plan
          gives {supply.uncounted.length > 1 ? 'these' : 'this'} no nutrient analysis
          ({supply.uncounted.map(u => `“${u.analysis || 'no analysis printed'}”`).join(', ')}), so
          {supply.uncounted.length > 1 ? ' they are' : ' it is'} left out of the total rather than
          given a figure {supply.uncounted.length > 1 ? 'they do' : 'it does'} not have. The real
          total is therefore higher than shown.
        </p>
      )}
      {supply.perPlantRows.length > 0 && (
        <p className="cap mt-2 max-w-[140ch]">
          <b>Not counted {where}:</b> {[...new Set(supply.perPlantRows.map(r => r.product))].join(', ')}. Published
          per tree, not per acre. Turning those into a per-acre figure needs your orchard's tree
          count, which is your number and not ours.
        </p>
      )}
    </>
  )
}

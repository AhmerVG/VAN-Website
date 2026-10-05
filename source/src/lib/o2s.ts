/**
 * THE ONE PLACE THE WEBSITE TALKS TO O2S — 10 September 2026.
 *
 * Tahir: "Lab page, we need to link the batch verification as well the lab report of the batch to
 * O2S. My web team is working on API call integration but we should build the front end so a farmer
 * could be able to verify batch and download the QC report of the batch."
 *
 * So the front end is finished and the back end is one function away. Everything the website needs
 * from O2S is the two calls below and nothing else. When the web team has the endpoint they set
 * O2S.enabled to true and point O2S.base at it; no component changes.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 * THE CONTRACT, for whoever writes the endpoint
 *
 *   GET  {base}/batch/{batch}
 *        200  { batch, product_slug, product_name, analysis, pack,
 *               made_on, released_on, status, certificate_url }
 *        404  { }                         the number is not in O2S
 *
 *   GET  {base}/batch/{batch}/certificate.pdf
 *        200  application/pdf             the QC report for that batch
 *
 *   GET  {base}/sample/{ref}              (the OTHER thing on the Lab page: a sample somebody sent
 *        200  { ref, received_at, stage, updated_at, tests }        in for testing, not a bag)
 *        404  { }
 *
 * `stage` is one of the seven steps the blind-chain diagram already draws — parcel · reception ·
 * coded · split · analysts · compared · released — so the diagram and the tracker cannot drift.
 *
 * `status` is one of: released · held · withdrawn. Only `released` is a pass.
 * `made_on` and `released_on` are ISO dates (YYYY-MM-DD). `released_on` is null unless released.
 * `product_slug` must match a slug in this site's catalogue, because the page checks the farmer's
 * answer against it — a number typed correctly off the wrong bag is a real mistake and it is also
 * what a re-labelled bag looks like.
 *
 * TWO RULES THE ENDPOINT MUST HOLD, and they are not style points:
 *
 *  1. NO CUSTOMER DETAIL IN THE RESPONSE. Not a name, not a district, not a dealer, not a phone
 *     number, not an order number. Anyone in the world can call this with a number off a bag. The
 *     whole VAN Lab page is built on the blind chain — the laboratory never knew whose sample it
 *     was — and an endpoint that leaks who bought a batch would undo that argument from the outside.
 *
 *  2. THE CERTIFICATE IS STAMPED BY O2S, NOT BY THE SITE. Tahir's ruling, 10 Sep: the report is open
 *     to anyone holding the batch number, and every copy that leaves carries its batch number and
 *     the date it was downloaded, so a report cannot be passed off as another batch's. A browser
 *     cannot stamp a PDF it did not make, so the endpoint does it. Until it does, the page must not
 *     say the file is stamped — which is why that sentence is behind O2S.enabled with everything
 *     else.
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 */

export type BatchStatus = 'released' | 'held' | 'withdrawn'

export type BatchRecord = {
  batch: string
  productSlug: string
  productName: string
  /** The registered analysis, as it is printed on the bag. */
  analysis: string
  pack: string
  madeOn: string
  releasedOn: string | null
  status: BatchStatus
  certificateUrl: string | null
}

export type LookupFail =
  /** The number is not in O2S at all. Most often a typing slip; sometimes not a VAN bag. */
  | { ok: false; reason: 'not-found' }
  /** A real VAN batch, but of a different product from the one the farmer picked. */
  | { ok: false; reason: 'product-mismatch'; record: BatchRecord }
  /** The endpoint is not connected yet, or did not answer. Never shown as a pass or a fail. */
  | { ok: false; reason: 'offline' }

export type LookupResult = { ok: true; record: BatchRecord } | LookupFail

export const O2S = {
  /**
   * FALSE UNTIL THE WEB TEAM WIRES IT, and it stays false in every build that ships until then.
   * A verification screen that invents an answer is worse than no verification screen, because a
   * farmer holding a counterfeit bag would be shown a pass. With this off, every lookup returns
   * `offline` and the page says plainly that the check is not live and hands him WhatsApp instead.
   */
  enabled: false,
  base: '/api/public',
  timeoutMs: 8000,
}

/** Batch numbers are printed in capitals on the bag and typed however the farmer types them. */
export const normaliseBatch = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '')

export function certificateUrl(batch: string) {
  return `${O2S.base}/batch/${encodeURIComponent(normaliseBatch(batch))}/certificate.pdf`
}

export async function lookupBatch(batchRaw: string, productSlug: string | null): Promise<LookupResult> {
  const batch = normaliseBatch(batchRaw)
  if (!batch) return { ok: false, reason: 'not-found' }
  if (!O2S.enabled) return { ok: false, reason: 'offline' }

  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), O2S.timeoutMs)
  try {
    const res = await fetch(`${O2S.base}/batch/${encodeURIComponent(batch)}`, {
      signal: ctrl.signal, headers: { Accept: 'application/json' },
    })
    if (res.status === 404) return { ok: false, reason: 'not-found' }
    if (!res.ok) return { ok: false, reason: 'offline' }
    const j = await res.json()
    const record: BatchRecord = {
      batch: String(j.batch ?? batch),
      productSlug: String(j.product_slug ?? ''),
      productName: String(j.product_name ?? ''),
      analysis: String(j.analysis ?? ''),
      pack: String(j.pack ?? ''),
      madeOn: String(j.made_on ?? ''),
      releasedOn: j.released_on ? String(j.released_on) : null,
      status: (j.status ?? 'held') as BatchStatus,
      certificateUrl: j.certificate_url ? String(j.certificate_url) : certificateUrl(batch),
    }
    // The product check is done here rather than at the endpoint, so that a mismatch can be told
    // apart from a miss and answered differently. Both are failures; only one of them is a warning.
    if (productSlug && record.productSlug && record.productSlug !== productSlug) {
      return { ok: false, reason: 'product-mismatch', record }
    }
    return { ok: true, record }
  } catch {
    return { ok: false, reason: 'offline' }
  } finally {
    window.clearTimeout(t)
  }
}

/**
 * THE EXAMPLE ANSWERS. Not a mock of the endpoint and never returned by lookupBatch — they exist so
 * that the page can SHOW what each of the four outcomes will look like, clearly labelled as an
 * example, while the endpoint is still being written. Tahir and the web team can see the finished
 * screens today; a farmer cannot mistake one for a live check, because the panel that renders them
 * says it is an example in its own heading.
 */
export const EXAMPLE_RECORD: BatchRecord = {
  batch: 'VU25186',
  productSlug: 'vital-urea',
  productName: 'Vital Urea',
  analysis: 'SCU. N 32% min · S 13% min',
  pack: 'Bag - 50 kg',
  madeOn: '2026-06-14',
  releasedOn: '2026-06-19',
  status: 'released',
  certificateUrl: null,
}


/* ────────────────────────────────────────────────────────────────────────────────────────────────
 * THE SAMPLE TRACKER, on the same adapter.
 *
 * This is the other half of the Lab page and a different question: not "is this bag real" but
 * "where has my sample got to". It was built on 9 Sep against the same contract and deliberately
 * left unwired; it now sits on this file so the web team implements ONE integration rather than
 * finding a second one later. The same two rules hold: no customer detail in the response, ever —
 * the whole point of the blind chain is that the laboratory itself never knew whose sample it was,
 * so the tracker cannot leak what the laboratory did not know.
 * ──────────────────────────────────────────────────────────────────────────────────────────────── */

export type SampleStage = 'parcel' | 'reception' | 'coded' | 'split' | 'analysts' | 'compared' | 'released'

export const SAMPLE_STAGE_LABEL: Record<SampleStage, string> = {
  parcel: 'Your parcel is on its way',
  reception: 'Received at Sample Reception',
  coded: 'A code has been issued',
  split: 'Split 3 ways',
  analysts: 'With two analysts',
  compared: 'Compared, awaiting signature',
  released: 'Reported and released to you',
}

export type SampleRecord = { ref: string; receivedAt: string | null; stage: SampleStage; updatedAt: string | null; tests: string[] }
export type SampleResult = { ok: true; record: SampleRecord } | { ok: false; reason: 'not-found' | 'offline' }

export async function lookupSample(refRaw: string): Promise<SampleResult> {
  const ref = normaliseBatch(refRaw)
  if (!ref) return { ok: false, reason: 'not-found' }
  if (!O2S.enabled) return { ok: false, reason: 'offline' }
  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), O2S.timeoutMs)
  try {
    const res = await fetch(`${O2S.base}/sample/${encodeURIComponent(ref)}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    if (res.status === 404) return { ok: false, reason: 'not-found' }
    if (!res.ok) return { ok: false, reason: 'offline' }
    const j = await res.json()
    return {
      ok: true,
      record: {
        ref: String(j.ref ?? ref),
        receivedAt: j.received_at ? String(j.received_at) : null,
        stage: (j.stage ?? 'reception') as SampleStage,
        updatedAt: j.updated_at ? String(j.updated_at) : null,
        tests: Array.isArray(j.tests) ? j.tests.map(String) : [],
      },
    }
  } catch {
    return { ok: false, reason: 'offline' }
  } finally {
    window.clearTimeout(t)
  }
}

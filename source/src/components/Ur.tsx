import { useUrduMode } from '@/lib/readingMode'
import { ur, UR_REVIEW_NOTICE, UR_REVIEW_NOTICE_EN, UR_UI } from '@/data/urdu'

/**
 * An English label with its Urdu underneath, when the Urdu layer is on and a translation exists.
 * Never a replacement — see the header of data/urdu.ts. A string with no entry renders in English
 * alone, silently and correctly, rather than being transliterated or half-translated.
 */
export function Ur({ kind, en, className = '' }: { kind: 'crop' | 'stage' | 'band' | 'method' | 'soil' | 'ui'; en: string; className?: string }) {
  const [urdu] = useUrduMode()
  const t = urdu ? ur(kind, en) : undefined
  if (!t) return <>{en}</>
  return (
    <>
      {en}
      <span dir="rtl" lang="ur" className={`block urdu ${className}`}>{t}</span>
    </>
  )
}

/** Urdu on its own, for a button or a heading that already carries its English elsewhere. */
export function UrOnly({ k, className = '' }: { k: keyof typeof UR_UI; className?: string }) {
  const [urdu] = useUrduMode()
  if (!urdu) return null
  return <span dir="rtl" lang="ur" className={`block urdu ${className}`}>{UR_UI[k]}</span>
}

export function UrduToggle({ className = '' }: { className?: string }) {
  const [urdu, setUrdu] = useUrduMode()
  return (
    <button
      className={`btn btn-sm mode-btn ${className}`}
      aria-pressed={urdu}
      aria-label={urdu ? 'Turn the Urdu labels off' : 'Show Urdu labels beside the English'}
      lang="ur"
      onClick={() => setUrdu(!urdu)}
      title={urdu ? 'Turn the Urdu labels off' : 'Show Urdu labels beside the English'}
    >
      {urdu ? 'اردو ✓' : 'اردو'}
    </button>
  )
}

/**
 * The notice that travels with the Urdu layer. It is shown wherever the layer is switched on, in
 * Urdu first, because the reader it concerns is reading Urdu. Publishing an unreviewed translation
 * without saying so would be the same mistake as publishing an unreviewed yield model.
 */
export function UrduReviewNotice() {
  const [urdu] = useUrduMode()
  if (!urdu) return null
  return (
    <div className="panel-soft p-4 mt-4" style={{ borderStyle: 'dashed' }}>
      <p dir="rtl" lang="ur" className="urdu">{UR_REVIEW_NOTICE}</p>
      <p className="cap mt-2 max-w-[140ch]">{UR_REVIEW_NOTICE_EN}</p>
    </div>
  )
}

/**
 * An English UI label with its Urdu beneath it, keyed by UR_UI rather than by the English string.
 * Same rule as <Ur>: the Urdu is added, never substituted, and a missing key renders English alone.
 */
export function UrLabel({ k, en, className = '' }: { k: keyof typeof UR_UI; en: string; className?: string }) {
  const [urdu] = useUrduMode()
  if (!urdu || !UR_UI[k]) return <>{en}</>
  return (
    <>
      {en}
      <span dir="rtl" lang="ur" className={`block urdu ${className}`}>{UR_UI[k]}</span>
    </>
  )
}

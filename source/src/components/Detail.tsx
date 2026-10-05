import type { ReactNode } from 'react'
import { usePlainMode } from '@/lib/readingMode'

/**
 * Wraps the part of a page that ARGUES rather than INSTRUCTS. In Plain mode it collapses to a single
 * line naming what is inside, which the reader can open. In full mode it renders normally, so the
 * page an agronomist reads is unchanged.
 *
 * Read the rule in readingMode.ts before wrapping anything: rates, quantities, methods, packs,
 * bases, advisories and source notes never go inside a <Detail>.
 */
export function Detail({ label, children, bare = false }: { label: string; children: ReactNode; bare?: boolean }) {
  const [plain] = usePlainMode()
  if (!plain) return <>{children}</>
  return (
    // `bare` when the caller is already inside a .wrap — nesting .wrap in .wrap doubles the padding
    // and re-applies the max width, which is how a folded block ends up narrower than the page.
    <details className={bare ? '' : 'wrap sec-tight'}>
      <summary className="panel px-4 py-3 cursor-pointer font-bold" style={{ listStyle: 'revert' }}>
        {label}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

/** The toggle itself. Small, labelled with what it does rather than what it is called. */
export function PlainModeToggle({ className = '' }: { className?: string }) {
  const [plain, setPlain] = usePlainMode()
  return (
    <button
      className={`btn btn-sm mode-btn ${className}`}
      aria-pressed={plain}
      aria-label={plain ? 'Show the full page, with the evidence and the argument' : 'Simple view. Show just what to do; the evidence folds away and nothing is deleted'}
      onClick={() => setPlain(!plain)}
      title={plain ? 'Show the full page, with the evidence and the argument' : 'Show just what to do. The evidence folds away, nothing is deleted'}
    >
      {plain ? 'Full view' : 'Simple view'}
    </button>
  )
}

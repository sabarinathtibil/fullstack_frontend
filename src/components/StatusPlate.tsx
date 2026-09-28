import type { RequestState } from '../types'

interface StatusPlateProps {
  state: RequestState
  query: string
  errorMessage: string
  onClear: () => void
  onRetry: () => void
}

function StatusPlate({ state, query, errorMessage, onClear, onRetry }: StatusPlateProps) {
  if (state === 'success') return null

  if (state === 'loading') {
    return (
      <section className="status-plate status-plate--loading" role="status" aria-live="polite">
        <span className="status-mark status-mark--spinner" aria-hidden="true" />
        <div>
          <p className="status-eyebrow">PRODUCT REQUEST</p>
          <p className="status-message">Loading products…</p>
        </div>
      </section>
    )
  }

  if (state === 'empty') {
    return (
      <section className="status-plate status-plate--empty" role="status" aria-live="polite">
        <span className="status-mark" aria-hidden="true">0</span>
        <div className="status-copy">
          <p className="status-eyebrow">NO MATCHES</p>
          <p className="status-message">
            No products match {query ? <strong>“{query}”</strong> : 'your search'}.
          </p>
        </div>
        <button className="text-action" type="button" onClick={onClear}>
          Clear search
        </button>
      </section>
    )
  }

  return (
    <section className="status-plate status-plate--error" role="alert" aria-live="assertive">
      <span className="status-mark" aria-hidden="true">!</span>
      <div className="status-copy">
        <p className="status-eyebrow">REQUEST FAILED</p>
        <p className="status-message">{errorMessage}</p>
      </div>
      <button className="text-action" type="button" onClick={onRetry}>
        {query ? 'Retry search' : 'Retry loading products'}
      </button>
    </section>
  )
}

export default StatusPlate

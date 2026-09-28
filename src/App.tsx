import { useCallback, useEffect, useRef, useState } from 'react'
import ProductGrid from './components/ProductGrid'
import SearchForm from './components/SearchForm'
import StatusPlate from './components/StatusPlate'
import { API_BASE_URL, getProducts } from './api/products'
import type { Product, RequestState } from './types'
import './App.css'

function App() {
  const [draft, setDraft] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [requestState, setRequestState] = useState<RequestState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const activeController = useRef<AbortController | null>(null)

  const requestProducts = useCallback(async (search: string) => {
    activeController.current?.abort()
    const controller = new AbortController()
    activeController.current = controller
    setSubmittedQuery(search)
    setRequestState('loading')
    setErrorMessage('')

    try {
      const result = await getProducts(search, controller.signal)
      if (controller.signal.aborted) return
      setProducts(result.products)
      setTotal(result.total)
      setRequestState(result.products.length ? 'success' : 'empty')
    } catch (error) {
      if (controller.signal.aborted) return
      setErrorMessage(error instanceof Error ? error.message : 'Could not load products.')
      setRequestState('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    activeController.current = controller

    async function loadInitialProducts() {
      try {
        const result = await getProducts('', controller.signal)
        if (controller.signal.aborted) return
        setProducts(result.products)
        setTotal(result.total)
        setRequestState(result.products.length ? 'success' : 'empty')
      } catch (error) {
        if (controller.signal.aborted) return
        setErrorMessage(error instanceof Error ? error.message : 'Could not load products.')
        setRequestState('error')
      }
    }

    void loadInitialProducts()
    return () => controller.abort()
  }, [])

  function handleSubmit(search: string) {
    setDraft(search)
    void requestProducts(search)
  }

  function handleClear() {
    setDraft('')
    void requestProducts('')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Counter product catalog home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span className="brand-copy">
            <span className="brand-overline">INDEPENDENT API DEMO</span>
            <span className="brand-name">Counter</span>
          </span>
        </a>
        <p className="header-index">CATALOG <span>/</span> 001</p>
      </header>

      <main id="top" className="main-content">
        <section className="catalog-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">GOODS / EVERYDAY OBJECTS</p>
            <h1 id="page-title">The product shelf<span>.</span></h1>
            <p className="intro-description">
              A small catalog, fetched through your Express API.
            </p>
          </div>
          <p className="catalog-stamp" aria-label="Data source: DummyJSON">
            <span className="stamp-rule" aria-hidden="true" />
            DATA SOURCE<br />DUMMYJSON
          </p>
        </section>

        <div className="catalog-toolbar">
          <SearchForm
            value={draft}
            isLoading={requestState === 'loading'}
            onChange={setDraft}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
        </div>

        <StatusPlate
          state={requestState}
          query={submittedQuery}
          errorMessage={errorMessage}
          onClear={handleClear}
          onRetry={() => void requestProducts(submittedQuery)}
        />

        {requestState === 'success' && (
          <ProductGrid products={products} total={total} query={submittedQuery} />
        )}
      </main>

      <footer className="site-footer">
        <p>PRODUCTS, ROUTED THROUGH YOUR BACKEND.</p>
        <p className="api-target"><span>API TARGET</span><code>{API_BASE_URL}</code></p>
      </footer>
    </div>
  )
}

export default App

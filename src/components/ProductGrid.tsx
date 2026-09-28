import type { Product } from '../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  total: number
  query: string
}

function ProductGrid({ products, total, query }: ProductGridProps) {
  const countLabel = `Showing ${products.length.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'product' : 'products'}`

  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="results-heading-row">
        <h2 id="results-heading" className="results-heading">
          {query ? `Results for “${query}”` : 'All products'}
        </h2>
        <p className="results-count">{countLabel}</p>
      </div>
      <ul className="product-grid" aria-label="Products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  )
}

export default ProductGrid

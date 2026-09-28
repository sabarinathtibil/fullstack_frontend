import { useState } from 'react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <li className="product-card">
      <div className="product-image-wrap">
        {imageFailed ? (
          <div className="product-image-fallback" role="img" aria-label={`Image unavailable for ${product.title}`}>
            Image unavailable
          </div>
        ) : (
          <img
            className="product-image"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="product-details">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">{currencyFormatter.format(product.price)}</p>
      </div>
    </li>
  )
}

export default ProductCard

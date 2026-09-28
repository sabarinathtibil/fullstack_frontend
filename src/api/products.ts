import type { Product, ProductsResponse } from '../types'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
).replace(/\/+$/, '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number' &&
    typeof value.thumbnail === 'string'
  )
}

function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  )
}

function getErrorMessage(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.error)) return null
  return typeof value.error.message === 'string' ? value.error.message : null
}

export async function getProducts(
  search: string,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE_URL}/api/products`)
  const query = search.trim()
  if (query) url.searchParams.set('search', query)

  let response: Response
  try {
    response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error
    throw new Error('Could not reach the product API. Check its URL and availability.')
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('The product API returned an unreadable response.')
  }

  if (!response.ok) {
    const message = getErrorMessage(payload)
    throw new Error(message ?? `The product API returned an error (${response.status}).`)
  }

  if (!isProductsResponse(payload)) {
    throw new Error('The product API returned an unexpected response.')
  }

  return payload
}

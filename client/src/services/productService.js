import apiClient from './api/client'
import { normalizeProduct } from '../utils/catalog'

export async function getProducts(params = {}) {
  const { data } = await apiClient.get('/api/products', { params })
  return (data.products || []).map(normalizeProduct)
}

export async function getProductBySlug(slug) {
  const { data } = await apiClient.get(`/api/products/${slug}`)

  return {
    product: normalizeProduct(data.product),
    relatedProducts: (data.relatedProducts || []).map(normalizeProduct),
  }
}

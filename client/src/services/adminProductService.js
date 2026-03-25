import apiClient from './api/client'

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'

function normalizeVariant(variant = {}, index = 0) {
  return {
    id: variant.id || `variant-${index}`,
    size: variant.size || '',
    color: variant.color || '',
    stock: Number(variant.stock || 0),
    sku: variant.sku || '',
  }
}

function normalizeAdminProduct(product = {}, index = 0) {
  const variants = Array.isArray(product.variants) ? product.variants.map(normalizeVariant) : []

  return {
    id: product.id || `product-${index}`,
    name: product.name || 'Untitled product',
    slug: product.slug || '',
    description: product.description || 'No description added yet.',
    price: Number(product.price || 0),
    compareAtPrice: product.compareAtPrice !== null && product.compareAtPrice !== undefined
      ? Number(product.compareAtPrice)
      : null,
    imageUrl: product.imageUrl || fallbackImage,
    isFeatured: Boolean(product.isFeatured),
    categoryId: product.categoryId || '',
    category: product.category
      ? {
          id: product.category.id || '',
          name: product.category.name || 'Uncategorized',
          slug: product.category.slug || '',
        }
      : null,
    variants,
  }
}

export async function getAdminProducts() {
  const { data } = await apiClient.get('/api/admin/products')
  return (data.products || []).map(normalizeAdminProduct)
}

export async function createAdminProduct(payload) {
  const { data } = await apiClient.post('/api/admin/products', payload)
  return normalizeAdminProduct(data.product)
}

export async function updateAdminProduct(id, payload) {
  const { data } = await apiClient.put(`/api/admin/products/${id}`, payload)
  return normalizeAdminProduct(data.product)
}

export async function deleteAdminProduct(id) {
  const { data } = await apiClient.delete(`/api/admin/products/${id}`)
  return data
}

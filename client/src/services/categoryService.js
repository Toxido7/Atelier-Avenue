import apiClient from './api/client'
import { normalizeCategory } from '../utils/catalog'

export async function getCategories() {
  const { data } = await apiClient.get('/api/categories')
  return (data.categories || []).map(normalizeCategory)
}

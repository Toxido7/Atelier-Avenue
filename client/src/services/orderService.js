import apiClient from './api/client'

export async function getOrderById(id) {
  const { data } = await apiClient.get(`/api/orders/${id}`)
  return data.order
}

import apiClient from './api/client'

export async function loginAdmin(credentials) {
  const { data } = await apiClient.post('/api/admin/login', credentials)
  return data
}

export async function logoutAdmin() {
  const { data } = await apiClient.post('/api/admin/logout')
  return data
}

export async function getAdminMe() {
  const { data } = await apiClient.get('/api/admin/me')
  return data
}

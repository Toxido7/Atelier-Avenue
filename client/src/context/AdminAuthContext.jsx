import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAdminMe, loginAdmin as loginRequest, logoutAdmin as logoutRequest } from '../services/adminAuthService'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAdmin = async () => {
    try {
      const response = await getAdminMe()
      setAdmin(response.admin)
      setIsAuthenticated(response.isAuthenticated)
    } catch {
      setAdmin(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshAdmin()
  }, [])

  const login = async (credentials) => {
    const response = await loginRequest(credentials)
    setAdmin(response.admin)
    setIsAuthenticated(true)
    return response
  }

  const logout = async () => {
    await logoutRequest()
    setAdmin(null)
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshAdmin,
    }),
    [admin, isAuthenticated, isLoading],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }

  return context
}

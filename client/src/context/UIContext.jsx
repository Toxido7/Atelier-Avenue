import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)

  const clearToastTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(
    () => () => {
      clearToastTimeout()
    },
    [],
  )

  const showToast = (message, type = 'info') => {
    clearToastTimeout()
    setToast({ message, type })
    timeoutRef.current = window.setTimeout(() => {
      setToast(null)
      timeoutRef.current = null
    }, 2800)
  }

  const hideToast = () => {
    clearToastTimeout()
    setToast(null)
  }

  const value = useMemo(
    () => ({
      isCartOpen,
      isMobileMenuOpen,
      toast,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((current) => !current),
      openMobileMenu: () => setIsMobileMenuOpen(true),
      closeMobileMenu: () => setIsMobileMenuOpen(false),
      toggleMobileMenu: () => setIsMobileMenuOpen((current) => !current),
      showToast,
      hideToast,
    }),
    [isCartOpen, isMobileMenuOpen, toast],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)

  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }

  return context
}

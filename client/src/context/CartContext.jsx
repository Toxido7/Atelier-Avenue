import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { buildCartItemKey, calculateCartTotals, loadStoredCart, saveStoredCart } from '../utils/cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadStoredCart())

  useEffect(() => {
    saveStoredCart(cartItems)
  }, [cartItems])

  const addToCart = (itemToAdd) => {
    setCartItems((currentItems) => {
      const cartKey = buildCartItemKey(itemToAdd)
      const existingItem = currentItems.find((item) => item.cartKey === cartKey)

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartKey === cartKey
            ? {
                ...item,
                quantity: item.quantity + itemToAdd.quantity,
              }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          ...itemToAdd,
          cartKey,
        },
      ]
    })
  }

  const removeFromCart = (cartKey) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.cartKey !== cartKey))
  }

  const updateQuantity = (cartKey, quantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item,
      ),
    )
  }

  const replaceCartItems = (items) => {
    setCartItems(
      items.map((item) => ({
        ...item,
        cartKey: buildCartItemKey(item),
      })),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totals = useMemo(() => calculateCartTotals(cartItems), [cartItems])

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      replaceCartItems,
      clearCart,
      totals,
      itemCount: totals.itemCount,
    }),
    [cartItems, totals],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

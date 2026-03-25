const CART_STORAGE_KEY = 'atelier-cart'

export function buildCartItemKey({ productId, variantId, size = '', color = '' }) {
  return [productId, variantId || 'default', size || 'no-size', color || 'no-color'].join('__')
}

export function loadStoredCart() {
  if (typeof window === 'undefined') return []

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    const parsedCart = storedCart ? JSON.parse(storedCart) : []

    if (!Array.isArray(parsedCart)) return []

    return parsedCart.map((item) => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity) || 1),
      cartKey: item.cartKey || buildCartItemKey(item),
    }))
  } catch {
    return []
  }
}

export function saveStoredCart(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function calculateCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const uniqueItems = items.length
  const shipping = itemCount > 0 && subtotal < 200 ? 18 : 0
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
    uniqueItems,
  }
}

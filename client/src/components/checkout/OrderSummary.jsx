import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'

function OrderSummary({ items, totals }) {
  const cart = useCart()
  const displayItems = items || cart.cartItems
  const displayTotals = totals || cart.totals

  return (
    <aside className="surface-card h-fit space-y-6 p-6 lg:sticky lg:top-28">
      <h3 className="text-xl font-semibold">Order review</h3>
      <div className="space-y-4">
        {displayItems.map((item) => (
          <div key={item.cartKey || item.id} className="flex items-center gap-4">
            <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-stone">
                {item.size ? `Size ${item.size}` : 'Standard'}
                {item.color ? ` | ${item.color}` : ''}
                {` | Qty ${item.quantity}`}
              </p>
            </div>
            <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 border-t border-line pt-4 text-sm text-stone">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(displayTotals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{displayTotals.shipping === 0 ? 'Free' : formatPrice(displayTotals.shipping)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax</span>
          <span>{formatPrice(displayTotals.tax)}</span>
        </div>
        <div className="flex items-center justify-between font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(displayTotals.total)}</span>
        </div>
      </div>
    </aside>
  )
}

export default OrderSummary


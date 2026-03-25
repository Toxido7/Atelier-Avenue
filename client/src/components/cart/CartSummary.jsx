import { Link } from 'react-router-dom'
import Button from '../common/Button'
import { formatPrice } from '../../utils/format'

function CartSummary({
  totals,
  actionLabel = 'Proceed to Checkout',
  actionTo = '/checkout',
  onAction,
  showContinueShopping = true,
  showActions = true,
  className = '',
}) {
  return (
    <div className={`h-fit rounded-[26px] bg-mist/70 p-5 ${className}`.trim()}>
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Order summary</p>
          <h3 className="text-xl font-semibold text-ink">Estimated total</h3>
        </div>

        <div className="rounded-[22px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(17,17,17,0.04)]">
          <div className="space-y-4 text-sm text-stone">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4 font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="space-y-3">
            {actionTo ? (
              <Link to={actionTo} className="block" onClick={onAction}>
                <Button className="w-full">{actionLabel}</Button>
              </Link>
            ) : (
              <Button className="w-full" onClick={onAction}>
                {actionLabel}
              </Button>
            )}

            {showContinueShopping && (
              <Link to="/shop" className="block" onClick={onAction}>
                <Button variant="secondary" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartSummary

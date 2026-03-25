import QuantitySelector from '../product/QuantitySelector'
import { formatPrice } from '../../utils/format'

function CartItem({ item, onUpdateQuantity, onRemove, compact = false }) {
  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-[88px,1fr] items-start' : 'sm:grid-cols-[140px,1fr] items-start'} `}>
      <img
        src={item.imageUrl}
        alt={item.name}
        className={`${compact ? 'h-24 rounded-[22px]' : 'h-44 rounded-[24px]'} w-full object-cover`}
      />
      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className={`${compact ? 'text-base' : 'text-xl'} font-semibold leading-snug`}>{item.name}</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
            </div>
            <span className="text-sm font-semibold text-ink">{formatPrice(item.price)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/80 pt-4">
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => onUpdateQuantity(item.cartKey, item.quantity - 1)}
            onIncrease={() => onUpdateQuantity(item.cartKey, item.quantity + 1)}
            compact={compact}
          />
          <button type="button" onClick={() => onRemove(item.cartKey)} className="text-sm font-semibold text-stone transition hover:text-ink">
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem

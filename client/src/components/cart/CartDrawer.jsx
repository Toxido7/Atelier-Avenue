import { ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

function CartDrawer() {
  const { cartItems, removeFromCart, totals, updateQuantity } = useCart()
  const { closeCart, isCartOpen } = useUI()

  return (
    <div className={`fixed inset-0 z-[60] transition ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white transition duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mist">
              <ShoppingBag size={18} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Your cart</h2>
              <p className="text-sm text-stone">{totals.itemCount} items selected</p>
            </div>
          </div>
          <button type="button" onClick={closeCart} className="text-stone transition hover:text-ink" aria-label="Close cart drawer">
            <X size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center px-6 py-8">
            <div className="w-full space-y-6">
              <EmptyState
                title="Your cart is empty"
                description="Add a few curated pieces to see them here and continue the shopping flow."
              />
              <Link to="/shop" onClick={closeCart} className="block rounded-full border border-ink bg-ink px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">
                Explore shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-line/80 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone">Cart items</p>
                  <p className="text-sm text-stone">{totals.itemCount} pieces</p>
                </div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.cartKey} className="rounded-[28px] border border-line bg-white p-4 md:p-5">
                      <CartItem item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} compact />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 border-t border-line/80 pt-6">
                <CartSummary totals={totals} showActions={false} className="rounded-[30px]" />
              </section>

              <section className="space-y-3 border-t border-line/80 pt-6">
                <Link to="/checkout" className="block" onClick={closeCart}>
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
                <Link to="/shop" className="block" onClick={closeCart}>
                  <Button variant="secondary" className="w-full">Continue Shopping</Button>
                </Link>
                <Link to="/cart" onClick={closeCart} className="block">
                  <span className="block rounded-full border border-line px-6 py-3 text-center text-sm font-semibold text-stone transition hover:border-ink hover:text-ink">
                    View Full Cart
                  </span>
                </Link>
              </section>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer

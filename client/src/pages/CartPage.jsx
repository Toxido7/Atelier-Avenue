import { Link } from 'react-router-dom'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import EmptyState from '../components/common/EmptyState'
import SectionTitle from '../components/common/SectionTitle'
import Container from '../components/layout/Container'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, removeFromCart, totals, updateQuantity } = useCart()

  return (
    <section className="section-shell">
      <Container className="space-y-10">
        <SectionTitle
          eyebrow="Cart"
          title="A real cart flow powered by shared storefront state."
          description="Items here persist in local storage, merge by variant, and update live across the app."
        />

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Start with a few premium essentials and they will appear here with persistent cart state."
            actionLabel="Continue shopping"
            action={() => {
              window.location.href = '/shop'
            }}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="surface-card p-5">
                  <CartItem item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-28 lg:h-fit">
              <CartSummary totals={totals} showContinueShopping={false} />
              <Link to="/shop" className="mt-4 block rounded-full border border-line px-6 py-3 text-center text-sm font-semibold transition hover:border-ink">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

export default CartPage

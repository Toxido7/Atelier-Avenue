import { ArrowLeft, CircleX, RotateCcw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import Container from '../components/layout/Container'

function OrderCancelPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <section className="section-shell">
      <Container className="flex justify-center">
        <div className="surface-card max-w-3xl space-y-8 px-6 py-12 text-center md:px-10 md:py-14">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <CircleX size={54} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone">Payment Cancelled</p>
            <h1 className="text-4xl font-semibold tracking-tight">Checkout was canceled before payment confirmation.</h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone">
              No charge was captured. Your cart is still intact, so you can step back into checkout when you are ready or return to the catalog and keep browsing.
            </p>
            {orderId && <p className="text-sm font-medium text-ink">Order reference: {orderId}</p>}
          </div>

          <div className="grid gap-4 rounded-[28px] border border-line bg-mist/35 p-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone">Cart state</p>
              <p className="mt-3 text-sm font-medium text-ink">Preserved</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone">Payment</p>
              <p className="mt-3 text-sm font-medium text-ink">Not captured</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone">Next step</p>
              <p className="mt-3 text-sm font-medium text-ink">Retry or continue shopping</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/checkout">
              <Button className="w-full inline-flex items-center gap-2"><RotateCcw size={16} />Retry Checkout</Button>
            </Link>
            <Link to="/cart">
              <Button variant="secondary" className="w-full">Review Cart</Button>
            </Link>
            <Link to="/shop">
              <Button variant="ghost" className="w-full inline-flex items-center gap-2"><ArrowLeft size={16} />Back to Shop</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OrderCancelPage

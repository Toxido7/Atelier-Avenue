import { CheckCircle2, PackageCheck, RefreshCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import StatusBadge from '../components/common/StatusBadge'
import Container from '../components/layout/Container'
import { useCart } from '../context/CartContext'
import { getOrderById } from '../services/orderService'
import { formatDate, formatPrice } from '../utils/format'

function OrderSuccessPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const hasClearedCartRef = useRef(false)
  const [order, setOrder] = useState(location.state?.order || null)
  const [isLoading, setIsLoading] = useState(Boolean(searchParams.get('orderId')))
  const [error, setError] = useState('')

  const orderId = searchParams.get('orderId') || location.state?.order?.id
  const sessionId = searchParams.get('session_id')
  const paymentPending = useMemo(() => order && order.paymentStatus !== 'PAID', [order])

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const fetchedOrder = await getOrderById(orderId)
      setOrder(fetchedOrder)
    } catch {
      setError('We could not load the order confirmation details.')
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  useEffect(() => {
    if (hasClearedCartRef.current) {
      return
    }

    if (sessionId || order?.paymentStatus === 'PAID') {
      clearCart()
      hasClearedCartRef.current = true
    }
  }, [clearCart, order?.paymentStatus, sessionId])

  useEffect(() => {
    if (!orderId || !paymentPending) {
      return undefined
    }

    let attempts = 0
    const intervalId = window.setInterval(async () => {
      attempts += 1

      try {
        const refreshedOrder = await getOrderById(orderId)
        setOrder(refreshedOrder)

        if (refreshedOrder.paymentStatus === 'PAID' || attempts >= 6) {
          window.clearInterval(intervalId)
        }
      } catch {
        if (attempts >= 6) {
          window.clearInterval(intervalId)
        }
      }
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [orderId, paymentPending])

  if (isLoading) {
    return (
      <section className="section-shell">
        <Container className="flex justify-center">
          <Loader />
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-shell">
        <Container>
          <EmptyState title="Confirmation unavailable" description={error} actionLabel="Try Again" action={loadOrder} />
        </Container>
      </section>
    )
  }

  const customerName = order?.customer?.fullName
  const items = order?.items || []

  return (
    <section className="section-shell">
      <Container className="flex justify-center">
        <div className="surface-card max-w-4xl space-y-8 px-6 py-12 md:px-10 md:py-14">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={54} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone">Order Confirmation</p>
            <h1 className="text-4xl font-semibold tracking-tight">Your checkout has been handed off successfully.</h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone">
              {customerName
                ? `${customerName}, your order is safely recorded and we are reflecting the latest backend payment status below.`
                : 'Your order is safely recorded and we are reflecting the latest backend payment status below.'}
            </p>
          </div>

          {order ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[28px] border border-line bg-mist/35 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Order ID</p>
                  <p className="mt-3 text-sm font-medium break-all text-ink">{order.id}</p>
                </div>
                <div className="rounded-[28px] border border-line bg-mist/35 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Customer</p>
                  <p className="mt-3 text-sm font-medium text-ink">{customerName || 'Guest checkout'}</p>
                </div>
                <div className="rounded-[28px] border border-line bg-mist/35 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Payment</p>
                  <div className="mt-3"><StatusBadge value={order.paymentStatus} /></div>
                </div>
                <div className="rounded-[28px] border border-line bg-mist/35 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Order Status</p>
                  <div className="mt-3"><StatusBadge value={order.status} /></div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-[28px] border border-line p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Order Total</p>
                      <p className="mt-2 text-2xl font-semibold text-ink">{formatPrice(order.totalAmount)}</p>
                    </div>
                    {paymentPending && (
                      <Button variant="secondary" size="sm" onClick={loadOrder} className="inline-flex items-center gap-2">
                        <RefreshCcw size={16} />
                        Refresh Status
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Placed</p>
                      <p className="mt-2 text-sm font-medium text-ink">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Payment Method</p>
                      <p className="mt-2 text-sm font-medium text-ink">{order.paymentMethod || 'Stripe Checkout'}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-[28px] border p-6 ${paymentPending ? 'border-amber-200 bg-amber-50/70' : 'border-emerald-200 bg-emerald-50/70'}`}>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-stone">
                    <PackageCheck size={16} /> Confirmation state
                  </div>
                  <p className="mt-4 text-lg font-semibold text-ink">
                    {paymentPending ? 'Stripe is still finishing confirmation.' : 'Payment confirmed and cart cleared.'}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone">
                    {paymentPending
                      ? 'This can happen briefly if the success page loads before the webhook finishes updating the order. Refresh the status in a moment if needed.'
                      : 'Your backend now reflects the confirmed payment state, so this order is ready for the next fulfillment step.'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="Order recorded"
              description="Stripe returned successfully, but detailed order data was not available in this view."
            />
          )}

          {items.length > 0 && (
            <div className="space-y-4 rounded-[28px] border border-line p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Order summary</h2>
                <span className="text-sm text-stone">{items.length} item{items.length === 1 ? '' : 's'}</span>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[24px] bg-mist/45 px-4 py-3">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-ink">{item.product?.name}</p>
                      <p className="text-sm text-stone">
                        {item.variant?.size ? `Size ${item.variant.size}` : 'Standard'}
                        {item.variant?.color ? ` | ${item.variant.color}` : ''}
                        {` | Qty ${item.quantity}`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-ink">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 text-center">
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default OrderSuccessPage


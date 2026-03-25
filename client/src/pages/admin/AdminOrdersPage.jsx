import { Eye, Filter, RefreshCcw, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminListSkeleton from '../../components/admin/AdminListSkeleton'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import StatusBadge from '../../components/common/StatusBadge'
import { useUI } from '../../context/UIContext'
import { getAdminOrders } from '../../services/adminOrderService'
import { formatDate, formatPrice } from '../../utils/format'

function getUniqueStatuses(order) {
  return [order.paymentStatus, order.status].filter((value, index, array) => value && array.indexOf(value) === index)
}

function AdminOrdersPage() {
  const { showToast } = useUI()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [search, setSearch] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [loadError, setLoadError] = useState('')

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setLoadError('')
      const orderData = await getAdminOrders({
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      })
      setOrders(Array.isArray(orderData) ? orderData : [])
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load orders right now.'
      setLoadError(message)
      showToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [status, paymentStatus])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!search) return true

      const haystack = [order.id, order.customer.fullName, order.customer.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(search.toLowerCase())
    })
  }, [orders, search])

  const paidCount = useMemo(() => orders.filter((order) => order.paymentStatus === 'PAID').length, [orders])
  const processingCount = useMemo(() => orders.filter((order) => order.status === 'PROCESSING').length, [orders])

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
        <AdminPageHeader
          eyebrow="Order Management"
          title="Customer orders without the layout fighting you"
          description="A flatter filter bar, roomier table, calmer badges, and cleaner detail panels built for real ecommerce admin use."
        />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Orders in view" value={filteredOrders.length} hint="Current result set after filters and search." icon={ShoppingBag} accent="default" />
        <AdminStatCard label="Paid" value={paidCount} hint="Webhook-confirmed payments reflected from Stripe." icon={RefreshCcw} accent="green" />
        <AdminStatCard label="Processing" value={processingCount} hint="Orders already moved beyond the initial pending state." icon={Filter} accent="default" />
      </div>

      <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Filters</p>
            <h2 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-ink">Order list</h2>
            <p className="mt-2 text-sm leading-7 text-stone">Search by customer or order reference, then narrow by payment and fulfillment state.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus('')
                setPaymentStatus('')
                setSearch('')
              }}
              className="inline-flex items-center gap-2 rounded-[16px] px-3 py-2 text-sm font-semibold text-stone transition hover:bg-[#f2ece3] hover:text-ink"
            >
              <Filter size={16} />Reset filters
            </button>
            <button
              type="button"
              onClick={loadOrders}
              className="inline-flex items-center gap-2 rounded-[16px] px-3 py-2 text-sm font-semibold text-stone transition hover:bg-[#f2ece3] hover:text-ink"
            >
              <RefreshCcw size={16} />Refresh list
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.2fr),0.85fr,0.85fr,auto] lg:items-end">
          <Input
            label="Search"
            className="rounded-[16px]"
            placeholder="Order id or customer"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select label="Order status" className="rounded-[16px]" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
          <Select label="Payment status" className="rounded-[16px]" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </Select>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <StatusBadge value={`${filteredOrders.length} orders`} />
            {status && <StatusBadge value={status} />}
            {paymentStatus && paymentStatus !== status && <StatusBadge value={paymentStatus} />}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-[#fbfaf7] shadow-[0_14px_38px_rgba(17,17,17,0.04)]">
        {isLoading ? (
          <div className="p-6"><AdminListSkeleton rows={5} /></div>
        ) : loadError ? (
          <div className="p-6"><EmptyState title="Orders unavailable" description={loadError} actionLabel="Try Again" action={loadOrders} /></div>
        ) : filteredOrders.length ? (
          <>
            <div className="hidden grid-cols-[1.15fr,0.9fr,0.8fr,0.72fr,0.8fr,126px] gap-4 bg-[#f6f1ea] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone xl:grid">
              <span>Order</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-black/5 bg-white">
              {filteredOrders.map((order) => (
                <div key={order.id} className="px-6 py-5">
                  <div className="hidden xl:grid xl:grid-cols-[1.15fr,0.9fr,0.8fr,0.72fr,0.8fr,126px] xl:gap-4 xl:items-start">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{order.id}</p>
                      <p className="mt-2 text-sm text-stone">{order.items.length} item{order.items.length === 1 ? '' : 's'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{order.customer.fullName}</p>
                      <p className="mt-2 truncate text-sm text-stone">{order.customer.email || order.customer.phone || 'No contact info'}</p>
                    </div>
                    <p className="text-sm leading-6 text-stone">{formatDate(order.createdAt)}</p>
                    <p className="text-base font-semibold text-ink">{formatPrice(order.totalAmount)}</p>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueStatuses(order).map((statusValue) => (
                        <StatusBadge key={`${order.id}-${statusValue}`} value={statusValue} />
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedOrderId((current) => (current === order.id ? null : order.id))}
                      className="inline-flex items-center gap-2 rounded-[16px]"
                    >
                      <Eye size={14} />
                      {expandedOrderId === order.id ? 'Hide' : 'Details'}
                    </Button>
                  </div>

                  <div className="space-y-4 xl:hidden">
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{order.id}</p>
                      <p className="text-lg font-semibold text-ink">{order.customer.fullName}</p>
                      <p className="text-sm text-stone">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="grid gap-3 rounded-[20px] bg-[#f6f1ea] p-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Total</p>
                        <p className="mt-2 font-semibold text-ink">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Items</p>
                        <p className="mt-2 font-semibold text-ink">{order.items.length}</p>
                      </div>
                      <div className="flex flex-wrap items-start gap-2">
                        {getUniqueStatuses(order).map((statusValue) => (
                          <StatusBadge key={`${order.id}-mobile-${statusValue}`} value={statusValue} />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedOrderId((current) => (current === order.id ? null : order.id))}
                      className="inline-flex items-center gap-2 rounded-[16px]"
                    >
                      <Eye size={14} />
                      {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="mt-5 grid gap-4 rounded-[22px] border border-black/5 bg-[#f6f1ea] p-4 xl:grid-cols-[0.9fr,1.15fr]">
                      <div className="rounded-[18px] border border-black/5 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Customer</p>
                        <p className="mt-2 font-semibold text-ink">{order.customer.fullName}</p>
                        <div className="mt-4 grid gap-2 text-sm text-stone">
                          <p><span className="font-medium text-ink">Email:</span> {order.customer.email || 'N/A'}</p>
                          <p><span className="font-medium text-ink">Phone:</span> {order.customer.phone || 'N/A'}</p>
                          <p><span className="font-medium text-ink">City:</span> {order.customer.city || 'N/A'}</p>
                          <p><span className="font-medium text-ink">Address:</span> {order.customer.address || 'N/A'}</p>
                          <p><span className="font-medium text-ink">Payment method:</span> {order.paymentMethod || 'Stripe Checkout'}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 rounded-[18px] border border-black/5 bg-white px-4 py-3">
                            <img src={item.product.imageUrl} alt={item.product.name} className="h-16 w-16 rounded-2xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-ink">{item.product.name}</p>
                              <p className="mt-1 text-sm text-stone">
                                {item.variant?.size ? `Size ${item.variant.size}` : 'Standard'}
                                {item.variant?.color ? ` • ${item.variant.color}` : ''}
                                {` • Qty ${item.quantity}`}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-ink">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No orders match these filters"
              description="Try broadening the filters or complete a fresh test checkout to populate the order stream."
              actionLabel="Reset Filters"
              action={() => {
                setStatus('')
                setPaymentStatus('')
                setSearch('')
              }}
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminOrdersPage

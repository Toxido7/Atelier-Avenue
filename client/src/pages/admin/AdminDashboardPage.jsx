import { ArrowRight, CreditCard, FolderKanban, Package, Plus, ShoppingBag, Sparkles, Store } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminListSkeleton from '../../components/admin/AdminListSkeleton'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatCard from '../../components/admin/AdminStatCard'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getCategories } from '../../services/categoryService'
import { getAdminOrders } from '../../services/adminOrderService'
import { getAdminProducts } from '../../services/adminProductService'
import { formatDate, formatPrice } from '../../utils/format'

function getUniqueStatuses(order) {
  return [order.paymentStatus, order.status].filter((value, index, array) => value && array.indexOf(value) === index)
}

function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      setLoadError('')
      const [productData, orderData, categoryData] = await Promise.all([
        getAdminProducts(),
        getAdminOrders(),
        getCategories(),
      ])
      setProducts(productData)
      setOrders(orderData)
      setCategories(categoryData)
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Unable to load dashboard data right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const paidOrders = useMemo(() => orders.filter((order) => order.paymentStatus === 'PAID').length, [orders])
  const pendingOrders = useMemo(() => orders.filter((order) => order.paymentStatus === 'PENDING').length, [orders])
  const featuredProducts = useMemo(() => products.filter((product) => product.isFeatured).length, [products])
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])
  const recentProducts = useMemo(() => products.slice(0, 3), [products])

  const statCards = [
    { label: 'Total products', value: products.length, hint: 'Catalog entries currently visible to shoppers.', icon: Package, accent: 'default' },
    { label: 'Total orders', value: orders.length, hint: 'All recorded orders from checkout and Stripe.', icon: ShoppingBag, accent: 'default' },
    { label: 'Paid orders', value: paidOrders, hint: 'Webhook-confirmed payments reflected in backend state.', icon: CreditCard, accent: 'green' },
    { label: 'Pending orders', value: pendingOrders, hint: 'Orders still waiting on payment confirmation.', icon: Sparkles, accent: 'amber' },
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
        <AdminPageHeader
          eyebrow="Dashboard"
          title="A calmer view of store operations"
          description="See sales activity, jump into catalog work, and keep recent customer orders easy to scan without the admin feeling bulky or unfinished."
          actions={[
            <Link key="add-product" to="/admin/products"><Button className="inline-flex items-center gap-2 rounded-[16px]"><Plus size={16} />Add Product</Button></Link>,
            <Link key="orders" to="/admin/orders"><Button variant="secondary" className="rounded-[16px]">Manage Orders</Button></Link>,
            <Link key="store" to="/"><Button variant="ghost" className="inline-flex items-center gap-2 rounded-[16px]"><Store size={16} />View Storefront</Button></Link>,
          ]}
        />
      </section>

      {isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
                <div className="h-4 w-24 animate-pulse rounded bg-black/5" />
                <div className="mt-4 h-10 w-20 animate-pulse rounded bg-black/5" />
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-black/5" />
              </div>
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.25fr,0.9fr]">
            <div className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)]"><AdminListSkeleton rows={4} /></div>
            <div className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)]"><AdminListSkeleton rows={3} /></div>
          </div>
        </>
      ) : loadError ? (
        <EmptyState title="Dashboard unavailable" description={loadError} actionLabel="Try Again" action={loadDashboard} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => <AdminStatCard key={card.label} {...card} />)}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr,0.92fr]">
            <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Recent Orders</p>
                  <h2 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-ink">Latest storefront activity</h2>
                </div>
                <Link to="/admin/orders" className="text-sm font-semibold text-stone transition hover:text-ink">View all orders</Link>
              </div>

              {recentOrders.length ? (
                <div className="mt-6 overflow-hidden rounded-[22px] border border-black/5 bg-white">
                  <div className="hidden grid-cols-[1.25fr,0.9fr,0.9fr,0.7fr] gap-4 bg-[#f6f1ea] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone md:grid">
                    <span>Customer</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span>Total</span>
                  </div>
                  <div className="divide-y divide-black/5">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.25fr,0.9fr,0.9fr,0.7fr] md:items-center">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{order.customer.fullName}</p>
                          <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{order.id}</p>
                        </div>
                        <p className="text-sm text-stone">{formatDate(order.createdAt)}</p>
                        <div className="flex flex-wrap gap-2">
                          {getUniqueStatuses(order).map((status) => (
                            <StatusBadge key={`${order.id}-${status}`} value={status} />
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-ink">{formatPrice(order.totalAmount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6"><EmptyState title="No orders yet" description="Run a checkout flow from the storefront and fresh order activity will appear here." /></div>
              )}
            </section>

            <div className="space-y-5">
              <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Quick Actions</p>
                <div className="mt-4 grid gap-3">
                  <Link to="/admin/products" className="rounded-[20px] border border-black/5 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,17,17,0.06)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">Add or edit products</p>
                        <p className="mt-1 text-sm text-stone">Update imagery, pricing, and variants.</p>
                      </div>
                      <ArrowRight size={18} className="text-stone" />
                    </div>
                  </Link>
                  <Link to="/admin/orders" className="rounded-[20px] border border-black/5 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,17,17,0.06)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">Review orders</p>
                        <p className="mt-1 text-sm text-stone">Check payment state and customer detail.</p>
                      </div>
                      <ArrowRight size={18} className="text-stone" />
                    </div>
                  </Link>
                  <Link to="/" className="rounded-[20px] border border-black/5 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,17,17,0.06)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">View storefront</p>
                        <p className="mt-1 text-sm text-stone">Preview the customer-facing shopping experience.</p>
                      </div>
                      <ArrowRight size={18} className="text-stone" />
                    </div>
                  </Link>
                </div>
              </section>

              <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Merchandising Snapshot</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Catalog health</h2>
                  </div>
                  <FolderKanban size={18} className="text-stone" />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-black/5 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Featured</p>
                    <p className="mt-3 text-2xl font-semibold text-ink">{featuredProducts}</p>
                  </div>
                  <div className="rounded-[20px] border border-black/5 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Categories</p>
                    <p className="mt-3 text-2xl font-semibold text-ink">{categories.length}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Recent products</p>
                    <Link to="/admin/products" className="text-sm font-semibold text-stone transition hover:text-ink">Manage</Link>
                  </div>
                  {recentProducts.length ? (
                    recentProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-[56px,minmax(0,1fr),auto] items-center gap-3 rounded-[20px] border border-black/5 bg-white px-3 py-3">
                        <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-ink">{product.name}</p>
                            {product.isFeatured && <StatusBadge value="Featured" className="hidden sm:inline-flex" />}
                          </div>
                          <p className="mt-1 text-sm text-stone">{product.category?.name || 'Uncategorized'} / {formatPrice(product.price)}</p>
                        </div>
                        {!product.isFeatured ? (
                          <span className="text-xs font-medium text-stone">Standard</span>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-stone">No product activity yet.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboardPage

import { LayoutDashboard, LogOut, Menu, Package, ShoppingBag, Store, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useUI } from '../../context/UIContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

const pageMeta = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview, quick actions, and recent store activity.' },
  '/admin/products': { title: 'Products', subtitle: 'Catalog, pricing, featured states, and variant editing.' },
  '/admin/orders': { title: 'Orders', subtitle: 'Customer purchases, payment state, and fulfillment detail.' },
}

function AdminLayout() {
  const location = useLocation()
  const { admin, logout } = useAdminAuth()
  const { showToast } = useUI()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const currentMeta = useMemo(() => pageMeta[location.pathname] || pageMeta['/admin'], [location.pathname])

  const handleLogout = async () => {
    await logout()
    showToast('Admin session closed.', 'info')
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-ink">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.78),_transparent_25%),linear-gradient(180deg,#f4f1ea_0%,#efeae2_100%)]">
        <div className="mx-auto grid min-h-screen max-w-[1480px] gap-5 px-4 py-4 md:px-6 lg:grid-cols-[248px,minmax(0,1fr)] lg:px-8">
          <div
            className={`fixed inset-0 z-40 bg-black/25 transition lg:hidden ${
              isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />

          <aside
            className={`fixed inset-y-4 left-4 z-50 flex w-[86%] max-w-[296px] flex-col overflow-hidden rounded-[28px] border border-black/5 bg-[#fbfaf7] p-4 shadow-[0_24px_60px_rgba(17,17,17,0.12)] transition duration-300 lg:sticky lg:top-4 lg:z-auto lg:h-[calc(100vh-2rem)] lg:w-auto lg:max-w-none lg:shadow-[0_16px_42px_rgba(17,17,17,0.06)] ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-[115%] lg:translate-x-0'
            }`}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
              <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-stone">Admin Workspace</p>
                  <Link to="/admin" className="mt-2 block text-[1.4rem] font-semibold tracking-tight text-ink">
                    Atelier Admin
                  </Link>
                  <p className="mt-2 max-w-[18rem] text-sm leading-6 text-stone">
                    Calm, premium controls for products, orders, and storefront upkeep.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-2xl border border-black/5 p-2 text-stone transition hover:bg-black/5 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-[22px] border border-black/5 bg-[#f6f1e9] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Signed in</p>
                <p className="mt-2 text-sm font-semibold text-ink">Portfolio Admin</p>
                <p className="mt-1 text-sm text-stone break-all">{admin?.email || 'admin@example.com'}</p>
              </div>

              <nav className="mt-5 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-ink text-white shadow-[0_14px_30px_rgba(17,17,17,0.14)]'
                            : 'text-stone hover:bg-[#f2ece3] hover:text-ink'
                        }`
                      }
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/90 shrink-0">
                        <Icon size={18} />
                      </div>
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>

              <div className="mt-auto space-y-2 border-t border-black/5 pt-4">
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm font-medium text-stone transition hover:bg-[#f2ece3] hover:text-ink"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white shrink-0">
                    <Store size={18} />
                  </div>
                  <span className="truncate">Storefront</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left text-sm font-medium text-stone transition hover:bg-[#f2ece3] hover:text-ink"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white shrink-0">
                    <LogOut size={18} />
                  </div>
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0 pb-8">
            <div className="sticky top-4 z-30 mb-5 rounded-[24px] border border-black/5 bg-[#fbfaf7]/92 px-4 py-4 shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur md:px-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white text-ink shadow-sm lg:hidden"
                  >
                    <Menu size={18} />
                  </button>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone">{currentMeta.title}</p>
                    <p className="mt-1 text-sm text-stone">{currentMeta.subtitle}</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
                  >
                    <Store size={15} />
                    Storefront
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

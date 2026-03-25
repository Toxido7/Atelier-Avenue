import { Link, NavLink } from 'react-router-dom'
import { useUI } from '../../context/UIContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
]

function MobileMenu() {
  const { closeMobileMenu, isMobileMenuOpen } = useUI()

  return (
    <div
      className={`fixed inset-0 z-50 transition ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isMobileMenuOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMobileMenu}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white px-6 py-6 transition duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-line pb-5">
          <Link to="/" onClick={closeMobileMenu} className="text-lg font-semibold tracking-[0.2em] uppercase">
            Atelier
          </Link>
          <button onClick={closeMobileMenu} className="text-sm font-medium uppercase tracking-[0.2em]">
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 py-8 text-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 transition ${isActive ? 'bg-mist text-ink' : 'text-stone hover:bg-mist'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/shop"
          onClick={closeMobileMenu}
          className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}

export default MobileMenu

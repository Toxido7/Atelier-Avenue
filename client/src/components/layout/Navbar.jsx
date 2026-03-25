import { Menu, Search, ShoppingBag } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import Button from '../common/Button'
import Container from './Container'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
]

function Navbar() {
  const { itemCount } = useCart()
  const { openCart, openMobileMenu } = useUI()

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={openMobileMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-ink"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>

        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.42em] text-ink sm:text-base">
          Atelier Avenue
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-stone lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-ink ${isActive ? 'text-ink' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-ink sm:inline-flex"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-ink"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link to="/shop" className="hidden sm:block">
            <Button>Shop New</Button>
          </Link>
        </div>
      </Container>
    </header>
  )
}

export default Navbar

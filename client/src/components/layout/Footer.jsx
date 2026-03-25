import { Link } from 'react-router-dom'
import Container from './Container'

function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.5fr,1fr,1fr,1fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.36em] text-ink">Atelier Avenue</p>
          <p className="max-w-sm text-sm leading-7 text-stone">
            A modern fashion storefront focused on clean styling, elevated essentials, and a smoother premium shopping experience.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em]">Navigate</h3>
          <div className="flex flex-col gap-3 text-sm text-stone">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em]">Collections</h3>
          <div className="flex flex-col gap-3 text-sm text-stone">
            <span>Outerwear</span>
            <span>Knitwear</span>
            <span>Footwear</span>
            <span>Accessories</span>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em]">Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-stone">
            <a href="mailto:aoueslati463@gmail.com" className="transition hover:text-ink">aoueslati463@gmail.com</a>
            <a href="https://github.com/Toxido7" target="_blank" rel="noreferrer" className="transition hover:text-ink">github.com/Toxido7</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

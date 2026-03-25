import { Route, Routes, useLocation } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminRoute from '../components/admin/AdminRoute'
import CartDrawer from '../components/cart/CartDrawer'
import Toast from '../components/common/Toast'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import Footer from '../components/layout/Footer'
import MobileMenu from '../components/layout/MobileMenu'
import Navbar from '../components/layout/Navbar'
import ScrollToTop from '../components/layout/ScrollToTop'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import OrderCancelPage from '../pages/OrderCancelPage'
import OrderSuccessPage from '../pages/OrderSuccessPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import ShopPage from '../pages/ShopPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'

function AppRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Toast />
      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Navbar />
          <MobileMenu />
          <CartDrawer />
        </>
      )}

      <main>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>

          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/order/cancel" element={<OrderCancelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default AppRoutes

import { useState } from 'react'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import EmptyState from '../components/common/EmptyState'
import SectionTitle from '../components/common/SectionTitle'
import Container from '../components/layout/Container'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { createCheckoutSession, redirectToCheckout } from '../services/checkoutService'
import { getProductBySlug } from '../services/productService'

function CheckoutPage() {
  const { cartItems, replaceCartItems } = useCart()
  const { showToast } = useUI()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reconcileCartItems = async () => {
    const reconciled = await Promise.all(
      cartItems.map(async (item) => {
        const { product } = await getProductBySlug(item.slug)

        if (!product?.id) {
          throw new Error(`We could not refresh ${item.name}. Please remove it from the cart and try again.`)
        }

        const matchedVariant =
          product.variants.find((variant) => {
            const sizeMatches = item.size ? variant.size === item.size : true
            const colorMatches = item.color ? variant.color === item.color : true
            return sizeMatches && colorMatches
          }) || null

        if (product.variants.length > 0 && !matchedVariant) {
          throw new Error(`The selected option for ${item.name} is no longer available. Please update your cart and try again.`)
        }

        return {
          ...item,
          productId: product.id,
          variantId: matchedVariant?.id || null,
          price: product.price,
          imageUrl: product.imageUrl || item.imageUrl,
          stock: matchedVariant?.stock ?? item.stock,
        }
      }),
    )

    replaceCartItems(reconciled)
    return reconciled
  }

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)

      const reconciledItems = await reconcileCartItems()

      const session = await createCheckoutSession({
        customer: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: `${formData.address}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        },
        paymentMethod: formData.paymentMethod,
        items: reconciledItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      })

      showToast('Redirecting to secure Stripe Checkout...', 'info')
      await redirectToCheckout(session.url)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'We could not start Stripe Checkout. Please try again.'
      showToast(message, 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-shell">
      <Container className="space-y-10">
        <SectionTitle
          eyebrow="Checkout"
          title="A premium checkout flow with Stripe Checkout in test mode."
          description="Your order is prepared on the backend, then you are redirected to Stripe's hosted payment page for a clean and beginner-friendly test checkout flow."
        />

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your checkout is empty"
            description="Add products to the cart before moving into checkout."
            actionLabel="Return to shop"
            action={() => {
              window.location.href = '/shop'
            }}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <OrderSummary />
          </div>
        )}
      </Container>
    </section>
  )
}

export default CheckoutPage

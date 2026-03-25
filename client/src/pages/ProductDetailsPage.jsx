import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import SectionTitle from '../components/common/SectionTitle'
import Skeleton from '../components/common/Skeleton'
import Container from '../components/layout/Container'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import ColorSelector from '../components/product/ColorSelector'
import ProductGallery from '../components/product/ProductGallery'
import ProductGrid from '../components/product/ProductGrid'
import ProductGridSkeleton from '../components/product/ProductGridSkeleton'
import QuantitySelector from '../components/product/QuantitySelector'
import SizeSelector from '../components/product/SizeSelector'
import { getProductBySlug } from '../services/productService'
import { formatPrice } from '../utils/format'

function ProductDetailsPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { openCart, showToast } = useUI()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const [selectionError, setSelectionError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await getProductBySlug(slug)
        setProduct(data.product)
        setRelatedProducts(data.relatedProducts)
        setActiveImage(data.product.images?.[0] || data.product.imageUrl || '')
        setSelectedSize('')
        setSelectedColor('')
        setQuantity(1)
        setSelectionError('')
      } catch {
        setError('We could not load this product right now.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  const selectedVariant = useMemo(() => {
    if (!product) return null

    return (
      product.variants.find((variant) => {
        const sizeMatches = product.sizes.length ? variant.size === selectedSize : true
        const colorMatches = product.colors.length ? variant.color === selectedColor : true
        return sizeMatches && colorMatches
      }) || null
    )
  }, [product, selectedColor, selectedSize])

  if (isLoading) {
    return (
      <section className="section-shell">
        <Container className="space-y-16">
          <div className="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
            <div className="space-y-4">
              <Skeleton className="aspect-[4/5] w-full rounded-[32px]" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="aspect-square w-full rounded-3xl" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-24 w-full rounded-[28px]" />
            </div>
          </div>
          <ProductGridSkeleton />
        </Container>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="section-shell">
        <Container>
          <EmptyState
            title="Product not found"
            description={error || 'This product is no longer available in the current catalog.'}
            actionLabel="Return to shop"
            action={() => {
              window.location.href = '/shop'
            }}
          />
        </Container>
      </section>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      const message = 'Please select a size before adding this item.'
      setSelectionError(message)
      showToast(message, 'error')
      return
    }

    if (product.colors?.length && !selectedColor) {
      const message = 'Please select a color before adding this item.'
      setSelectionError(message)
      showToast(message, 'error')
      return
    }

    if (!selectedVariant && product.variants.length > 0) {
      const message = 'Please choose a valid product variant before adding to cart.'
      setSelectionError(message)
      showToast(message, 'error')
      return
    }

    setSelectionError('')

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] || product.imageUrl,
      size: selectedVariant?.size || selectedSize,
      color: selectedVariant?.color || selectedColor,
      variantId: selectedVariant?.id || null,
      quantity,
      stock: selectedVariant?.stock ?? 0,
    })

    showToast(`${product.name} added to cart.`, 'success')
    openCart()
  }

  return (
    <section className="section-shell">
      <Container className="space-y-14 md:space-y-16">
        <div className="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
          <ProductGallery
            images={product.images}
            activeImage={activeImage}
            onSelectImage={setActiveImage}
          />

          <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-stone">
                {product.categoryLabel}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{product.name}</h1>
              <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
              <p className="max-w-xl text-base leading-8 text-stone">{product.description}</p>
            </div>

            <div className="rounded-[28px] border border-line bg-white p-5 md:p-6">
              <div className="space-y-6">
                <ColorSelector colors={product.colors} selectedColor={selectedColor} onChange={setSelectedColor} />
                <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onChange={setSelectedSize} />
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                  onIncrease={() => setQuantity((current) => current + 1)}
                />
                {selectionError && <p className="text-sm font-medium text-rose-500">{selectionError}</p>}
                {selectedVariant && (
                  <p className="text-sm text-stone">SKU {selectedVariant.sku} • {selectedVariant.stock} in stock</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="sm:flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Link to="/cart" className="sm:flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>

            <div className="surface-card space-y-4 p-6 text-sm leading-7 text-stone">
              <p>
                Product details, variants, and related products are powered by the backend API while preserving the same editorial presentation and cart behavior.
              </p>
              <Link to="/cart" className="font-semibold text-ink">
                Preview cart UI
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <SectionTitle
            eyebrow="Related Products"
            title="Pair it with complementary essentials."
            description="This section is now driven directly from the product detail API response."
          />
          {relatedProducts.length ? <ProductGrid products={relatedProducts} /> : <EmptyState title="No related products yet" description="This item currently stands on its own in the catalog, but the section is ready for future merchandising logic." />}
        </div>
      </Container>
    </section>
  )
}

export default ProductDetailsPage

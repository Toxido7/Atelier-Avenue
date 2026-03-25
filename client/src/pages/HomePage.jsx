import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Input from '../components/common/Input'
import SectionTitle from '../components/common/SectionTitle'
import Skeleton from '../components/common/Skeleton'
import Container from '../components/layout/Container'
import ProductGrid from '../components/product/ProductGrid'
import ProductGridSkeleton from '../components/product/ProductGridSkeleton'
import { getCategories } from '../services/categoryService'
import { getProducts } from '../services/productService'
import { buildDepartmentHighlights } from '../utils/catalog'
import { featuredCollections } from '../utils/mockData'

const heroFallbackImage =
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'

function HomePage() {
  const [featuredDepartments, setFeaturedDepartments] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [categoryData, latestProducts, featuredCatalog] = await Promise.all([
          getCategories(),
          getProducts({ sort: 'newest' }),
          getProducts({ featured: true, sort: 'popular' }),
        ])

        setFeaturedDepartments(buildDepartmentHighlights(categoryData).slice(0, 4))
        setNewArrivals(latestProducts.slice(0, 4))
        setFeaturedProducts(featuredCatalog)
        setBestSellers(featuredCatalog.slice(0, 4))
      } catch {
        setError('We could not load the storefront right now. Please try again shortly.')
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const heroImage = useMemo(() => {
    const trenchProduct = featuredProducts.find((product) => product.slug === 'belted-city-trench-coat')
    return trenchProduct?.imageUrl || heroFallbackImage
  }, [featuredProducts])

  return (
    <>
      <section className="bg-hero-glow">
        <Container className="grid gap-10 pb-14 pt-10 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-10">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-stone">
                Modern essentials for elevated everyday wear
              </p>
              <h1 className="max-w-[12ch] text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-ink md:text-6xl xl:text-[5.4rem]">
                Fashion storefront for women, men, shoes, and accessories.
              </h1>
              <p className="max-w-xl text-base leading-8 text-stone md:text-lg">
                Discover a refined fashion destination built around elevated essentials, modern tailoring, premium shoes, and finishing accessories for everyday style.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/shop">
                <Button size="lg" className="group">
                  <span className="inline-flex items-center gap-2">
                    Shop Collection
                    <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Explore Lookbook
              </Button>
            </div>
          </div>
          <div className="relative w-full lg:ml-auto lg:max-w-[520px]">
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-sand/40 blur-3xl lg:block" />
            <div className="overflow-hidden rounded-[36px] bg-mist shadow-soft">
              <img
                src={heroImage}
                alt="Editorial fashion hero"
                className="aspect-[4/5] w-full object-cover object-center"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="section-shell">
        <Container className="space-y-10">
          <SectionTitle
            eyebrow="Featured Departments"
            title="Shop the wardrobe by the way real customers browse fashion."
            description="Move through women, men, shoes, and accessories with a cleaner fashion-first storefront built for discovery, styling, and confident shopping."
          />
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[30px] bg-mist p-0">
                  <Skeleton className="aspect-[4/5] w-full rounded-none" />
                  <div className="space-y-3 px-6 py-6">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Catalog unavailable" description={error} />
          ) : (
            <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
              {featuredDepartments.map((department) => (
                <Link
                  key={department.id}
                  to={`/shop?department=${department.slug}`}
                  className="group overflow-hidden rounded-[30px] bg-mist transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="overflow-hidden">
                    <img
                      src={department.image}
                      alt={department.name}
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 px-6 py-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-ink">{department.name}</h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">{department.productCount} items</span>
                    </div>
                    <p className="text-sm leading-6 text-stone">{department.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="section-shell bg-mist">
        <Container className="space-y-10">
          <SectionTitle
            eyebrow="New Arrivals"
            title="Fresh silhouettes across the expanded fashion catalog."
            description="Latest products now come directly from the backend catalog API with a broader mix of women's, men's, shoes, and accessories products."
          />
          {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={newArrivals} />}
        </Container>
      </section>

      <section className="section-shell">
        <Container className="grid gap-8 lg:grid-cols-[0.92fr,1.08fr] lg:items-stretch">
          <div className="surface-card relative overflow-hidden px-8 py-10 md:px-10 md:py-12">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-sand/25 blur-3xl" />
            <div className="relative space-y-6">
              <SectionTitle
                eyebrow="Brand Story"
                title="A fashion storefront built to showcase statement pieces and everyday essentials with clarity."
                description="From tailored layers to soft knitwear and standout accessories, the experience is designed to help shoppers browse quickly, style confidently, and buy with intent."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-ink px-6 py-6 text-white shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Visual direction</p>
                  <p className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em]">
                    Clean structure with a fashion-first rhythm.
                  </p>
                </div>
                <div className="rounded-[28px] border border-line bg-mist px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">Use cases</p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-ink">
                    Storefront, capsule drops, seasonal edits, and freelancer-ready templates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featuredCollections.map((item, index) => (
              <div
                key={item.title}
                className={`group rounded-[30px] border border-line p-7 transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
                  index === 0 ? 'bg-[#f8f1e8] md:col-span-2' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-semibold text-ink">
                    0{index + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone">
                    Signature edit
                  </span>
                </div>
                <h3 className="mt-8 max-w-[14ch] text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-stone">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-shell">
        <Container className="space-y-10">
          <SectionTitle
            eyebrow="Best Sellers"
            title="Most-wanted pieces customers reach for first."
            description="Explore the fashion essentials that lead the season, from polished outerwear and sharp footwear to versatile wardrobe staples worth adding now."
          />
          {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={bestSellers} />}
        </Container>
      </section>

      <section className="section-shell">
        <Container>
          <div className="grid gap-8 overflow-hidden rounded-[36px] bg-ink px-8 py-10 text-white md:px-12 md:py-14 lg:grid-cols-[1fr,0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sand">Private event</p>
              <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-5xl">
                Mid-season private sale with elevated essentials at preferred pricing.
              </h2>
              <p className="max-w-lg text-sm leading-7 text-white/70">
                A strong promo banner slot for campaigns, drops, editorial capsules, or conversion-focused messaging.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button variant="secondary" className="border-white bg-white text-ink">
                View Offer
              </Button>
              <Button variant="ghost" className="border border-white/15 bg-white/5 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-shell bg-mist">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <SectionTitle
            eyebrow="Newsletter"
            title="Get first access to new arrivals, style edits, and limited drops."
            description="Stay close to the latest fashion releases, seasonal highlights, and wardrobe updates chosen for customers who shop with a sharper eye."
          />
          <form className="surface-card grid gap-4 p-6 sm:grid-cols-[1fr,auto]">
            <Input type="email" placeholder="Email address" />
            <Button type="submit" className="sm:px-8">
              Subscribe
            </Button>
          </form>
        </Container>
      </section>
    </>
  )
}

export default HomePage

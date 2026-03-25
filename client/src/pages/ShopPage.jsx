import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import SectionTitle from '../components/common/SectionTitle'
import Container from '../components/layout/Container'
import ProductFilters from '../components/product/ProductFilters'
import ProductGrid from '../components/product/ProductGrid'
import ProductGridSkeleton from '../components/product/ProductGridSkeleton'
import useDebouncedValue from '../hooks/useDebouncedValue'
import { getCategories } from '../services/categoryService'
import { getProducts } from '../services/productService'
import { buildDepartmentHighlights, getCategoryDepartment } from '../utils/catalog'

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || 'all')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const debouncedSearch = useDebouncedValue(search, 450)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategories()
        setCategories(categoryData)
      } catch {
        setError('We could not load categories right now.')
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setSelectedDepartment(searchParams.get('department') || 'all')
    setSelectedCategory(searchParams.get('category') || 'all')
    setSelectedPrice(searchParams.get('price') || 'all')
    setSortBy(searchParams.get('sort') || 'newest')
  }, [searchParams])

  useEffect(() => {
    const nextParams = new URLSearchParams()

    if (debouncedSearch) nextParams.set('search', debouncedSearch)
    if (selectedDepartment !== 'all') nextParams.set('department', selectedDepartment)
    if (selectedCategory !== 'all') nextParams.set('category', selectedCategory)
    if (selectedPrice !== 'all') nextParams.set('price', selectedPrice)
    if (sortBy !== 'newest') nextParams.set('sort', sortBy)

    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearch, selectedDepartment, selectedCategory, selectedPrice, sortBy, setSearchParams])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setError('')

        const priceMap = {
          '0-100': { maxPrice: 100 },
          '100-150': { minPrice: 100, maxPrice: 150 },
          '150-200': { minPrice: 150, maxPrice: 200 },
          '200+': { minPrice: 200 },
        }

        const response = await getProducts({
          ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}),
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(selectedPrice !== 'all' ? priceMap[selectedPrice] : {}),
          ...(sortBy ? { sort: sortBy } : {}),
        })

        const filteredProducts =
          selectedDepartment === 'all'
            ? response
            : response.filter((product) => product.department === selectedDepartment)

        setProducts(filteredProducts)
      } catch {
        setError('We could not load the shop catalog. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [debouncedSearch, selectedDepartment, selectedCategory, selectedPrice, sortBy])

  const departmentHighlights = useMemo(() => buildDepartmentHighlights(categories), [categories])
  const womenDepartment = departmentHighlights.find((item) => item.slug === 'women')
  const menDepartment = departmentHighlights.find((item) => item.slug === 'men')
  const shoesDepartment = departmentHighlights.find((item) => item.slug === 'shoes')
  const accessoriesDepartment = departmentHighlights.find((item) => item.slug === 'accessories')

  const activeFilters = useMemo(() => {
    const filters = []
    if (debouncedSearch) filters.push({ label: `Search: ${debouncedSearch}`, onRemove: () => setSearch('') })
    if (selectedDepartment !== 'all') {
      const department = departmentHighlights.find((item) => item.slug === selectedDepartment)
      filters.push({ label: department?.name || selectedDepartment, onRemove: () => setSelectedDepartment('all') })
    }
    if (selectedCategory !== 'all') {
      const category = categories.find((item) => item.slug === selectedCategory)
      filters.push({ label: category?.name || selectedCategory, onRemove: () => setSelectedCategory('all') })
    }
    if (selectedPrice !== 'all') filters.push({ label: `Price: ${selectedPrice}`, onRemove: () => setSelectedPrice('all') })
    if (sortBy !== 'newest') filters.push({ label: `Sort: ${sortBy.replace('_', ' ')}`, onRemove: () => setSortBy('newest') })
    return filters
  }, [categories, debouncedSearch, departmentHighlights, selectedDepartment, selectedCategory, selectedPrice, sortBy])

  const sectionTitle = useMemo(() => {
    if (selectedCategory !== 'all') {
      const category = categories.find((item) => item.slug === selectedCategory)
      return category?.name || 'Filtered Products'
    }

    if (selectedDepartment !== 'all') {
      const department = departmentHighlights.find((item) => item.slug === selectedDepartment)
      return department ? `${department.name} Collection` : 'Filtered Products'
    }

    return 'All Products'
  }, [categories, departmentHighlights, selectedCategory, selectedDepartment])

  const sectionDescription = useMemo(() => {
    if (selectedCategory !== 'all') {
      const category = categories.find((item) => item.slug === selectedCategory)
      return category?.description || 'A filtered fashion edit from the live storefront catalog.'
    }

    if (selectedDepartment !== 'all') {
      const department = departmentHighlights.find((item) => item.slug === selectedDepartment)
      return department?.description || 'A filtered fashion edit from the live storefront catalog.'
    }

    return 'A complete fashion assortment shaped by live backend filters, category selection, and search.'
  }, [categories, departmentHighlights, selectedCategory, selectedDepartment])

  const resetFilters = () => {
    setSearch('')
    setSelectedDepartment('all')
    setSelectedCategory('all')
    setSelectedPrice('all')
    setSortBy('newest')
  }

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department)
    setSelectedCategory('all')
  }

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    if (categorySlug === 'all') return
    setSelectedDepartment(getCategoryDepartment(categorySlug))
  }

  const departmentBlockBase = 'group relative overflow-hidden rounded-[34px] text-left transition duration-500 hover:-translate-y-1 hover:shadow-soft'

  return (
    <section className="section-shell">
      <Container className="space-y-14 xl:space-y-16">
        <SectionTitle
          eyebrow="Shop"
          title="Discover a sharper fashion browse experience built around editorial departments."
          description="The catalog stays connected to the same backend filters and query params, but the presentation now feels closer to a premium modern fashion storefront."
        />

        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {womenDepartment && (
              <button
                type="button"
                onClick={() => handleDepartmentChange('women')}
                className={`${departmentBlockBase} min-h-[420px] border border-line bg-ink`}
              >
                <img
                  src={womenDepartment.image}
                  alt="Women collection"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="relative flex h-full flex-col justify-end px-8 py-8 text-white md:px-10 md:py-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Discover the collection</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Women</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/80">Fluid dresses, soft tailoring, knitwear, and polished essentials with a modern editorial feel.</p>
                </div>
              </button>
            )}

            {menDepartment && (
              <button
                type="button"
                onClick={() => handleDepartmentChange('men')}
                className={`${departmentBlockBase} min-h-[420px] border border-line bg-ink`}
              >
                <img
                  src={menDepartment.image}
                  alt="Men collection"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="relative flex h-full flex-col justify-end px-8 py-8 text-white md:px-10 md:py-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Discover the collection</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Men</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/80">Tailored shirts, refined trousers, modern outerwear, and versatile layers designed for repeat wear.</p>
                </div>
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {shoesDepartment && (
              <button
                type="button"
                onClick={() => handleDepartmentChange('shoes')}
                className="group relative overflow-hidden rounded-[30px] border border-line bg-[#f6f1ea] px-7 py-8 text-left transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-90">
                  <img
                    src={shoesDepartment.image}
                    alt="Shoes collection"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f6f1ea]/20 to-[#f6f1ea]" />
                </div>
                <div className="relative max-w-[16rem] space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone">Edit</p>
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-ink">Shoes</h3>
                  <p className="text-sm leading-7 text-stone">Minimal sneakers, loafers, flats, and heels gathered into one focused footwear view.</p>
                </div>
              </button>
            )}

            {accessoriesDepartment && (
              <button
                type="button"
                onClick={() => handleDepartmentChange('accessories')}
                className="group relative overflow-hidden rounded-[30px] border border-line bg-white px-7 py-8 text-left transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-90">
                  <img
                    src={accessoriesDepartment.image}
                    alt="Accessories collection"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-white" />
                </div>
                <div className="relative max-w-[16rem] space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone">Edit</p>
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-ink">Accessories</h3>
                  <p className="text-sm leading-7 text-stone">Bags, scarves, belts, and finishing pieces that complete the wardrobe without clutter.</p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <ProductFilters
            search={search}
            selectedCategory={selectedCategory}
            selectedPrice={selectedPrice}
            sortBy={sortBy}
            categories={categories}
            onSearchChange={setSearch}
            onCategoryChange={handleCategoryChange}
            onPriceChange={setSelectedPrice}
            onSortChange={setSortBy}
          />

          <div className="flex flex-col gap-4 rounded-[28px] border border-line/80 bg-white/90 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-stone">
              <span className="inline-flex items-center gap-2 font-medium text-ink">
                <SlidersHorizontal size={16} /> Active filters
              </span>
              {activeFilters.length ? (
                activeFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={filter.onRemove}
                    className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-line"
                  >
                    {filter.label}
                    <X size={14} />
                  </button>
                ))
              ) : (
                <span className="text-stone">No filters applied</span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="inline-flex items-center gap-2 self-start lg:self-auto" onClick={resetFilters}>
              <RotateCcw size={15} /> Reset Filters
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-3 border-b border-line/80 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone">Collection View</p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-ink md:text-4xl">{sectionTitle}</h2>
              <p className="max-w-2xl text-sm leading-7 text-stone">{sectionDescription}</p>
            </div>
            <p className="text-sm text-stone">{products.length} products</p>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : error ? (
            <EmptyState title="Unable to load products" description={error} />
          ) : products.length === 0 ? (
            <div className="rounded-[32px] border border-line bg-mist/70 px-6 py-12 md:px-10">
              <EmptyState
                title="No matching products"
                description="Try broadening the search, switching category groups, or resetting the filters to return to the full collection."
                actionLabel="Reset catalog"
                action={resetFilters}
              />
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Container>
    </section>
  )
}

export default ShopPage

import { Package, PencilLine, Plus, Sparkles, Tag, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminListSkeleton from '../../components/admin/AdminListSkeleton'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminProductModal from '../../components/admin/AdminProductModal'
import AdminStatCard from '../../components/admin/AdminStatCard'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import StatusBadge from '../../components/common/StatusBadge'
import { useUI } from '../../context/UIContext'
import { getCategories } from '../../services/categoryService'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '../../services/adminProductService'
import { formatPrice } from '../../utils/format'

const emptyVariant = { size: '', color: '', stock: 0, sku: '' }

const createEmptyForm = () => ({
  id: null,
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  imageUrl: '',
  isFeatured: false,
  categoryId: '',
  variants: [emptyVariant],
})

function normalizeFormVariants(variants) {
  if (!Array.isArray(variants) || !variants.length) {
    return [{ ...emptyVariant }]
  }

  return variants.map((variant) => ({
    size: variant?.size || '',
    color: variant?.color || '',
    stock: Number(variant?.stock || 0),
    sku: variant?.sku || '',
  }))
}

function getVariantStock(variants = []) {
  if (!Array.isArray(variants)) return 0
  return variants.reduce((total, variant) => total + Number(variant?.stock || 0), 0)
}

function getVariantCount(variants = []) {
  return Array.isArray(variants) ? variants.length : 0
}

function getExcerpt(value, maxLength = 88) {
  if (!value) return 'No description added yet.'
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

function AdminProductsPage() {
  const { showToast } = useUI()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(createEmptyForm())
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setLoadError('')
      const [productData, categoryData] = await Promise.all([getAdminProducts(), getCategories()])
      setProducts(Array.isArray(productData) ? productData : [])
      setCategories(Array.isArray(categoryData) ? categoryData : [])
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Unable to load the admin catalog right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const featuredCount = useMemo(() => products.filter((product) => product?.isFeatured).length, [products])
  const totalVariants = useMemo(() => products.reduce((count, product) => count + getVariantCount(product?.variants), 0), [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || [product?.name, product?.slug, product?.category?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = !categoryFilter || product?.categoryId === categoryFilter
      const matchesFeatured = featuredFilter === 'all'
        || (featuredFilter === 'featured' && product?.isFeatured)
        || (featuredFilter === 'standard' && !product?.isFeatured)

      return matchesSearch && matchesCategory && matchesFeatured
    })
  }, [categoryFilter, featuredFilter, products, search])

  const updateFormField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const updateVariant = (index, key, value) => {
    setForm((current) => ({
      ...current,
      variants: normalizeFormVariants(current.variants).map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }))
  }

  const addVariant = () => {
    setForm((current) => ({
      ...current,
      variants: [...normalizeFormVariants(current.variants), { ...emptyVariant }],
    }))
  }

  const removeVariant = (index) => {
    setForm((current) => {
      const nextVariants = normalizeFormVariants(current.variants).filter((_, variantIndex) => variantIndex !== index)
      return {
        ...current,
        variants: nextVariants.length ? nextVariants : [{ ...emptyVariant }],
      }
    })
  }

  const startCreate = () => {
    setForm(createEmptyForm())
    setIsEditorOpen(true)
  }

  const handleEdit = (product) => {
    setForm({
      id: product?.id || null,
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price ?? '',
      compareAtPrice: product?.compareAtPrice ?? '',
      imageUrl: product?.imageUrl || '',
      isFeatured: Boolean(product?.isFeatured),
      categoryId: product?.categoryId || '',
      variants: normalizeFormVariants(product?.variants),
    })
    setIsEditorOpen(true)
  }

  const resetForm = () => {
    setForm(createEmptyForm())
    setIsEditorOpen(false)
  }

  const buildPayload = () => ({
    ...form,
    price: Number(form.price),
    compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
    variants: normalizeFormVariants(form.variants)
      .filter((variant) => variant.size || variant.color || variant.sku)
      .map((variant) => ({
        ...variant,
        stock: Number(variant.stock || 0),
      })),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      const payload = buildPayload()

      if (form.id) {
        await updateAdminProduct(form.id, payload)
        showToast('Product updated.', 'success')
      } else {
        await createAdminProduct(payload)
        showToast('Product created.', 'success')
      }

      resetForm()
      await loadData()
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to save product.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    try {
      await deleteAdminProduct(id)
      showToast('Product deleted.', 'success')
      if (form.id === id) {
        resetForm()
      }
      await loadData()
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete product.', 'error')
    } finally {
      setIsEditorOpen(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
        <AdminPageHeader
          eyebrow="Catalog Management"
          title="Products that feel properly managed"
          description="A wider catalog list, tighter controls, and a dedicated modal editor so the page stays clean while editing stays focused."
          actions={[
            <Button key="create" onClick={startCreate} className="inline-flex items-center gap-2 rounded-[16px]"><Plus size={16} />Add Product</Button>,
          ]}
        />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Catalog" value={products.length} hint="Products currently available across the storefront." icon={Package} accent="default" />
        <AdminStatCard label="Featured" value={featuredCount} hint="Products highlighted in premium discovery surfaces." icon={Sparkles} accent="beige" />
        <AdminStatCard label="Variants" value={totalVariants} hint="Combined size and color combinations managed here." icon={Tag} accent="default" />
      </div>

      <section className="rounded-[28px] border border-black/5 bg-[#fbfaf7] p-6 shadow-[0_14px_38px_rgba(17,17,17,0.04)] md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">Catalog</p>
            <h2 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-ink">Product inventory</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-stone">Search by title, filter by category, and manage products in a dedicated modal instead of compressing the list beside a giant editor.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={`${filteredProducts.length} products`} />
            {featuredFilter !== 'all' && <StatusBadge value={featuredFilter === 'featured' ? 'Featured only' : 'Standard only'} />}
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.2fr),0.8fr,0.8fr,auto] lg:items-end">
          <Input
            label="Search"
            className="rounded-[16px]"
            placeholder="Name, slug, or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select label="Category" className="rounded-[16px]" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
          <Select label="Visibility" className="rounded-[16px]" value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value)}>
            <option value="all">All products</option>
            <option value="featured">Featured only</option>
            <option value="standard">Standard only</option>
          </Select>
          <div className="flex gap-2 lg:justify-end">
            <Button variant="secondary" size="sm" className="rounded-[16px]" onClick={() => { setSearch(''); setCategoryFilter(''); setFeaturedFilter('all') }}>Reset</Button>
            <Button size="sm" className="rounded-[16px]" onClick={startCreate}>Add</Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-[#fbfaf7] shadow-[0_14px_38px_rgba(17,17,17,0.04)]">
        {isLoading ? (
          <div className="p-6"><AdminListSkeleton rows={5} /></div>
        ) : loadError ? (
          <div className="p-6"><EmptyState title="Catalog unavailable" description={loadError} actionLabel="Try Again" action={loadData} /></div>
        ) : filteredProducts.length ? (
          <>
            <div className="hidden grid-cols-[84px,minmax(0,1.5fr),0.9fr,0.8fr,0.72fr,0.82fr,132px] gap-4 bg-[#f6f1ea] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone xl:grid">
              <span>Image</span>
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            <div className="divide-y divide-black/5 bg-white">
              {filteredProducts.map((product) => {
                const stock = getVariantStock(product.variants)
                const variantCount = getVariantCount(product.variants)

                return (
                  <div key={product.id} className="px-6 py-5">
                    <div className="hidden xl:grid xl:grid-cols-[84px,minmax(0,1.5fr),0.9fr,0.8fr,0.72fr,0.82fr,132px] xl:gap-4 xl:items-start">
                      <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-[18px] object-cover" />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{product.name}</p>
                        <p className="mt-2 text-sm leading-6 text-stone">{getExcerpt(product.description)}</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{variantCount} variants</p>
                      </div>
                      <div className="text-sm text-stone">{product.category?.name || 'Uncategorized'}</div>
                      <div>
                        <p className="font-semibold text-ink">{formatPrice(product.price)}</p>
                        {product.compareAtPrice && <p className="mt-2 text-sm text-stone line-through">{formatPrice(product.compareAtPrice)}</p>}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{stock}</p>
                        <p className="mt-2 text-sm text-stone">units</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={product.isFeatured ? 'Featured' : 'Standard'} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(product)} className="inline-flex items-center justify-center gap-2 rounded-[16px]">
                          <PencilLine size={14} />Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="inline-flex items-center justify-center gap-2 rounded-[16px]">
                          <Trash2 size={14} />Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 xl:hidden">
                      <div className="flex gap-4">
                        <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-[18px] object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-ink">{product.name}</p>
                            <StatusBadge value={product.isFeatured ? 'Featured' : 'Standard'} />
                          </div>
                          <p className="mt-1 text-sm text-stone">{product.category?.name || 'Uncategorized'}</p>
                          <p className="mt-2 text-sm leading-6 text-stone">{getExcerpt(product.description, 110)}</p>
                        </div>
                      </div>
                      <div className="grid gap-3 rounded-[20px] bg-[#f6f1ea] p-4 sm:grid-cols-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Price</p>
                          <p className="mt-2 font-semibold text-ink">{formatPrice(product.price)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Stock</p>
                          <p className="mt-2 font-semibold text-ink">{stock} units</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">Variants</p>
                          <p className="mt-2 font-semibold text-ink">{variantCount}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(product)} className="inline-flex items-center gap-2 rounded-[16px]">
                          <PencilLine size={14} />Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="inline-flex items-center gap-2 rounded-[16px]">
                          <Trash2 size={14} />Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No products match these filters"
              description="Adjust the search or filters, or create a new product to expand the catalog."
              actionLabel="Reset Filters"
              action={() => {
                setSearch('')
                setCategoryFilter('')
                setFeaturedFilter('all')
              }}
            />
          </div>
        )}
      </section>

      <AdminProductModal
        isOpen={isEditorOpen}
        form={form}
        categories={categories}
        isSaving={isSaving}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onFieldChange={updateFormField}
        onVariantChange={updateVariant}
        onAddVariant={addVariant}
        onRemoveVariant={removeVariant}
        variantRows={normalizeFormVariants(form.variants)}
      />
    </div>
  )
}

export default AdminProductsPage

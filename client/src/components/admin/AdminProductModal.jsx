import { Package, PencilLine, Plus, Sparkles, Tag, Trash2, X } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'

function AdminProductModal({
  isOpen,
  form,
  categories,
  isSaving,
  onClose,
  onSubmit,
  onFieldChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  variantRows,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[30px] border border-black/5 bg-[#fcfbf8] shadow-[0_30px_80px_rgba(17,17,17,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 md:px-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">{form.id ? 'Edit Product' : 'Create Product'}</p>
            <h2 className="mt-2 text-[1.9rem] font-semibold tracking-tight text-ink">Catalog editor</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone">
              A cleaner modal editor for imagery, pricing, category placement, and fashion-style variants.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-black/5 p-2 text-stone transition hover:bg-black/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[calc(92vh-96px)] overflow-y-auto px-6 py-6 md:px-7">
          <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" className="rounded-[16px]" value={form.name} onChange={(event) => onFieldChange('name', event.target.value)} />
                <Input label="Slug" className="rounded-[16px]" value={form.slug} onChange={(event) => onFieldChange('slug', event.target.value)} />
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Description</span>
                <textarea
                  className="w-full rounded-[18px] border border-black/5 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-stone focus:border-ink"
                  rows="6"
                  value={form.description}
                  onChange={(event) => onFieldChange('description', event.target.value)}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Price" className="rounded-[16px]" type="number" value={form.price} onChange={(event) => onFieldChange('price', event.target.value)} />
                <Input label="Compare at price" className="rounded-[16px]" type="number" value={form.compareAtPrice} onChange={(event) => onFieldChange('compareAtPrice', event.target.value)} />
              </div>

              <Input label="Image URL" className="rounded-[16px]" value={form.imageUrl} onChange={(event) => onFieldChange('imageUrl', event.target.value)} />
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Category" className="rounded-[16px]" value={form.categoryId} onChange={(event) => onFieldChange('categoryId', event.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-ink">Featured</span>
                  <div className="flex h-[50px] items-center justify-between rounded-[16px] border border-black/5 bg-white px-4 text-sm font-medium text-ink">
                    <span>{form.isFeatured ? 'Homepage ready' : 'Standard placement'}</span>
                    <input type="checkbox" checked={form.isFeatured} onChange={(event) => onFieldChange('isFeatured', event.target.checked)} />
                  </div>
                </label>
              </div>

              <div className="rounded-[22px] border border-black/5 bg-[#f6f1ea] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone">Variants</p>
                    <p className="mt-1 text-xs text-stone">Sizes, colors, stock, and SKU combinations.</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={onAddVariant} className="rounded-[14px]">Add Variant</Button>
                </div>

                <div className="mt-4 space-y-3">
                  {variantRows.map((variant, index) => (
                    <div key={`${variant.sku || 'variant'}-${index}`} className="space-y-3 rounded-[18px] border border-black/5 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                          <Tag size={14} /> Variant {index + 1}
                        </div>
                        {variantRows.length > 1 && (
                          <button type="button" onClick={() => onRemoveVariant(index)} className="text-sm font-semibold text-stone transition hover:text-ink">
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input label="Size" className="rounded-[14px]" value={variant.size} onChange={(event) => onVariantChange(index, 'size', event.target.value)} />
                        <Input label="Color" className="rounded-[14px]" value={variant.color} onChange={(event) => onVariantChange(index, 'color', event.target.value)} />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input label="Stock" className="rounded-[14px]" type="number" value={variant.stock} onChange={(event) => onVariantChange(index, 'stock', event.target.value)} />
                        <Input label="SKU" className="rounded-[14px]" value={variant.sku} onChange={(event) => onVariantChange(index, 'sku', event.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-black/5 pt-5">
            <Button type="button" variant="secondary" onClick={onClose} className="rounded-[16px]">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-[16px] inline-flex items-center gap-2">
              <Package size={16} />
              {isSaving ? 'Saving...' : form.id ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductModal

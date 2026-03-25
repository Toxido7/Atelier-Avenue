import EmptyState from '../common/EmptyState'
import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms to uncover more curated pieces."
      />
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid

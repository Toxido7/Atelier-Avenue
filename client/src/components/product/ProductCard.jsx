import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import { formatPrice } from '../../utils/format'

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'

function ProductCard({ product }) {
  const [imageSrc, setImageSrc] = useState(product.images?.[0] || product.imageUrl || fallbackImage)

  return (
    <article className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[28px] bg-mist">
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImageSrc(fallbackImage)}
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4">
            <Badge>{product.badge || (product.isFeatured ? 'Featured' : 'Curated')}</Badge>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 px-1 pt-5">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm capitalize text-stone">{product.categoryLabel || product.category?.name || ''}</p>
          </div>
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard

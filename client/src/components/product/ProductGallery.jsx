import { useEffect, useState } from 'react'

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'

function ProductGallery({ images, activeImage, onSelectImage }) {
  const normalizedImages = images?.length ? images : [fallbackImage]
  const [heroImage, setHeroImage] = useState(activeImage || normalizedImages[0] || fallbackImage)

  useEffect(() => {
    setHeroImage(activeImage || normalizedImages[0] || fallbackImage)
  }, [activeImage, normalizedImages])

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[32px] bg-mist">
        <img
          src={heroImage}
          alt="Product view"
          onError={() => setHeroImage(fallbackImage)}
          className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {normalizedImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => onSelectImage(image)}
            className={`overflow-hidden rounded-3xl border transition ${heroImage === image ? 'border-ink' : 'border-transparent hover:border-line'}`}
          >
            <img
              src={image}
              alt="Thumbnail"
              onError={(event) => {
                event.currentTarget.src = fallbackImage
              }}
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery

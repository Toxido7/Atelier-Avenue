const categoryPresentation = {
  'women-dresses': {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'Fluid dresses with modern volume, sharp lines, and evening-ready ease.',
  },
  'women-tops': {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    description: 'Soft layering tops with clean necklines and elevated fabric drape.',
  },
  'women-shirts': {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    description: 'Crisp poplin, refined stripes, and oversized shirts for polished daily dressing.',
  },
  'women-pants': {
    image: 'https://images.unsplash.com/photo-1506629905607-653b870d14c1?auto=format&fit=crop&w=900&q=80',
    description: 'Tailored trousers and fluid pants built for movement and sharp proportion.',
  },
  'women-knitwear': {
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
    description: 'Soft knits that balance warmth, texture, and a premium minimalist finish.',
  },
  'women-outerwear': {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    description: 'Coats and jackets that add architecture and quiet impact to every look.',
  },
  'women-shoes': {
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    description: 'Slingbacks, flats, and refined footwear with an editorial finish.',
  },
  'men-tshirts': {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Premium tees with heavier jersey, stronger shape, and understated styling.',
  },
  'men-shirts': {
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    description: 'Tailored shirts and relaxed collars that shift easily from office to evening.',
  },
  'men-pants': {
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    description: 'Smart trousers and relaxed pants designed for clean lines and comfort.',
  },
  'men-denim': {
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    description: 'Modern denim fits with premium washes and strong everyday versatility.',
  },
  'men-knitwear': {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    description: 'Merino layers and textured sweaters for a polished cold-weather wardrobe.',
  },
  'men-outerwear': {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'Overcoats and overshirts that bring structure, warmth, and quiet luxury.',
  },
  'men-shoes': {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Minimal sneakers and loafers with refined shape and premium texture.',
  },
  accessories: {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    description: 'Bags, scarves, belts, and finishing pieces that complete a full wardrobe.',
  },
}

const departmentMeta = {
  women: {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    description: "Dresses, tailoring, knitwear, and refined essentials built around a fashion-forward women's edit.",
    matcher: (slug) => slug?.startsWith('women-'),
  },
  men: {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    description: 'Elevated menswear with clean tailoring, premium textures, and versatile layering pieces.',
    matcher: (slug) => slug?.startsWith('men-'),
  },
  shoes: {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    description: 'A focused footwear selection spanning modern sneakers, loafers, flats, and heels.',
    matcher: (slug) => slug?.endsWith('-shoes'),
  },
  accessories: {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
    description: 'The finishing layer: bags, scarves, belts, eyewear, and compact leather goods.',
    matcher: (slug) => slug === 'accessories',
  },
}

export function normalizeCategory(category) {
  const presentation = categoryPresentation[category.slug] || {}

  return {
    ...category,
    image: presentation.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    description: presentation.description || 'Curated essentials designed for a flexible modern storefront.',
    productCount: category._count?.products ?? 0,
  }
}

export function getCategoryDepartment(slug) {
  const entry = Object.entries(departmentMeta).find(([, meta]) => meta.matcher(slug))
  return entry?.[0] || 'all'
}

export function buildDepartmentHighlights(categories = []) {
  return Object.entries(departmentMeta)
    .map(([key, meta]) => {
      const matchingCategories = categories.filter((category) => meta.matcher(category.slug))
      const productCount = matchingCategories.reduce((sum, category) => sum + (category.productCount || 0), 0)

      return {
        id: key,
        name: meta.name,
        slug: key,
        image: meta.image,
        description: meta.description,
        productCount,
      }
    })
    .filter((department) => department.productCount > 0)
}

export function normalizeProduct(product) {
  const variants = product.variants || []
  const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))]
  const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))]

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    imageUrl: product.imageUrl,
    images: product.images?.length ? product.images : [product.imageUrl].filter(Boolean),
    badge: product.isFeatured ? 'Featured' : 'New Season',
    categoryLabel: product.category?.name || product.category || '',
    categorySlug: product.category?.slug || product.categorySlug || '',
    department: getCategoryDepartment(product.category?.slug || product.categorySlug || ''),
    colors,
    sizes,
    variants,
  }
}

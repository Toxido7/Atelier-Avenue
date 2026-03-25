export const categories = [
  {
    id: 'outerwear',
    name: 'Outerwear',
    slug: 'outerwear',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    description: 'Tailored layers designed for all-season versatility.',
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    slug: 'knitwear',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Soft essentials with elevated texture and shape.',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    slug: 'footwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Modern silhouettes grounded in comfort and polish.',
  },
]

export const products = [
  {
    id: 1,
    slug: 'linen-overshirt',
    name: 'Linen Overshirt',
    category: 'outerwear',
    price: 148,
    badge: 'New Season',
    rating: 4.8,
    description:
      'A lightweight overshirt cut from breathable linen with clean structure for day-to-night layering.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sand', 'Clay'],
    images: [
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 2,
    slug: 'merino-quarter-zip',
    name: 'Merino Quarter Zip',
    category: 'knitwear',
    price: 124,
    badge: 'Best Seller',
    rating: 4.9,
    description:
      'Refined merino knitwear with a smooth hand feel and a modern, easy-to-layer silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Charcoal'],
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 3,
    slug: 'minimal-leather-sneaker',
    name: 'Minimal Leather Sneaker',
    category: 'footwear',
    price: 176,
    badge: 'Editor Pick',
    rating: 4.7,
    description:
      'An understated leather sneaker with tonal detailing and comfort-first construction.',
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['White', 'Bone'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 4,
    slug: 'tailored-wool-coat',
    name: 'Tailored Wool Coat',
    category: 'outerwear',
    price: 264,
    badge: 'Limited',
    rating: 4.9,
    description:
      'A sharp wool overcoat with relaxed shoulders and premium finishing for effortless sophistication.',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Taupe'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 5,
    slug: 'structured-tote',
    name: 'Structured Tote',
    category: 'accessories',
    price: 98,
    badge: 'Just In',
    rating: 4.6,
    description:
      'A clean-lined tote designed to carry daily essentials with quiet confidence.',
    sizes: ['One Size'],
    colors: ['Stone', 'Espresso'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 6,
    slug: 'pleated-trouser',
    name: 'Pleated Trouser',
    category: 'bottoms',
    price: 132,
    badge: 'Best Seller',
    rating: 4.8,
    description:
      'Relaxed pleated trousers cut for movement, drape, and an elevated everyday uniform.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Oat', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1506629905607-d405b7a24c13?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    ],
  },
]

export const featuredCollections = [
  {
    title: 'Modern tailoring',
    description: 'Sharp tailoring, clean proportions, and polished layers designed to make every outfit feel intentional.',
  },
  {
    title: 'Quiet luxury layers',
    description: 'Refined wardrobe pieces that balance softness, structure, and an elevated premium finish.',
  },
  {
    title: 'Built for repeat wear',
    description: 'Easy-to-style essentials that shoppers can wear on repeat, mix effortlessly, and add to cart with confidence.',
  },
]

export const cartItems = [
  {
    id: 1,
    productSlug: 'linen-overshirt',
    name: 'Linen Overshirt',
    size: 'M',
    quantity: 1,
    price: 148,
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    productSlug: 'minimal-leather-sneaker',
    name: 'Minimal Leather Sneaker',
    size: '42',
    quantity: 1,
    price: 176,
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  },
]

export const orderSummary = {
  subtotal: 324,
  shipping: 18,
  tax: 24,
  total: 366,
}

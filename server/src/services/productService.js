import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/AppError.js'
import { toPlainProduct } from '../utils/serializers.js'

const sortMap = {
  newest: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
}

export async function getProducts(filters) {
  const where = {
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.featured === 'true' ? { isFeatured: true } : {}),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: Number(filters.minPrice) } : {}),
            ...(filters.maxPrice ? { lte: Number(filters.maxPrice) } : {}),
          },
        }
      : {}),
  }

  const orderBy =
    filters.sort === 'popular'
      ? [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      : sortMap[filters.sort] || { createdAt: 'desc' }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: true,
    },
    orderBy,
  })

  return products.map(toPlainProduct)
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
    },
  })

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      category: true,
      variants: true,
    },
    take: 4,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  return {
    product: toPlainProduct(product),
    relatedProducts: relatedProducts.map(toPlainProduct),
  }
}

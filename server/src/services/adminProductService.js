import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/AppError.js'

function validateProductPayload(payload) {
  const errors = []

  if (!payload.name?.trim()) errors.push('Product name is required.')
  if (!payload.slug?.trim()) errors.push('Product slug is required.')
  if (!payload.description?.trim()) errors.push('Product description is required.')
  if (payload.price === undefined || Number(payload.price) <= 0) errors.push('Product price must be greater than 0.')
  if (!payload.imageUrl?.trim()) errors.push('Product image URL is required.')
  if (!payload.categoryId) errors.push('Category is required.')

  if (errors.length) {
    throw new AppError('Invalid product payload', 400, errors)
  }
}

function normalizeVariants(variants = []) {
  return variants
    .filter((variant) => variant.size?.trim() && variant.color?.trim() && variant.sku?.trim())
    .map((variant) => ({
      size: variant.size.trim(),
      color: variant.color.trim(),
      stock: Number(variant.stock) || 0,
      sku: variant.sku.trim(),
    }))
}

export async function listAdminProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createAdminProduct(payload) {
  validateProductPayload(payload)

  return prisma.product.create({
    data: {
      name: payload.name.trim(),
      slug: payload.slug.trim(),
      description: payload.description.trim(),
      price: Number(payload.price),
      compareAtPrice: payload.compareAtPrice ? Number(payload.compareAtPrice) : null,
      imageUrl: payload.imageUrl.trim(),
      isFeatured: Boolean(payload.isFeatured),
      categoryId: payload.categoryId,
      variants: {
        create: normalizeVariants(payload.variants),
      },
    },
    include: {
      category: true,
      variants: true,
    },
  })
}

export async function updateAdminProduct(id, payload) {
  validateProductPayload(payload)

  const existingProduct = await prisma.product.findUnique({ where: { id } })

  if (!existingProduct) {
    throw new AppError('Product not found', 404)
  }

  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: payload.name.trim(),
        slug: payload.slug.trim(),
        description: payload.description.trim(),
        price: Number(payload.price),
        compareAtPrice: payload.compareAtPrice ? Number(payload.compareAtPrice) : null,
        imageUrl: payload.imageUrl.trim(),
        isFeatured: Boolean(payload.isFeatured),
        categoryId: payload.categoryId,
      },
    })

    await tx.productVariant.deleteMany({ where: { productId: id } })

    const variants = normalizeVariants(payload.variants)

    if (variants.length) {
      await tx.productVariant.createMany({
        data: variants.map((variant) => ({
          ...variant,
          productId: id,
        })),
      })
    }

    return tx.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    })
  })
}

export async function deleteAdminProduct(id) {
  const existingProduct = await prisma.product.findUnique({ where: { id } })

  if (!existingProduct) {
    throw new AppError('Product not found', 404)
  }

  await prisma.product.delete({ where: { id } })

  return { success: true }
}

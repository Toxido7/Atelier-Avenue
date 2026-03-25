import { PaymentMethod, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/AppError.js'
import { toPlainOrder } from '../utils/serializers.js'
import { validateOrderPayload } from '../utils/validators.js'

const allowedPaymentMethods = new Set(Object.values(PaymentMethod))

function normalizeOrderPayload(payload) {
  validateOrderPayload(payload)

  const paymentMethod = payload.paymentMethod || PaymentMethod.CARD

  if (!allowedPaymentMethods.has(paymentMethod)) {
    throw new AppError('Unsupported payment method', 400)
  }

  const normalizedItems = payload.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId || null,
    quantity: Number(item.quantity) || 0,
  }))

  if (normalizedItems.some((item) => item.quantity < 1)) {
    throw new AppError('Each order item must include a quantity of at least 1', 400)
  }

  return {
    paymentMethod,
    customer: {
      fullName: payload.customer.fullName,
      email: payload.customer.email || null,
      phone: payload.customer.phone,
      city: payload.customer.city,
      address: payload.customer.address,
    },
    items: normalizedItems,
    totalAmount: payload.totalAmount,
  }
}

export async function prepareOrderContext(payload) {
  const normalizedPayload = normalizeOrderPayload(payload)
  const productIds = [...new Set(normalizedPayload.items.map((item) => item.productId))]
  const variantIds = [...new Set(normalizedPayload.items.map((item) => item.variantId).filter(Boolean))]

  const [products, variants] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } } }),
    prisma.productVariant.findMany({ where: { id: { in: variantIds } } }),
  ])

  const productMap = new Map(products.map((product) => [product.id, product]))
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]))

  const orderItemsData = normalizedPayload.items.map((item) => {
    const product = productMap.get(item.productId)

    if (!product) {
      throw new AppError(`Product not found for item ${item.productId}`, 404)
    }

    const variant = item.variantId ? variantMap.get(item.variantId) : null

    if (item.variantId && !variant) {
      throw new AppError(`Variant not found for item ${item.variantId}`, 404)
    }

    if (variant && variant.productId !== product.id) {
      throw new AppError('Selected variant does not belong to the requested product', 400)
    }

    if (variant && variant.stock < item.quantity) {
      throw new AppError(`Insufficient stock for SKU ${variant.sku}`, 400)
    }

    const unitPrice = product.price
    const subtotal = product.price.mul(item.quantity)

    return {
      productId: product.id,
      variantId: variant?.id || null,
      quantity: item.quantity,
      unitPrice,
      subtotal,
      product,
      variant,
    }
  })

  const computedTotalAmount = orderItemsData.reduce(
    (total, item) => total.plus(item.subtotal),
    new Prisma.Decimal(0),
  )

  if (normalizedPayload.totalAmount && Number(normalizedPayload.totalAmount) !== Number(computedTotalAmount)) {
    throw new AppError('Submitted totalAmount does not match server-calculated total', 400)
  }

  return {
    customer: normalizedPayload.customer,
    paymentMethod: normalizedPayload.paymentMethod,
    totalAmount: computedTotalAmount,
    orderItemsData,
  }
}

async function createOrderRecordTx(tx, preparedOrder, options = {}) {
  const {
    status = 'PENDING',
    paymentStatus = 'PENDING',
    stripeSessionId = null,
    decrementStock = false,
  } = options

  const customer = await tx.customer.create({
    data: preparedOrder.customer,
  })

  const order = await tx.order.create({
    data: {
      customerId: customer.id,
      totalAmount: preparedOrder.totalAmount,
      paymentMethod: preparedOrder.paymentMethod,
      status,
      paymentStatus,
      stripeSessionId,
      items: {
        create: preparedOrder.orderItemsData.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (decrementStock) {
    for (const item of preparedOrder.orderItemsData) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }
  }

  return order
}

export async function createOrder(payload) {
  const preparedOrder = await prepareOrderContext(payload)
  const order = await prisma.$transaction((tx) =>
    createOrderRecordTx(tx, preparedOrder, {
      decrementStock: true,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
    }),
  )

  return toPlainOrder(order)
}

export async function createPendingOrder(payload) {
  const preparedOrder = await prepareOrderContext({
    ...payload,
    paymentMethod: PaymentMethod.CARD,
  })

  const order = await prisma.$transaction((tx) => createOrderRecordTx(tx, preparedOrder))

  return {
    order: toPlainOrder(order),
    preparedOrder,
  }
}

export async function updateOrderStripeSession(orderId, stripeSessionId) {
  await prisma.order.update({
    where: { id: orderId },
    data: { stripeSessionId },
  })
}

export async function rollbackPendingOrder(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { customerId: true },
  })

  if (!order) return

  await prisma.$transaction(async (tx) => {
    await tx.order.delete({ where: { id: orderId } })

    const remainingOrders = await tx.order.count({ where: { customerId: order.customerId } })

    if (remainingOrders === 0) {
      await tx.customer.delete({ where: { id: order.customerId } })
    }
  })
}

export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (!order) {
    throw new AppError('Order not found', 404)
  }

  return toPlainOrder(order)
}

export async function getOrderByStripeSessionId(stripeSessionId) {
  const order = await prisma.order.findFirst({
    where: { stripeSessionId },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (!order) {
    throw new AppError('Order not found for Stripe session', 404)
  }

  return order
}

export async function markOrderPaidByStripeSession(stripeSessionId) {
  const order = await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findFirst({
      where: { stripeSessionId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!existingOrder) {
      throw new AppError('Order not found for Stripe session', 404)
    }

    if (existingOrder.paymentStatus === 'PAID') {
      return existingOrder
    }

    for (const item of existingOrder.items) {
      if (item.variantId) {
        const latestVariant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        })

        if (!latestVariant || latestVariant.stock < item.quantity) {
          throw new AppError(`Insufficient stock while confirming payment for variant ${item.variantId}`, 400)
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    return tx.order.update({
      where: { id: existingOrder.id },
      data: {
        paymentStatus: 'PAID',
        status: 'PROCESSING',
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })
  })

  return toPlainOrder(order)
}

export async function markOrderFailedByStripeSession(stripeSessionId, options = {}) {
  const order = await prisma.order.findFirst({
    where: { stripeSessionId },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (!order) {
    throw new AppError('Order not found for Stripe session', 404)
  }

  if (order.paymentStatus === 'PAID') {
    return toPlainOrder(order)
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'FAILED',
      status: options.cancelOrder ? 'CANCELLED' : order.status,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  return toPlainOrder(updatedOrder)
}

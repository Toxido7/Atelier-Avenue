import Stripe from 'stripe'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import {
  createPendingOrder,
  markOrderFailedByStripeSession,
  markOrderPaidByStripeSession,
  rollbackPendingOrder,
  updateOrderStripeSession,
} from './orderService.js'

const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey)
  : null

function getStripeClient() {
  if (!stripe) {
    throw new AppError('Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.', 500)
  }

  return stripe
}

export async function createCheckoutSession(payload) {
  const stripeClient = getStripeClient()
  let pendingOrder = null

  try {
    const { order, preparedOrder } = await createPendingOrder(payload)
    pendingOrder = order

    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      success_url: `${env.clientUrl}/order/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/order/cancel?orderId=${order.id}`,
      customer_email: order.customer?.email || undefined,
      metadata: {
        orderId: order.id,
        customerName: order.customer?.fullName || '',
      },
      line_items: preparedOrder.orderItemsData.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(item.unitPrice) * 100),
          product_data: {
            name: item.product.name,
            description: item.variant
              ? `${item.variant.color} / ${item.variant.size}`
              : item.product.description,
            images: item.product.imageUrl ? [item.product.imageUrl] : [],
            metadata: {
              productId: item.product.id,
              variantId: item.variant?.id || '',
            },
          },
        },
      })),
    })

    if (!session.url) {
      throw new AppError('Stripe session URL was not returned', 500)
    }

    await updateOrderStripeSession(order.id, session.id)

    return {
      url: session.url,
      orderId: order.id,
      sessionId: session.id,
    }
  } catch (error) {
    if (pendingOrder?.id) {
      await rollbackPendingOrder(pendingOrder.id)
    }

    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Unable to create Stripe Checkout session', 500)
  }
}

export function constructWebhookEvent(rawBody, signature) {
  const stripeClient = getStripeClient()

  if (!env.stripeWebhookSecret) {
    throw new AppError('Stripe webhook secret is not configured. Add STRIPE_WEBHOOK_SECRET to the server environment.', 500)
  }

  if (!signature) {
    throw new AppError('Missing Stripe signature header', 400)
  }

  try {
    return stripeClient.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret)
  } catch {
    throw new AppError('Invalid Stripe webhook signature', 400)
  }
}

export async function handleWebhookEvent(event) {
  if (env.nodeEnv === 'development') {
    console.log(`Stripe webhook received: ${event.type}`)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const order = await markOrderPaidByStripeSession(session.id)
      return { received: true, orderId: order.id, eventType: event.type }
    }
    case 'checkout.session.expired': {
      const session = event.data.object
      const order = await markOrderFailedByStripeSession(session.id, { cancelOrder: true })
      return { received: true, orderId: order.id, eventType: event.type }
    }
    default:
      return { received: true, ignored: true, eventType: event.type }
  }
}

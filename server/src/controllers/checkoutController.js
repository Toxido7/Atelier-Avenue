import * as stripeService from '../services/stripeService.js'

export async function createCheckoutSession(req, res) {
  const session = await stripeService.createCheckoutSession(req.body)
  res.status(201).json(session)
}

export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature']
  const event = stripeService.constructWebhookEvent(req.body, signature)
  const result = await stripeService.handleWebhookEvent(event)
  res.json(result)
}

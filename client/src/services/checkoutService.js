import { loadStripe } from '@stripe/stripe-js'
import apiClient from './api/client'

let stripePromise

export function getStripeClient() {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error('Stripe publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to the client environment.')
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey)
  }

  return stripePromise
}

export async function createCheckoutSession(payload) {
  const { data } = await apiClient.post('/api/checkout/create-session', payload)
  return data
}

export async function redirectToCheckout(sessionUrl) {
  await getStripeClient()
  window.location.assign(sessionUrl)
}

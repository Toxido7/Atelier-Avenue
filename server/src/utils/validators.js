import { AppError } from './AppError.js'

export function validateOrderPayload(payload) {
  const errors = []

  if (!payload.customer || typeof payload.customer !== 'object') {
    errors.push('Customer information is required.')
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('At least one order item is required.')
  }

  if (!payload.paymentMethod) {
    errors.push('Payment method is required.')
  }

  if (payload.customer) {
    const { fullName, phone, city, address } = payload.customer

    if (!fullName?.trim()) errors.push('Customer full name is required.')
    if (!phone?.trim()) errors.push('Customer phone is required.')
    if (!city?.trim()) errors.push('Customer city is required.')
    if (!address?.trim()) errors.push('Customer address is required.')
  }

  if (errors.length) {
    throw new AppError('Invalid order payload', 400, errors)
  }
}

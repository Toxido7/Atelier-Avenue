import apiClient from './api/client'

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'

function normalizeOrderItem(item = {}, index = 0) {
  return {
    id: item.id || `item-${index}`,
    quantity: Number(item.quantity || 0),
    subtotal: Number(item.subtotal || 0),
    product: {
      id: item.product?.id || '',
      name: item.product?.name || 'Unnamed product',
      imageUrl: item.product?.imageUrl || fallbackImage,
      slug: item.product?.slug || '',
    },
    variant: item.variant
      ? {
          id: item.variant.id || '',
          size: item.variant.size || '',
          color: item.variant.color || '',
          sku: item.variant.sku || '',
        }
      : null,
  }
}

function normalizeAdminOrder(order = {}, index = 0) {
  return {
    id: order.id || `order-${index}`,
    totalAmount: Number(order.totalAmount || 0),
    status: order.status || 'PENDING',
    paymentStatus: order.paymentStatus || 'PENDING',
    paymentMethod: order.paymentMethod || 'Stripe Checkout',
    createdAt: order.createdAt || new Date().toISOString(),
    customer: {
      fullName: order.customer?.fullName || 'Guest customer',
      email: order.customer?.email || '',
      phone: order.customer?.phone || '',
      city: order.customer?.city || '',
      address: order.customer?.address || '',
    },
    items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
  }
}

export async function getAdminOrders(params = {}) {
  const { data } = await apiClient.get('/api/admin/orders', { params })
  return (data.orders || []).map(normalizeAdminOrder)
}

export async function getAdminOrderById(id) {
  const { data } = await apiClient.get(`/api/admin/orders/${id}`)
  return normalizeAdminOrder(data.order)
}

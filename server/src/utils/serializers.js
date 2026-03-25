export function toPlainProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    variants: product.variants?.map((variant) => ({
      ...variant,
    })),
  }
}

export function toPlainOrder(order) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items?.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  }
}

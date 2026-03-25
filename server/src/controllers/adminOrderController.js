import { AppError } from '../utils/AppError.js'
import * as adminOrderService from '../services/adminOrderService.js'

export async function listAdminOrders(req, res) {
  const orders = await adminOrderService.listAdminOrders(req.query)
  res.json({ orders })
}

export async function getAdminOrder(req, res) {
  const order = await adminOrderService.getAdminOrderById(req.params.id)

  if (!order) {
    throw new AppError('Order not found', 404)
  }

  res.json({ order })
}

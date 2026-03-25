import * as adminProductService from '../services/adminProductService.js'

export async function listAdminProducts(req, res) {
  const products = await adminProductService.listAdminProducts()
  res.json({ products })
}

export async function createAdminProduct(req, res) {
  const product = await adminProductService.createAdminProduct(req.body)
  res.status(201).json({ product })
}

export async function updateAdminProduct(req, res) {
  const product = await adminProductService.updateAdminProduct(req.params.id, req.body)
  res.json({ product })
}

export async function deleteAdminProduct(req, res) {
  const result = await adminProductService.deleteAdminProduct(req.params.id)
  res.json(result)
}

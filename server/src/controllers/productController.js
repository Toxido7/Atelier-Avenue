import * as productService from '../services/productService.js'

export async function listProducts(req, res) {
  const products = await productService.getProducts(req.query)
  res.json({ products })
}

export async function getProduct(req, res) {
  const data = await productService.getProductBySlug(req.params.slug)
  res.json(data)
}

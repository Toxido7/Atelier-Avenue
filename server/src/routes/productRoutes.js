import { Router } from 'express'
import { getProduct, listProducts } from '../controllers/productController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(listProducts))
router.get('/:slug', asyncHandler(getProduct))

export default router

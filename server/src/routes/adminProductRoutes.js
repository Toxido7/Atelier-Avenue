import { Router } from 'express'
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  updateAdminProduct,
} from '../controllers/adminProductController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAdmin)
router.get('/', asyncHandler(listAdminProducts))
router.post('/', asyncHandler(createAdminProduct))
router.put('/:id', asyncHandler(updateAdminProduct))
router.delete('/:id', asyncHandler(deleteAdminProduct))

export default router

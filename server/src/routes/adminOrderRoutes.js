import { Router } from 'express'
import { getAdminOrder, listAdminOrders } from '../controllers/adminOrderController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAdmin)
router.get('/', asyncHandler(listAdminOrders))
router.get('/:id', asyncHandler(getAdminOrder))

export default router

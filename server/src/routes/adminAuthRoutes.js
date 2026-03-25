import { Router } from 'express'
import { getAdminMe, loginAdmin, logoutAdmin } from '../controllers/adminAuthController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/login', asyncHandler(loginAdmin))
router.post('/logout', asyncHandler(logoutAdmin))
router.get('/me', asyncHandler(getAdminMe))

export default router

import { Router } from 'express'
import { createCheckoutSession } from '../controllers/checkoutController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/create-session', asyncHandler(createCheckoutSession))

export default router

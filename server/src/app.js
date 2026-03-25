import cors from 'cors'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import { env } from './config/env.js'
import { handleStripeWebhook } from './controllers/checkoutController.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import adminOrderRoutes from './routes/adminOrderRoutes.js'
import adminProductRoutes from './routes/adminProductRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { asyncHandler } from './utils/asyncHandler.js'

const app = express()

if (env.isProduction) {
  app.set('trust proxy', 1)
}

app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), asyncHandler(handleStripeWebhook))

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS origin not allowed'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(
  session({
    name: 'fashion_admin.sid',
    secret: env.adminSessionSecret || 'development-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
)
app.use(morgan(env.isProduction ? 'combined' : 'dev'))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/admin', adminAuthRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/orders', adminOrderRoutes)

app.use('/api/*', notFound)
app.use(notFound)
app.use(errorHandler)

export default app

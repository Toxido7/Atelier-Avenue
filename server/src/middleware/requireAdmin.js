import { AppError } from '../utils/AppError.js'

export function requireAdmin(req, res, next) {
  if (!req.session?.admin) {
    return next(new AppError('Admin authentication required', 401))
  }

  return next()
}

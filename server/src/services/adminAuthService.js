import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

export async function loginAdmin(session, credentials) {
  if (!env.adminEmail || !env.adminPassword || !env.adminSessionSecret) {
    throw new AppError('Admin credentials are not configured in the server environment.', 500)
  }

  if (credentials.email !== env.adminEmail || credentials.password !== env.adminPassword) {
    throw new AppError('Invalid admin credentials', 401)
  }

  session.admin = {
    email: env.adminEmail,
    loggedInAt: new Date().toISOString(),
  }

  return session.admin
}

export async function logoutAdmin(session) {
  return new Promise((resolve, reject) => {
    session.destroy((error) => {
      if (error) {
        reject(new AppError('Unable to log out admin session', 500))
        return
      }

      resolve()
    })
  })
}

export async function getAdminSession(session) {
  return {
    isAuthenticated: Boolean(session?.admin),
    admin: session?.admin || null,
  }
}

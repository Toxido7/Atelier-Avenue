import * as adminAuthService from '../services/adminAuthService.js'

export async function loginAdmin(req, res) {
  const admin = await adminAuthService.loginAdmin(req.session, req.body)
  res.json({ isAuthenticated: true, admin })
}

export async function logoutAdmin(req, res) {
  await adminAuthService.logoutAdmin(req.session)
  res.clearCookie('fashion_admin.sid')
  res.json({ success: true })
}

export async function getAdminMe(req, res) {
  const session = await adminAuthService.getAdminSession(req.session)
  res.json(session)
}

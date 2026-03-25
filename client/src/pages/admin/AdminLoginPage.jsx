import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useUI } from '../../context/UIContext'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAdminAuth()
  const { showToast } = useUI()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      await login(formData)
      showToast('Admin session started.', 'success')
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to sign in.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="surface-card space-y-8 px-6 py-10 md:px-8">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone">Admin Login</p>
            <h1 className="text-3xl font-semibold tracking-tight">Manage the storefront</h1>
            <p className="text-sm leading-6 text-stone">
              Sign in with the environment-configured admin credentials to access products and orders.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Admin email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage

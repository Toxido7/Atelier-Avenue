import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'

function CheckoutForm({ onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    phone: '+1 (555) 216-9090',
    address: '123 Mercer Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10012',
    cardNumber: '4242 4242 4242 4242',
    cardName: 'Alex Morgan',
    expiry: '08/28',
    cvv: '123',
    country: 'US',
    paymentMethod: 'CARD',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="surface-card grid gap-8 p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
        <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <Input label="Street address" name="address" value={formData.address} onChange={handleChange} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="City" name="city" value={formData.city} onChange={handleChange} />
        <Select label="State" name="state" value={formData.state} onChange={handleChange}>
          <option value="NY">New York</option>
          <option value="CA">California</option>
          <option value="TX">Texas</option>
        </Select>
        <Input label="ZIP code" name="zipCode" value={formData.zipCode} onChange={handleChange} />
      </div>
      <Select label="Payment method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
        <option value="CARD">Stripe test card</option>
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Card number" name="cardNumber" value={formData.cardNumber} onChange={handleChange} />
        <Input label="Name on card" name="cardName" value={formData.cardName} onChange={handleChange} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Expiry" name="expiry" value={formData.expiry} onChange={handleChange} />
        <Input label="CVV" name="cvv" value={formData.cvv} onChange={handleChange} />
        <Select label="Country" name="country" value={formData.country} onChange={handleChange}>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
        </Select>
      </div>
      <p className="text-sm leading-6 text-stone">
        Test mode uses Stripe Checkout for the actual payment step. The card fields here are a familiar preview of the purchase details before redirection.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="sm:flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Redirecting...' : 'Continue to Payment'}
        </Button>
        <Link to="/order/cancel" className="sm:flex-1">
          <Button variant="secondary" className="w-full" disabled={isSubmitting}>Cancel</Button>
        </Link>
      </div>
    </form>
  )
}

export default CheckoutForm

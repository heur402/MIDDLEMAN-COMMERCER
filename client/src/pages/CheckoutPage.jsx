import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, Mail, Phone } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import CartSummary from '../components/cart/CartSummary'
import Input from '../components/common/Input'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../api/orders.api'
import { formatCurrency } from '../utils/formatCurrency'
import toast from 'react-hot-toast'

const BLANK = { name: '', email: '', phone: '' }
const BLANK_ADDR = { street: '', city: '', state: '', zip: '', country: '' }

export default function CheckoutPage() {
  const { items, sellerGroups, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Guest contact info — only shown when not authenticated
  const [guest, setGuest]       = useState(BLANK)
  const [address, setAddress]   = useState(BLANK_ADDR)
  const [placing, setPlacing]   = useState(false)
  const [errors, setErrors]     = useState({})

  function setG(f, v) { setGuest((g) => ({ ...g, [f]: v })) }
  function setA(f, v) { setAddress((a) => ({ ...a, [f]: v })) }

  function validate() {
    const e = {}
    if (!isAuthenticated) {
      if (!guest.name.trim() || guest.name.trim().length < 2) e.name  = 'Name is required'
      if (!guest.email.trim())                                 e.email = 'Email is required'
    }
    if (!address.street.trim()) e.street  = 'Street is required'
    if (!address.city.trim())   e.city    = 'City is required'
    if (!address.country.trim()) e.country = 'Country is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function placeOrder() {
    if (!validate()) return
    setPlacing(true)
    try {
      const orderPayloads = sellerGroups.map((group) => ({
        sellerId: group.sellerId,
        items: group.items.map((i) => ({
          productId: i.productId,
          sellerId:  i.sellerId,
          qty:       i.qty,
          price:     i.price,
        })),
        shippingAddress: address,
        totalAmount: group.items.reduce((s, i) => s + i.price * i.qty, 0),
      }))

      const payload = {
        orders: orderPayloads,
        ...(!isAuthenticated && { guestBuyer: guest }),
      }

      const { data } = await ordersApi.place(payload)
      clearCart()

      const orderIds = data.data?.map((o) => o._id) ?? []
      const emailParam = isAuthenticated ? '' : `&email=${encodeURIComponent(guest.email)}`
      navigate(`/order-confirmation?ids=${orderIds.join(',')}${emailParam}`)
      toast.success('Order placed!')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: guest info + address */}
          <div className="md:col-span-2 space-y-4">

            {/* Guest contact info — shown only when not logged in */}
            {!isAuthenticated && (
              <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <User size={16} className="text-orange-500" />
                  Your Contact Details
                </h2>
                <p className="text-xs text-gray-500">
                  No account needed — we'll use this to send you order updates.
                </p>
                <Input
                  label="Full name" required
                  placeholder="Jane Smith"
                  leadingIcon={User}
                  value={guest.name}
                  onChange={(e) => setG('name', e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email address" type="email" required
                  placeholder="you@example.com"
                  leadingIcon={Mail}
                  value={guest.email}
                  onChange={(e) => setG('email', e.target.value)}
                  error={errors.email}
                  helperText="We'll send your order confirmation here"
                />
                <Input
                  label="Phone number (optional)"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  leadingIcon={Phone}
                  value={guest.phone}
                  onChange={(e) => setG('phone', e.target.value)}
                />
              </div>
            )}

            {/* Shipping address */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={16} className="text-orange-500" />
                Shipping Address
              </h2>
              <Input
                label="Street address" required
                placeholder="123 Main St"
                value={address.street}
                onChange={(e) => setA('street', e.target.value)}
                error={errors.street}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City" required
                  placeholder="Kigali"
                  value={address.city}
                  onChange={(e) => setA('city', e.target.value)}
                  error={errors.city}
                />
                <Input
                  label="State / Province"
                  placeholder="Eastern Province"
                  value={address.state}
                  onChange={(e) => setA('state', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ZIP / Postal code"
                  placeholder="00100"
                  value={address.zip}
                  onChange={(e) => setA('zip', e.target.value)}
                />
                <Input
                  label="Country" required
                  placeholder="Rwanda"
                  value={address.country}
                  onChange={(e) => setA('country', e.target.value)}
                  error={errors.country}
                />
              </div>
            </div>

            {/* Order review */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Your Items</h2>
              {sellerGroups.map((group) => (
                <div key={group.sellerId} className="mb-4 last:mb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {group.sellerName}
                  </p>
                  {group.items.map((item) => (
                    <div key={item.productId} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-orange-500 shrink-0">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Payment note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">💳 Payment</p>
              <p>Payment processing is coming soon. Your order will be confirmed and marked <strong>unpaid</strong> until integrated.</p>
            </div>
          </div>

          {/* Right: order summary */}
          <CartSummary
            showCheckoutButton={false}
            showPlaceOrderButton
            onPlaceOrder={placeOrder}
            placingOrder={placing}
          />
        </div>
      </div>
    </PageWrapper>
  )
}

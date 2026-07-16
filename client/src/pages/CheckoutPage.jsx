import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import CartSummary from '../components/cart/CartSummary'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../api/orders.api'
import { formatCurrency } from '../utils/formatCurrency'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'

const BLANK_ADDRESS = {
  street: '', city: '', state: '', zip: '', country: '',
}

export default function CheckoutPage() {
  const { items, sellerGroups, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0]
  const [selectedAddress, setSelectedAddress] = useState(defaultAddr ?? null)
  const [newAddress, setNewAddress] = useState(BLANK_ADDRESS)
  const [useNew, setUseNew] = useState(!defaultAddr)
  const [placing, setPlacing] = useState(false)

  const shippingAddress = useNew ? newAddress : selectedAddress

  function setAddr(field, val) {
    setNewAddress((a) => ({ ...a, [field]: val }))
  }

  function validateAddress(addr) {
    return addr?.street && addr?.city && addr?.country
  }

  async function placeOrder() {
    if (!validateAddress(shippingAddress)) {
      toast.error('Please fill in your shipping address')
      return
    }

    setPlacing(true)
    try {
      // Build one order per seller group
      const orderPayloads = sellerGroups.map((group) => ({
        sellerId: group.sellerId,
        items: group.items.map((i) => ({
          productId: i.productId,
          sellerId: i.sellerId,
          qty: i.qty,
          price: i.price,
        })),
        shippingAddress,
        totalAmount: group.items.reduce((s, i) => s + i.price * i.qty, 0),
      }))

      const { data } = await ordersApi.place({ orders: orderPayloads })
      clearCart()
      const orderIds = data.data?.map((o) => o._id) ?? []
      navigate(`/order-confirmation?ids=${orderIds.join(',')}`)
      toast.success('Order placed successfully!')
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
          {/* Left: address + order review */}
          <div className="md:col-span-2 space-y-4">
            {/* Shipping address */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-orange-500" />
                Shipping Address
              </h2>

              {/* Saved addresses */}
              {user?.addresses?.length > 0 && (
                <div className="space-y-2 mb-4">
                  {user.addresses.map((addr, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        !useNew && selectedAddress === addr
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={!useNew && selectedAddress === addr}
                        onChange={() => { setSelectedAddress(addr); setUseNew(false) }}
                        className="accent-orange-500 mt-0.5"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{addr.label ?? 'Address'}</p>
                        <p className="text-gray-600">{addr.street}, {addr.city}, {addr.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Use new address toggle */}
              <button
                type="button"
                onClick={() => setUseNew(true)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-colors mb-4 ${
                  useNew ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-dashed border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Plus size={16} />
                {user?.addresses?.length > 0 ? 'Use a different address' : 'Enter shipping address'}
              </button>

              {useNew && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Street address"
                    required
                    className="col-span-2"
                    containerClassName="col-span-2"
                    placeholder="123 Main St"
                    value={newAddress.street}
                    onChange={(e) => setAddr('street', e.target.value)}
                  />
                  <Input
                    label="City"
                    required
                    placeholder="Kigali"
                    value={newAddress.city}
                    onChange={(e) => setAddr('city', e.target.value)}
                  />
                  <Input
                    label="State / Province"
                    placeholder="Eastern Province"
                    value={newAddress.state}
                    onChange={(e) => setAddr('state', e.target.value)}
                  />
                  <Input
                    label="ZIP / Postal code"
                    placeholder="00100"
                    value={newAddress.zip}
                    onChange={(e) => setAddr('zip', e.target.value)}
                  />
                  <Input
                    label="Country"
                    required
                    placeholder="Rwanda"
                    value={newAddress.country}
                    onChange={(e) => setAddr('country', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Order review */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Review Your Order</h2>
              {sellerGroups.map((group) => (
                <div key={group.sellerId} className="mb-4 last:mb-0">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
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
              <p>Payment processing is coming soon. Your order will be confirmed and marked as <strong>unpaid</strong> until payment is integrated.</p>
            </div>
          </div>

          {/* Right: summary */}
          <div>
            <CartSummary showCheckoutButton={false} showPlaceOrderButton onPlaceOrder={placeOrder} placingOrder={placing} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

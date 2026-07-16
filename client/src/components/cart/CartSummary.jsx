import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

/**
 * Order summary panel shown in cart and checkout pages.
 *
 * @param {boolean} showCheckoutButton  Show "Proceed to checkout" CTA (default true)
 * @param {boolean} showPlaceOrderButton Show "Place Order" CTA (used on checkout page)
 * @param {function} onPlaceOrder  Called when "Place Order" is clicked
 * @param {boolean} placingOrder
 */
export default function CartSummary({
  showCheckoutButton = true,
  showPlaceOrderButton = false,
  onPlaceOrder,
  placingOrder = false,
}) {
  const { items, totalPrice, totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const shipping = 0 // free shipping in MVP
  const total = totalPrice + shipping

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Items ({totalItems})</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span className="text-orange-500 text-base">{formatCurrency(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Button fullWidth size="lg" onClick={handleCheckout} disabled={items.length === 0}>
          <ShoppingBag size={18} />
          Proceed to Checkout
        </Button>
      )}

      {showPlaceOrderButton && (
        <Button
          fullWidth
          size="lg"
          onClick={onPlaceOrder}
          loading={placingOrder}
          disabled={items.length === 0}
        >
          Place Order
        </Button>
      )}

      <p className="text-xs text-gray-400 text-center">
        Secure checkout • Money-back guarantee
      </p>
    </div>
  )
}

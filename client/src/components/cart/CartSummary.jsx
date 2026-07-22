import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'
import Button from '../common/Button'

/**
 * Order summary panel used in cart and checkout pages.
 * No login required — buyers can always proceed to checkout.
 */
export default function CartSummary({
  showCheckoutButton   = true,
  showPlaceOrderButton = false,
  onPlaceOrder,
  placingOrder = false,
}) {
  const { items, totalPrice, totalItems } = useCart()
  const navigate = useNavigate()

  const total = totalPrice // free shipping in MVP

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
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
        >
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

      {/* Trust signal */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock size={12} />
        <span>No account needed · Safe checkout</span>
      </div>
    </div>
  )
}

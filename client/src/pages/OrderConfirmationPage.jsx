import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, Search } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  const ids   = searchParams.get('ids')?.split(',').filter(Boolean) ?? []
  const email = searchParams.get('email') // present for guest orders

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your order has been received and is awaiting seller confirmation.
        </p>

        {ids.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            Order ID{ids.length > 1 ? 's' : ''}:{' '}
            <span className="font-mono font-semibold">
              {ids.map((id) => id.slice(-8).toUpperCase()).join(', ')}
            </span>
          </p>
        )}

        {/* Guest — show email confirmation tip */}
        {email && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800 mb-6 text-left">
            <p className="font-semibold mb-1">📧 Save your order details</p>
            <p>
              A confirmation was sent to <strong>{email}</strong>.
              You can track your order anytime without an account.
            </p>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 mb-8 text-left">
          <p className="font-semibold mb-1">🔒 What happens next?</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-green-700">
            <li>The seller confirms your order within 24 hours.</li>
            <li>Once shipped you'll receive a tracking number.</li>
            <li>Mark it as delivered when it arrives.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Button as={Link} to="/orders">
              <Package size={16} /> View My Orders
            </Button>
          ) : ids.length > 0 ? (
            <Button
              as={Link}
              to={`/track-order?orderId=${ids[0]}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
            >
              <Search size={16} /> Track My Order
            </Button>
          ) : null}
          <Button as={Link} to="/" variant="secondary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

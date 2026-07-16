import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        {ids.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Order{ids.length > 1 ? 's' : ''}: {ids.map((id) => id.slice(-8).toUpperCase()).join(', ')}
          </p>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 mb-8 text-left">
          <p className="font-semibold mb-1">🔒 What happens next?</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-green-700">
            <li>The seller will confirm your order within 24 hours.</li>
            <li>Once shipped, you'll receive a tracking number.</li>
            <li>Mark it as delivered when it arrives.</li>
            <li>Your payment is released to the seller after confirmation.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button as={Link} to="/orders" variant="primary">
            <Package size={16} />
            View My Orders
          </Button>
          <Button as={Link} to="/" variant="secondary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

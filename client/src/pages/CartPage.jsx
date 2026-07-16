import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, sellerGroups } = useCart()

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add items from our store to get started."
            action={
              <Button as={Link} to="/browse">
                Browse Products
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Item list */}
            <div className="md:col-span-2 space-y-4">
              {sellerGroups.map((group) => (
                <div key={group.sellerId} className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
                    Seller: {group.sellerName}
                  </p>
                  {group.items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

const CART_KEY = 'middleman_cart'

// ── State ─────────────────────────────────────────────────────────────────────
function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, qty = 1 } = action.payload
      const existing = state.find((i) => i.productId === product._id)
      if (existing) {
        return state.map((i) =>
          i.productId === product._id
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
            : i
        )
      }
      return [
        ...state,
        {
          productId: product._id,
          sellerId: product.sellerId._id ?? product.sellerId,
          sellerName: product.sellerId?.name ?? 'Seller',
          title: product.title,
          price: product.price,
          image: product.images?.[0] ?? null,
          stock: product.stock,
          qty,
        },
      ]
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.productId !== action.payload)
    case 'UPDATE_QTY':
      return state.map((i) =>
        i.productId === action.payload.productId
          ? { ...i, qty: Math.max(1, Math.min(action.payload.qty, i.stock)) }
          : i
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, qty = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, qty } })
  }, [])

  const removeItem = useCallback((productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQty = useCallback((productId, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, qty } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  // Derived values
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  // Group items by seller for checkout
  const grouped = items.reduce((acc, item) => {
    const key = item.sellerId
    if (!acc[key]) acc[key] = { sellerId: key, sellerName: item.sellerName, items: [] }
    acc[key].items.push(item)
    return acc
  }, {})
  const sellerGroups = Object.values(grouped)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        sellerGroups,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

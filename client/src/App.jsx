import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontSize: '14px',
                maxWidth: '360px',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

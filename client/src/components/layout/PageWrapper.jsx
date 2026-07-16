import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Standard page shell: Navbar + scrollable content area + Footer.
 * Also adds bottom padding on mobile to account for the fixed tab bar.
 */
export default function PageWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
    </div>
  )
}

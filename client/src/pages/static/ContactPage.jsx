import { Mail, MessageCircle, Clock } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'

export default function ContactPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Contact Us</h1>
          <p className="text-orange-100 text-base">
            We're here to help. Reach out any time and we'll get back to you.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Content goes here */}
      </div>
    </PageWrapper>
  )
}

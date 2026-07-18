import { useState } from 'react'
import { Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import Button from '../../components/common/Button'

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    // Stub — real form submission wired in Phase 2
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
  }
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
        {/* Contact form */}
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h2>
            <p className="text-sm text-gray-600">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Send us a message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your name" required
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
              <Input
                label="Email address" type="email" required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>
            <Input
              label="Subject" required
              placeholder="What's your question about?"
              value={form.subject}
              onChange={(e) => set('subject', e.target.value)}
            />
            <Textarea
              label="Message" required rows={6}
              placeholder="Describe your issue or question in detail..."
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
            />
            <Button type="submit" loading={sending} size="lg">
              <Send size={16} />
              Send Message
            </Button>
          </form>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mail,           label: 'Email',        value: 'support@middleman.com',    sub: 'We reply within 24 h' },
            { icon: MessageCircle,  label: 'Live Chat',    value: 'Available in-app',         sub: 'Mon–Fri, 9 am–6 pm' },
            { icon: Clock,          label: 'Response Time',value: 'Under 24 hours',           sub: 'On business days' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Icon size={22} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

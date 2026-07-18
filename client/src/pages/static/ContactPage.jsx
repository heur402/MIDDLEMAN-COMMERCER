import { useState } from 'react'
import { Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import Button from '../../components/common/Button'

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
        {/* Info cards */}
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

export const FAQ_CATEGORIES = [
  {
    title: 'Buying',
    items: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse products, add items to your cart, then proceed to checkout. Choose a shipping address and confirm your order. The seller will be notified immediately.',
      },
      {
        question: 'Is my payment safe?',
        answer:
          'Yes. MiddleMan holds your payment securely until you confirm that the order has been delivered. Your money is never released to the seller before you receive your item.',
      },
      {
        question: 'What happens if I don\'t receive my order?',
        answer:
          'If your item has not arrived within the expected window, open a dispute from your order detail page. Our support team will review the case and issue a refund if the dispute is resolved in your favour.',
      },
      {
        question: 'Can I cancel an order?',
        answer:
          'You can cancel an order while it is still in "Pending" status — before the seller confirms it. Once confirmed, cancellation requires seller agreement or a dispute.',
      },
      {
        question: 'How do I track my shipment?',
        answer:
          'Once the seller ships your order, a tracking number will appear on your order detail page. Sellers enter this manually — there is no automatic carrier integration yet.',
      },
    ],
  },
  {
    title: 'Selling',
    items: [
      {
        question: 'How do I start selling?',
        answer:
          'Go to your profile page and click "Become a Seller". Once enabled, navigate to the Seller Dashboard to create your first listing.',
      },
      {
        question: 'What fees does MiddleMan charge?',
        answer:
          'MiddleMan is currently in beta. Fees will be announced before the platform goes live. For now, listing and selling are free.',
      },
      {
        question: 'How do I get paid?',
        answer:
          'Earnings are tracked in your seller dashboard. Payment processing and payouts will be handled via Stripe Connect in a future release.',
      },
      {
        question: 'Can I sell used items?',
        answer:
          'Yes. MiddleMan supports new, like-new, good, fair, and poor condition listings. Be honest in your description so buyers know what to expect.',
      },
      {
        question: 'How do I handle a dispute raised against me?',
        answer:
          'You will be notified when a buyer opens a dispute. Provide any evidence that supports your case through the dispute detail page. Our team will mediate and reach a fair resolution.',
      },
    ],
  },
  {
    title: 'Account & Security',
    items: [
      {
        question: 'How do I reset my password?',
        answer:
          'Password reset via email is coming soon. For now, contact support through the Contact Us page and we will assist you manually.',
      },
      {
        question: 'Can one account be both a buyer and a seller?',
        answer:
          'Yes. You can enable the seller role from your profile at any time. Both roles operate under the same account and email address.',
      },
      {
        question: 'What happens if my account gets suspended?',
        answer:
          'Accounts are suspended for policy violations such as fraud, fake listings, or harassment. If you believe a suspension was made in error, contact our support team to appeal.',
      },
    ],
  },
  {
    title: 'Orders & Disputes',
    items: [
      {
        question: 'What is the order status lifecycle?',
        answer:
          'Orders move through: Pending → Confirmed → Shipped → Delivered → Completed. Each step is logged with a timestamp in the order timeline.',
      },
      {
        question: 'How long does dispute resolution take?',
        answer:
          'We aim to review all disputes within 3–5 business days. Complex cases may take longer. You will be notified of every status update.',
      },
      {
        question: 'Can I leave a review before the order is completed?',
        answer:
          'No. Reviews can only be submitted once the order reaches "Completed" status. This ensures reviews reflect the full experience including delivery.',
      },
    ],
  },
]

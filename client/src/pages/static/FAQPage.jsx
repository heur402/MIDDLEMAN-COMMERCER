import PageWrapper from '../../components/layout/PageWrapper'

export default function FAQPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Frequently Asked Questions</h1>
          <p className="text-orange-100 text-base max-w-xl mx-auto">
            Everything you need to know about buying, selling, and staying safe on MiddleMan.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Content will go here */}
      </div>
    </PageWrapper>
  )
}

import PageWrapper from '../../components/layout/PageWrapper'
import PolicyLayout from '../../components/layout/PolicyLayout'
import { TERMS_SECTIONS } from '../../data/termsData'

export default function TermsPage() {
  return (
    <PageWrapper>
      <PolicyLayout
        title="Terms of Service"
        lastUpdated="July 2026"
        sections={TERMS_SECTIONS}
      />
    </PageWrapper>
  )
}

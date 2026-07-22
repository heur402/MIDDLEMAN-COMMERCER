import PageWrapper from '../../components/layout/PageWrapper'
import PolicyLayout from '../../components/layout/PolicyLayout'
import { PRIVACY_SECTIONS } from '../../data/privacyData'

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <PolicyLayout
        title="Privacy Policy"
        lastUpdated="July 2026"
        sections={PRIVACY_SECTIONS}
      />
    </PageWrapper>
  )
}

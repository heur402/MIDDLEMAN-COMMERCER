import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <p className="text-8xl font-black text-orange-500 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3">
          <Button as={Link} to="/">Go Home</Button>
          <Button as={Link} to="/browse" variant="secondary">Browse Products</Button>
        </div>
      </div>
    </PageWrapper>
  )
}

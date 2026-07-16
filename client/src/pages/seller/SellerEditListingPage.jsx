import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'
import ProductForm from '../../components/products/ProductForm'
import { PageSpinner } from '../../components/common/Spinner'
import { productsApi } from '../../api/products.api'
import toast from 'react-hot-toast'

export default function SellerEditListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    productsApi
      .getById(id)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(formData) {
    setSaving(true)
    try {
      await productsApi.update(id, {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
        stock: formData.stock,
        status: formData.status,
        tags: formData.tags,
      })

      if (formData.newImageFiles?.length > 0) {
        const imageFormData = new FormData()
        formData.newImageFiles.forEach((file) => imageFormData.append('images', file))
        await productsApi.uploadImages(id, imageFormData)
      }

      toast.success('Listing updated!')
      navigate('/seller/listings')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageWrapper><PageSpinner /></PageWrapper>

  if (!product) return (
    <PageWrapper>
      <div className="text-center py-20 text-gray-500">Listing not found.</div>
    </PageWrapper>
  )

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Listing</h1>
        <ProductForm initialValues={product} onSubmit={handleSubmit} loading={saving} />
      </div>
    </PageWrapper>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'
import ProductForm from '../../components/products/ProductForm'
import { productsApi } from '../../api/products.api'
import toast from 'react-hot-toast'

export default function SellerCreateListingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData) {
    setLoading(true)
    try {
      // Create the product first
      const { data } = await productsApi.create({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
        stock: formData.stock,
        status: formData.status,
        tags: formData.tags,
      })

      const productId = data.data._id

      // Upload images if any
      if (formData.newImageFiles?.length > 0) {
        const imageFormData = new FormData()
        formData.newImageFiles.forEach((file) => imageFormData.append('images', file))
        await productsApi.uploadImages(productId, imageFormData)
      }

      toast.success('Listing created!')
      navigate('/seller/listings')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Create New Listing</h1>
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </PageWrapper>
  )
}

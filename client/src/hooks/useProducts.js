import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '../api/products.api'

export function useProducts(params = {}) {
  const [products, setProducts]     = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const key = JSON.stringify(params)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
      )
      const { data } = params.q
        ? await productsApi.search(clean)
        : await productsApi.list(clean)
      setProducts(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 })
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch() }, [fetch])

  return { products, pagination, loading, error, refetch: fetch }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    productsApi.getById(id)
      .then(({ data }) => setProduct(data.data))
      .catch((err) => setError(err?.response?.data?.message ?? 'Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}

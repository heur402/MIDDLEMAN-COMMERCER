import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '../api/orders.api'

/**
 * Fetch buyer's order list with optional status filter.
 */
export function useBuyerOrders(params = {}) {
  const [orders, setOrders]       = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const key = JSON.stringify(params)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await ordersApi.getMyOrders(params)
      setOrders(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 })
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch() }, [fetch])

  return { orders, pagination, loading, error, refetch: fetch }
}

/**
 * Fetch a single order by ID (buyer view).
 */
export function useOrder(id) {
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const { data } = await ordersApi.getById(id)
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Order not found')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { order, loading, error, refetch: fetch }
}

/**
 * Fetch seller's incoming orders.
 */
export function useSellerOrders(params = {}) {
  const [orders, setOrders]       = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading]     = useState(true)

  const key = JSON.stringify(params)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await ordersApi.getSellerOrders(params)
      setOrders(data.data ?? [])
      setPagination(data.pagination ?? { page: 1, totalPages: 1, total: 0 })
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch() }, [fetch])

  return { orders, pagination, loading, refetch: fetch }
}

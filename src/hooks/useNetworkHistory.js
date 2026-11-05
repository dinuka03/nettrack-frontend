import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom React hook for fetching and managing recent network interval usage records.
 *
 * - Fetches records on mount from `GET /api/network/history?limit=100`.
 * - Provides a manual `refresh` trigger with in-flight protection.
 * - Cleans up active requests using AbortController on component unmount.
 * - Preserves the backend's newest-first order.
 *
 * @param {number} limit Maximum records to retrieve (fixed to 100)
 */
export function useNetworkHistory(limit = 100) {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetchedAt, setLastFetchedAt] = useState(null)

  const isMountedRef = useRef(true)
  const abortControllerRef = useRef(null)
  const isFetchingRef = useRef(false)

  const fetchHistory = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) {
      return
    }

    isFetchingRef.current = true

    if (isManualRefresh) {
      setIsRefreshing(true)
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(`/api/network/history?limit=${limit}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Error'})`)
      }

      const json = await response.json()

      if (!isMountedRef.current) return

      if (!Array.isArray(json)) {
        throw new Error('Malformed history response: expected JSON array')
      }

      // Backend returns records newest-first (ORDER BY recorded_at_epoch_ms DESC, id DESC).
      // We preserve this ordering directly.
      setHistory(json)
      setError(null)
      setLastFetchedAt(new Date())
    } catch (err) {
      if (err.name === 'AbortError') return
      if (!isMountedRef.current) return

      setError(err.message || 'Failed to fetch network usage history')
    } finally {
      isFetchingRef.current = false
      if (isMountedRef.current) {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }
  }, [limit])

  useEffect(() => {
    isMountedRef.current = true
    fetchHistory(false)

    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchHistory])

  return {
    history,
    isLoading,
    isRefreshing,
    error,
    lastFetchedAt,
    refresh: () => fetchHistory(true),
  }
}


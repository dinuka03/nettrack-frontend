import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom React hook for polling the current network monitoring state.
 *
 * - Automatically fetches on mount and polls every `pollIntervalMs` (default 1000ms).
 * - Prevents overlapping requests using an in-flight flag.
 * - Safely handles unmounting with AbortController and timer cleanup.
 * - Retains the last valid 'READY' snapshot when a subsequent refresh encounters a network error.
 *
 * @param {number} pollIntervalMs Polling frequency in milliseconds (default 1000)
 */
export function useCurrentNetwork(pollIntervalMs = 1000) {
  const [data, setData] = useState(null)
  const [networkError, setNetworkError] = useState(null)
  const [isRetainingPrevious, setIsRetainingPrevious] = useState(false)
  const [lastSuccessfulAt, setLastSuccessfulAt] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const isFetchingRef = useRef(false)
  const abortControllerRef = useRef(null)
  const lastValidReadingRef = useRef(null)
  const isMountedRef = useRef(true)

  const fetchState = useCallback(async () => {
    // Prevent overlapping requests if a previous request is still pending
    if (isFetchingRef.current) {
      return
    }

    isFetchingRef.current = true

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch('/api/network/current', {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Error'})`)
      }

      const json = await response.json()

      if (!isMountedRef.current) return

      // Validate contract shape
      if (!json || typeof json !== 'object' || typeof json.status !== 'string') {
        throw new Error('Malformed JSON response from /api/network/current')
      }

      // Success
      setNetworkError(null)
      setIsRetainingPrevious(false)
      setLastSuccessfulAt(new Date())
      setData(json)

      // Retain valid READY state for fallback during network interruptions
      if (json.status === 'READY' && json.rateResult) {
        lastValidReadingRef.current = json
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }

      if (!isMountedRef.current) return

      setNetworkError(err.message || 'Failed to connect to backend')

      if (lastValidReadingRef.current) {
        setIsRetainingPrevious(true)
        setData(lastValidReadingRef.current)
      } else {
        setData(null)
      }
    } finally {
      isFetchingRef.current = false
      if (isMountedRef.current) {
        setIsInitialLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    // Initial fetch on mount
    fetchState()

    // 1-second periodic refresh
    const timerId = setInterval(() => {
      fetchState()
    }, pollIntervalMs)

    return () => {
      isMountedRef.current = false
      clearInterval(timerId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchState, pollIntervalMs])

  return {
    data,
    networkError,
    isRetainingPrevious,
    lastSuccessfulAt,
    isInitialLoading,
    refetch: fetchState,
  }
}

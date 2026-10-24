import { useState, useEffect, useCallback } from 'react'

const PICSUM_API_URL = 'https://picsum.photos/v2/list?limit=30'

/**
 * Custom hook to fetch photos from the Picsum API.
 * 
 * Returns:
 * - photos: Array of photo objects
 * - loading: Boolean indicating whether fetch is pending
 * - error: String error message or null if no error
 * - refetch: Function to retry/reload photos
 * - retry: Alias to refetch
 */
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Stable refetch function to re-trigger the fetch logic without duplicating code
  const refetch = useCallback(() => {
    setRetryTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(PICSUM_API_URL, {
          signal: controller.signal,
        })

        // Check HTTP response status before parsing
        if (!response.ok) {
          throw new Error(
            `Failed to fetch photos from server (Status: ${response.status})`
          )
        }

        const data = await response.json()

        // Validate that received payload is indeed an array
        if (!Array.isArray(data)) {
          throw new Error('Received unexpected data format from photo service.')
        }

        setPhotos(data)
      } catch (err) {
        // Ignore AbortError when component unmounts or request is replaced
        if (err.name === 'AbortError') {
          return
        }
        setError(
          err.message || 'An unexpected error occurred while loading photos. Please try again.'
        )
      } finally {
        // Prevent state update after unmount
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    // Cleanup: abort ongoing fetch on unmount or retry
    return () => {
      controller.abort()
    }
  }, [retryTrigger])

  return {
    photos,
    loading,
    error,
    refetch,
    retry: refetch,
  }
}

import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import PhotoGrid from './components/PhotoGrid'
import Footer from './components/Footer'
import useFetchPhotos from './hooks/useFetchPhotos'
import favoritesReducer, { FAVORITES_ACTION_TYPES } from './reducers/favoritesReducer'

const FAVORITES_STORAGE_KEY = 'celebrare-photo-gallery-favorites'

/**
 * Lazy initializer for useReducer.
 * Safely restores favorite photo IDs from localStorage.
 * Handles storage unavailability, malformed JSON, and non-array structures.
 */
function initFavorites(initialState = []) {
  if (typeof window === 'undefined') {
    return initialState
  }

  try {
    const rawStored = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!rawStored) {
      return initialState
    }

    const parsed = JSON.parse(rawStored)

    // Ensure parsed payload is an array
    if (!Array.isArray(parsed)) {
      console.warn('Storage warning: favorites entry is not an array. Falling back to default.')
      return initialState
    }

    // Sanitize items: ensure strings, filter out null/empty, remove duplicates
    const uniqueIds = Array.from(
      new Set(
        parsed
          .filter((id) => id !== null && id !== undefined && String(id).trim() !== '')
          .map((id) => String(id))
      )
    )

    return uniqueIds
  } catch (err) {
    console.error('Failed to read favorites from localStorage:', err)
    return initialState
  }
}

export default function App() {
  // Phase 3: Real photo integration using useFetchPhotos custom hook
  const { photos, loading, error, refetch } = useFetchPhotos()

  // Phase 4: Favorites state managed via useReducer and persisted to localStorage
  const [favorites, dispatchFavorites] = useReducer(
    favoritesReducer,
    [],
    initFavorites
  )

  // Persist favorites to localStorage whenever the reducer state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      )
    } catch (err) {
      console.error('Failed to persist favorites to localStorage:', err)
    }
  }, [favorites])

  // Dispatch TOGGLE_FAVORITE action
  const handleToggleFavorite = (id) => {
    dispatchFavorites({
      type: FAVORITES_ACTION_TYPES.TOGGLE_FAVORITE,
      payload: id,
    })
  }

  // Phase 5: Controlled search term state
  const [searchTerm, setSearchTerm] = useState('')

  // Phase 5: Search input handler memoized with useCallback
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  // Phase 5: Filtered photos list computed and memoized with useMemo
  const displayedPhotos = useMemo(() => {
    const trimmedQuery = searchTerm.trim().toLowerCase()

    if (!trimmedQuery) {
      return photos
    }

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmedQuery)
    )
  }, [photos, searchTerm])

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-[#1E1B4B] flex flex-col selection:bg-[#EC4899]/20 selection:text-[#312E81]">
      {/* A. Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12">
        {/* B. Hero Section - Refined, compact, and elegant */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#312E81] via-[#7C3AED] to-[#EC4899] text-white py-5 sm:py-6 md:py-7 px-5 sm:px-8 rounded-xl sm:rounded-2xl shadow-md shadow-indigo-950/10 mb-5 sm:mb-6">
          {/* Subtle ambient decorative gradient glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FDBA9B]/20 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#8B5CF6]/25 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
            {/* Understated pill accent badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-medium text-white mb-2 shadow-xs">
              <svg
                className="w-3.5 h-3.5 text-[#FDBA9B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Curated Visual Showcase</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
              Discover Beautiful Moments
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-xs sm:text-sm text-purple-100 max-w-lg font-normal leading-relaxed">
              A little inspiration, one photograph at a time.
            </p>
          </div>
        </section>

        {/* C. Search Section */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* D. Gallery Introduction */}
        <div className="mb-3.5 sm:mb-4 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B4B] mb-0.5">
            Explore the Gallery
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Discover a collection of moments captured around the world.
          </p>
        </div>

        {/* E. Gallery Content States: Loading, Error, Empty, or Photo Grid */}
        {loading ? (
          /* Loading State: Polished spinner with accessible status */
          <div
            role="status"
            aria-live="polite"
            className="py-20 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs"
          >
            <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-[#7C3AED] animate-spin mb-4" />
            <h3 className="text-base font-semibold text-[#1E1B4B] mb-1">
              Loading photos...
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Fetching moments of inspiration from the gallery...
            </p>
          </div>
        ) : error ? (
          /* Error State: Friendly error card with Retry action */
          <div
            role="alert"
            className="py-12 px-6 max-w-md mx-auto text-center bg-white rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3 shadow-xs">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#1E1B4B] mb-1.5">
              Unable to Load Photos
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mb-5 leading-relaxed">
              {error}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:opacity-95 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Retry</span>
            </button>
          </div>
        ) : photos.length === 0 ? (
          /* Empty API Response State */
          <div className="py-14 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED] mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#1E1B4B] mb-1">
              No photos available
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              The gallery is currently empty. Please check back later.
            </p>
          </div>
        ) : displayedPhotos.length > 0 ? (
          /* Successful Photos Render */
          <PhotoGrid
            photos={displayedPhotos}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          /* Empty Search Filter State */
          <div className="py-12 text-center bg-white rounded-xl border border-slate-100 p-6 shadow-xs">
            <p className="text-sm text-[#64748B]">
              No photographers found matching &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}
      </main>

      {/* G. Footer */}
      <Footer />
    </div>
  )
}

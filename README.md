# Celebrare Photo Gallery

A responsive, high-performance React photo gallery web application built for the Celebrare frontend internship screening assignment. The application integrates live photography from the Picsum API, featuring real-time client-side search and persistent favorites powered by modern React hooks (`useReducer`, `useCallback`, `useMemo`) and the browser `localStorage` API.

---

## Overview

The Celebrare Photo Gallery delivers an elegant visual showcase of curated photographs. Designed with a custom color palette combining deep indigos, vivid violets, pinks, and warm peach accents, the application provides an engaging user experience with smooth hover transitions, immediate search filtering, and resilient offline persistence for user favorites.

---

## Features

- **Live Picsum API Integration**: Fetches 30 real photo records dynamically on initial load from the Picsum API.
- **Dedicated Loading State**: Features a clean, accessible animated spinner with status messaging during network requests.
- **Resilient Error Handling & Retry**: Displays a friendly error card upon network or server failures with a "Retry" button that re-triggers the fetch workflow without duplicating logic.
- **Persistent Favorites**: Users can favorite and unfavorite photographs using heart action buttons. State is managed via `useReducer` and persisted across browser sessions in `localStorage`.
- **Fast Client-Side Search**: Instant author search powered by `useCallback` and `useMemo` with automatic whitespace trimming and case-insensitive matching.
- **Zero Additional API Calls During Search**: Filtering happens in-memory without extra network requests or debouncing delays.
- **Empty State Feedback**: Clean, context-specific messaging for both empty API responses and empty search filter results.
- **Fully Responsive Layout**:
  - **Desktop**: Exactly 4 gallery columns
  - **Tablet**: Exactly 2 gallery columns
  - **Mobile**: Exactly 1 gallery column with fluid typography and tap targets
- **Zero Component Libraries**: Styled exclusively with custom utility classes using Tailwind CSS v4.

---

## Tech Stack

- **Core**: React 19 (Functional Components & Hooks)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Linting & Code Quality**: Oxlint
- **Browser APIs**: Fetch API, AbortController, LocalStorage API

---

## API Used

The application retrieves photos from the public Picsum Photos API:

```text
https://picsum.photos/v2/list?limit=30
```

- **Record Count**: Requests a list of 30 photos on mount.
- **Key Fields Utilized**:
  - `id`: Used as stable React `key` and favorite identifier.
  - `author`: Displayed as the photographer name and used for search matching.
  - `download_url`: Rendered as the direct photograph source (`<img src={photo.download_url} ... />`).

---

## Project Structure

```text
Photo Gallary/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Header.jsx          # Top brand navigation with custom camera icon
│   │   ├── PhotoCard.jsx       # Individual photo card with image, author, and heart button
│   │   ├── PhotoGrid.jsx       # Responsive 4/2/1-column grid layout
│   │   └── SearchBar.jsx       # Controlled search input field
│   ├── hooks/
│   │   └── useFetchPhotos.js   # Custom hook for Picsum API fetching, loading, error, and retry
│   ├── reducers/
│   │   └── favoritesReducer.js # Pure reducer managing favorite photo IDs
│   ├── App.jsx                 # Main application component assembling all features
│   ├── index.css               # Global Tailwind CSS imports and base typography
│   └── main.jsx                # Application root entry point
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (installed with Node.js)

### Installation

1. Clone or extract the repository:
   ```bash
   git clone https://github.com/Tusharjadhav2316-dev/Photo-Gallary.git
   cd Photo-Gallary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173/
   ```

---

## Available Scripts

The following scripts are defined in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with hot module replacement (HMR). |
| `npm run build` | Bundles and optimizes the application for production in the `dist/` directory. |
| `npm run lint` | Runs Oxlint to inspect code for static errors, unused variables, and best practices. |
| `npm run preview` | Locally previews the production build output from `dist/`. |

---

## Implementation Details

### 1. `useFetchPhotos` Custom Hook (`src/hooks/useFetchPhotos.js`)
- Encapsulates the entire network lifecycle: returns `{ photos, loading, error, refetch }`.
- Uses `AbortController` in the `useEffect` cleanup function to prevent memory leaks and state updates after component unmounting.
- Verifies `response.ok` and checks that the parsed response is an array before updating state.
- Stores user-friendly error messages when requests fail without exposing raw system stack traces.
- Exposes a stable `refetch` function (via a retry trigger counter) to allow re-fetching without duplicate logic.

### 2. `useReducer` & `favoritesReducer` (`src/reducers/favoritesReducer.js`)
- Replaces temporary `useState` with a predictable state machine for favorites.
- State shape: Array of photo ID strings (`['0', '1', '12']`).
- Dispatches a single, clean action: `TOGGLE_FAVORITE` with `{ payload: photoId }`.
- Pure function: Never mutates existing state array; uses non-mutating `.filter()` or array spreading (`[...]`) to return fresh array references.
- Safe default handling: returns current state for unknown actions or invalid payloads.

### 3. `localStorage` Persistence (`src/App.jsx`)
- **Lazy Initializer**: `useReducer(favoritesReducer, [], initFavorites)` invokes `initFavorites` synchronously during the first render only, preventing storage reads on subsequent renders.
- **Defensive Error Handling**:
  - Handles missing keys, malformed JSON, and non-array storage values by falling back to `[]`.
  - Cleans stored IDs by filtering out `null`, `undefined`, or empty strings and removing duplicates.
- **Safe Persistence**: A `useEffect` syncs the `favorites` array to key `celebrare-photo-gallery-favorites` whenever the reducer state changes, wrapped in a `try/catch` block to handle storage exceptions safely.
- **Persistent Associations**: Stored favorites are linked by photo IDs and are never removed when a user searches or filters the view.

### 4. `useCallback` Search Handler (`src/App.jsx`)
- Memoizes the input change handler:
  ```javascript
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])
  ```
- Dependency array is empty (`[]`) because React's `setSearchTerm` state setter has a stable identity across renders.
- Passed directly to `<SearchBar value={searchTerm} onChange={handleSearchChange} />`.

### 5. `useMemo` Filtered Photo Calculation (`src/App.jsx`)
- Memoizes the derived photo list computation:
  ```javascript
  const displayedPhotos = useMemo(() => {
    const trimmedQuery = searchTerm.trim().toLowerCase()

    if (!trimmedQuery) {
      return photos
    }

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmedQuery)
    )
  }, [photos, searchTerm])
  ```
- Recomputes only when `photos` or `searchTerm` changes (`[photos, searchTerm]`).
- Performs case-insensitive matching (`.toLowerCase()`) and trims whitespace (`.trim()`).
- Unrelated re-renders (such as toggling a favorite heart) bypass re-calculating the filtered array.

---

## Responsive Design

The gallery layout adapts across viewports using standard breakpoints:

- **Desktop (>= 1024px)**: 4 columns (`lg:grid-cols-4`) for viewing multiple photographs comfortably.
- **Tablet (640px to 1023px)**: 2 columns (`sm:grid-cols-2`) preserving card proportions and readable text.
- **Mobile (< 640px)**: 1 column (`grid-cols-1`) ensuring touch-friendly cards without horizontal scroll.

---

## Error Handling & Edge Cases

- **Network / HTTP Failure**: If the Picsum API is unreachable or returns a non-200 status, a friendly error card is rendered with an alert role, explanatory message, and a **Retry** button.
- **Empty API Response**: If the endpoint returns an empty list, the app displays a clear *"No photos available"* message without raising an error.
- **Empty Search Filter**: When photos exist but none match the search query, the UI displays *"No photographers found matching [query]"* while keeping the search bar interactive.
- **Malformed Storage**: If `localStorage` contains corrupted JSON or an unexpected data type, the app catches the exception and falls back to an empty favorites list without crashing.

---

## Quality & Build Verification

The application passes all quality checks:

- **Linter**: `npm run lint` runs Oxlint with 0 errors and 0 warnings across all files.
- **Production Build**: `npm run build` bundles without errors in ~1.5s using Vite.

---

## Assignment Context

This project was developed as part of the **Celebrare Frontend Internship Screening Assignment** to demonstrate proficiency in React, custom hooks, state management with `useReducer`, performance optimization with `useCallback` / `useMemo`, and responsive web styling.

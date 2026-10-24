/**
 * Action type constants for the favorites reducer
 */
export const FAVORITES_ACTION_TYPES = {
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
}

/**
 * Pure reducer function for managing favorite photo IDs.
 * State shape: Array of string IDs, e.g. ['0', '1', '12']
 * 
 * @param {string[]} state - Current array of favorite photo IDs
 * @param {{ type: string, payload: string|number }} action - Dispatched action
 * @returns {string[]} New state array
 */
export function favoritesReducer(state = [], action) {
  if (!action || !action.type) {
    return state
  }

  switch (action.type) {
    case FAVORITES_ACTION_TYPES.TOGGLE_FAVORITE: {
      if (action.payload === undefined || action.payload === null) {
        return state
      }

      const id = String(action.payload)

      // If ID already exists in favorites, remove it; otherwise, append it
      if (state.includes(id)) {
        return state.filter((favId) => favId !== id)
      }

      return [...state, id]
    }

    default:
      // Return existing state for any unknown actions
      return state
  }
}

export default favoritesReducer

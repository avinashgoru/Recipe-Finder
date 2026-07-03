/**
 * storage.js — Production-Grade LocalStorage Utility
 *
 * MENTOR NOTE: Abstraction layer for browser Web Storage API.
 * Handles private browsing exceptions, QuotaExceededError, corrupted data recovery,
 * and cross-tab synchronization.
 */

const BOOKMARKS_KEY = 'recipe_finder_bookmarks';

/**
 * Load bookmarks from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 *
 * @returns {Array} - Array of bookmarked meal objects
 */
export function loadBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load bookmarks from localStorage:', error);
    return [];
  }
}

/**
 * Save the bookmarks array to localStorage.
 * Replaces whatever was previously saved. Gracefully handles QuotaExceededError.
 *
 * @param {Array} bookmarks - Array of meal objects to persist
 * @returns {boolean} - True if saved successfully, false otherwise
 */
export function saveBookmarks(bookmarks) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('LocalStorage quota exceeded! Unable to save new bookmark.');
    } else {
      console.error('Failed to save bookmarks to localStorage:', error);
    }
    return false;
  }
}

/**
 * Check whether a specific meal is already bookmarked.
 *
 * @param {Array} bookmarks - Current bookmarks array
 * @param {string} mealId - The meal ID to check
 * @returns {boolean}
 */
export function isBookmarked(bookmarks, mealId) {
  return bookmarks.some((meal) => meal.idMeal === mealId);
}

/**
 * Subscribe to cross-tab storage changes so tabs stay synced.
 *
 * @param {Function} callback - Function receiving updated bookmark array
 * @returns {Function} - Unsubscribe cleanup handler
 */
export function subscribeToStorageChanges(callback) {
  function handleStorageEvent(event) {
    if (event.key === BOOKMARKS_KEY) {
      try {
        const newBookmarks = event.newValue ? JSON.parse(event.newValue) : [];
        callback(Array.isArray(newBookmarks) ? newBookmarks : []);
      } catch {
        callback([]);
      }
    }
  }

  window.addEventListener('storage', handleStorageEvent);
  return () => window.removeEventListener('storage', handleStorageEvent);
}

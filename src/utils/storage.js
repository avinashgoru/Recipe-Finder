/**
 * storage.js — LocalStorage Utility
 *
 * MENTOR NOTE: This is a "utility" — a set of pure helper functions
 * with no React dependency. They deal with localStorage, which is the
 * browser's built-in key-value store for persisting data.
 *
 * Why abstract this?
 * 1. localStorage can throw exceptions (e.g., in private browsing mode)
 * 2. We want consistent error handling in one place
 * 3. If we ever switch to sessionStorage or IndexedDB, we only change here
 *
 * IMPORTANT: localStorage only stores strings. We use JSON.stringify/parse
 * to convert objects ↔ strings.
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
    // If nothing was ever saved, raw is null — return empty array
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    // JSON.parse can fail if the stored data is corrupted
    console.error('Failed to load bookmarks from localStorage:', error);
    return [];
  }
}

/**
 * Save the bookmarks array to localStorage.
 * Replaces whatever was previously saved.
 *
 * @param {Array} bookmarks - Array of meal objects to persist
 */
export function saveBookmarks(bookmarks) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks to localStorage:', error);
  }
}

/**
 * Check whether a specific meal is already bookmarked.
 * Used to toggle the bookmark icon state on recipe cards.
 *
 * @param {Array} bookmarks - Current bookmarks array
 * @param {string} mealId - The meal ID to check
 * @returns {boolean}
 */
export function isBookmarked(bookmarks, mealId) {
  return bookmarks.some((meal) => meal.idMeal === mealId);
}

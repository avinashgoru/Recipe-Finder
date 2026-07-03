/**
 * mealApi.js — Production-Grade API Service Layer
 *
 * MENTOR NOTE: This service layer isolates all HTTP communication with TheMealDB API.
 * Components and hooks never call fetch() directly.
 *
 * Enhancements added:
 * 1. AbortSignal support: Allows hooks to cancel in-flight requests when users type rapidly
 *    or navigate away, preventing memory leaks and race conditions.
 * 2. Timeout handling: Automatically aborts hanging network requests after a timeout threshold.
 * 3. Robust error reporting: Distinct handling for network interruptions vs HTTP error codes.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const DEFAULT_TIMEOUT_MS = 10000; // 10 seconds

/**
 * A robust fetch helper supporting timeouts and cancellation.
 *
 * @param {string} endpoint - The URL to fetch
 * @param {Object} [options={}] - Custom fetch options including AbortSignal
 * @returns {Promise<any>} - The parsed JSON data
 */
async function fetchFromApi(endpoint, options = {}) {
  const { signal: externalSignal, timeout = DEFAULT_TIMEOUT_MS, ...restOptions } = options;

  // Create an internal controller to handle timeout cancellation
  const timeoutController = new AbortController();
  const id = setTimeout(() => timeoutController.abort(new Error('TIMEOUT')), timeout);

  // If an external signal is passed, link it to abort our internal controller
  function handleExternalAbort() {
    timeoutController.abort(externalSignal?.reason || new Error('ABORTED'));
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(id);
      throw new Error('ABORTED');
    }
    externalSignal.addEventListener('abort', handleExternalAbort);
  }

  try {
    const response = await fetch(endpoint, {
      ...restOptions,
      signal: timeoutController.signal,
    });

    clearTimeout(id);
    if (externalSignal) externalSignal.removeEventListener('abort', handleExternalAbort);

    if (!response.ok) {
      throw new Error(`API request failed with HTTP status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(id);
    if (externalSignal) externalSignal.removeEventListener('abort', handleExternalAbort);

    // If aborted by user action or route change, re-throw cleanly
    if (error.name === 'AbortError' || error.message === 'ABORTED') {
      const abortErr = new Error('Request aborted');
      abortErr.name = 'AbortError';
      throw abortErr;
    }
    if (error.message === 'TIMEOUT') {
      throw new Error('Network request timed out. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Search recipes by keyword.
 *
 * @param {string} query - Search keyword
 * @param {Object} [options={}] - Fetch options (e.g. { signal })
 * @returns {Promise<Array>} - Array of meal objects
 */
export async function searchRecipes(query, options = {}) {
  const data = await fetchFromApi(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`, options);
  return data.meals || [];
}

/**
 * Fetch all available categories.
 *
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Array>} - Array of category objects
 */
export async function fetchCategories(options = {}) {
  const data = await fetchFromApi(`${BASE_URL}/categories.php`, options);
  return data.categories || [];
}

/**
 * Filter recipes by a specific category.
 *
 * @param {string} category - Category name
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Array>} - Array of meal objects
 */
export async function filterByCategory(category, options = {}) {
  const data = await fetchFromApi(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`, options);
  return data.meals || [];
}

/**
 * Look up full details for a specific recipe by ID.
 *
 * @param {string|number} id - The meal ID
 * @param {Object} [options={}] - Fetch options
 * @returns {Promise<Object|null>} - Full meal object or null
 */
export async function lookupRecipeById(id, options = {}) {
  const data = await fetchFromApi(`${BASE_URL}/lookup.php?i=${id}`, options);
  return data.meals ? data.meals[0] : null;
}

/**
 * mealApi.js — API Service Layer
 *
 * MENTOR NOTE: This is the "service" layer. Its ONLY job is to talk to the
 * external API. Components and hooks should never call fetch() directly.
 * Why? Because if the API URL changes, you only fix it in ONE place (here).
 * This pattern is called "Separation of Concerns."
 *
 * All functions are async — they return Promises.
 * We use async/await instead of .then() chains for cleaner, readable code.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * A shared fetch helper. Every API call goes through this.
 * If the network request fails, this throws an error.
 * The caller (hook) will catch it and show an error message.
 *
 * @param {string} endpoint - The URL to fetch
 * @returns {Promise<any>} - The parsed JSON data
 */
async function fetchFromApi(endpoint) {
  const response = await fetch(endpoint);

  // fetch() does NOT throw on 4xx/5xx status codes — we must check manually
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Search recipes by a keyword (e.g., "chicken", "pasta").
 * Returns an empty array if nothing is found, never null.
 *
 * @param {string} query - Search keyword
 * @returns {Promise<Array>} - Array of meal objects
 */
export async function searchRecipes(query) {
  const data = await fetchFromApi(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  // The API returns { meals: null } when nothing is found
  return data.meals || [];
}

/**
 * Fetch all available categories.
 * Used to populate the category filter buttons/dropdown.
 *
 * @returns {Promise<Array>} - Array of category objects
 */
export async function fetchCategories() {
  const data = await fetchFromApi(`${BASE_URL}/categories.php`);
  return data.categories || [];
}

/**
 * Filter recipes by a specific category (e.g., "Seafood", "Dessert").
 * NOTE: This endpoint returns limited data (no Area). We enrich cards
 * with what we have. Full details need the lookup endpoint.
 *
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of meal objects
 */
export async function filterByCategory(category) {
  const data = await fetchFromApi(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals || [];
}

/**
 * Look up full details for a specific recipe by its ID.
 * Used when we need complete meal data (area, instructions, etc.)
 *
 * @param {string|number} id - The meal ID
 * @returns {Promise<Object|null>} - Full meal object or null
 */
export async function lookupRecipeById(id) {
  const data = await fetchFromApi(`${BASE_URL}/lookup.php?i=${id}`);
  return data.meals ? data.meals[0] : null;
}

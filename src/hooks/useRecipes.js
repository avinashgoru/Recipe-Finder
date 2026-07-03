/**
 * useRecipes.js — Custom Hook for Recipe Fetching & Filtering
 *
 * MENTOR NOTE: This is the most complex hook in the app. It manages:
 * - Fetching recipes by search query
 * - Fetching and storing categories
 * - Filtering by category
 * - Combining search + category filters
 * - Loading states (show spinner while waiting)
 * - Error states (show error message on failure)
 *
 * KEY CONCEPT — Derived State:
 * We keep ONE source of truth (`allRecipes`) and DERIVE the filtered
 * display list from it. We never duplicate data. This prevents bugs
 * where your UI shows stale/inconsistent information.
 *
 * STATE DIAGRAM:
 * User types query → fetch from API → store in allRecipes
 *                                   ↓
 * User picks category → filter allRecipes → displayRecipes
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  searchRecipes,
  fetchCategories,
  filterByCategory,
  lookupRecipeById,
} from '../services/mealApi';

function useRecipes() {
  // --- State Variables ---

  // The raw recipes returned from the last search or category filter
  const [allRecipes, setAllRecipes] = useState([]);

  // All categories fetched from the API (for the filter UI)
  const [categories, setCategories] = useState([]);

  // The currently active search text
  const [searchQuery, setSearchQuery] = useState('');

  // The currently selected category name ('' = all categories)
  const [selectedCategory, setSelectedCategory] = useState('');

  // True while any network request is in-flight
  const [isLoading, setIsLoading] = useState(false);

  // Holds an error message string if the API fails
  const [error, setError] = useState(null);

  /**
   * Load categories when the hook mounts (component renders for first time).
   * We only do this ONCE, hence the empty dependency array [].
   *
   * BEGINNER MISTAKE: Forgetting the dependency array causes infinite loops!
   * useEffect without [] runs after EVERY render.
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        // Non-critical error — don't block the UI, just log it
      }
    }

    loadCategories();
  }, []); // Empty array = run once on mount

  /**
   * fetchRecipes — The main search handler.
   * useCallback ensures this function reference stays stable,
   * preventing unnecessary re-renders in child components.
   *
   * @param {string} query - The search keyword
   */
  const fetchRecipes = useCallback(async (query = '') => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setSelectedCategory(''); // Reset category when searching
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const meals = await searchRecipes(query);
      setAllRecipes(meals);
    } catch {
      setError('Something went wrong while searching. Please try again.');
      setAllRecipes([]);
    } finally {
      // finally ALWAYS runs — great for cleanup like hiding spinner
      setIsLoading(false);
    }
  }, []);

  /**
   * handleCategorySelect — Filter by category.
   * When a category is selected without an active search,
   * we fetch from the category filter endpoint.
   * When a search IS active, we filter the existing results.
   *
   * @param {string} category - Category name or '' for all
   */
  const handleCategorySelect = useCallback(
    async (category) => {
      setSelectedCategory(category);

      // If "All Categories" selected, restore the search results
      if (!category) {
        if (searchQuery) {
          // Re-run the current search to restore full results
          setIsLoading(true);
          setError(null);
          try {
            const meals = await searchRecipes(searchQuery);
            setAllRecipes(meals);
          } catch {
            setError('Failed to reload recipes.');
          } finally {
            setIsLoading(false);
          }
        } else {
          // No active search, fetch default recipes
          setIsLoading(true);
          setError(null);
          try {
            const meals = await searchRecipes('');
            setAllRecipes(meals);
          } catch {
            setError('Failed to reload recipes.');
          } finally {
            setIsLoading(false);
          }
        }
        return;
      }

      // If we have active search results, filter them client-side
      // This avoids an extra API call
      if (searchQuery && allRecipes.length > 0) {
        // Client-side filter — already have the data
        return; // displayRecipes (derived below) will handle this
      }

      // No active search — fetch from the category endpoint
      setIsLoading(true);
      setError(null);
      try {
        const meals = await filterByCategory(category);
        // The category endpoint returns minimal data (no strArea).
        // For each meal, we fetch full details to get area info.
        // We limit to 20 to avoid hammering the API.
        const detailed = await Promise.all(
          meals.slice(0, 20).map((meal) => lookupRecipeById(meal.idMeal))
        );
        setAllRecipes(detailed.filter(Boolean));
      } catch {
        setError('Failed to load recipes for this category.');
        setAllRecipes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, allRecipes]
  );

  /**
   * displayRecipes — Derived state (computed value).
   * useMemo recalculates this ONLY when allRecipes or selectedCategory changes.
   * Without useMemo, this filtering would run on every single render.
   *
   * MENTOR NOTE: This is the "single source of truth" pattern.
   * We don't store filtered results separately — we compute them on-the-fly.
   */
  const displayRecipes = useMemo(() => {
    if (!selectedCategory || !searchQuery) return allRecipes;
    // When both search and category are active, filter locally
    return allRecipes.filter(
      (meal) =>
        meal.strCategory &&
        meal.strCategory.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allRecipes, selectedCategory, searchQuery]);

  /**
   * clearSearch — Reset everything back to initial state.
   */
  const clearSearch = useCallback(() => {
    setAllRecipes([]);
    setSearchQuery('');
    setSelectedCategory('');
    setError(null);
  }, []);

  return {
    recipes: displayRecipes,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    error,
    fetchRecipes,
    handleCategorySelect,
    clearSearch,
  };
}

export default useRecipes;

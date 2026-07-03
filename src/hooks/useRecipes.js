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

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  searchRecipes,
  fetchCategories,
  filterByCategory,
  lookupRecipeById,
} from '../services/mealApi';

function useRecipes() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference to cancel any in-flight requests when a new search/filter is initiated
  const abortControllerRef = useRef(null);

  // Helper to reset and get a fresh abort signal
  const getFreshSignal = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller.signal;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCategories() {
      try {
        const data = await fetchCategories({ signal: controller.signal });
        setCategories(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load categories:', err);
        }
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  const fetchRecipes = useCallback(async (query = '') => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setSelectedCategory('');
    setIsLoading(true);
    setError(null);

    const signal = getFreshSignal();

    try {
      const meals = await searchRecipes(trimmedQuery, { signal });
      setAllRecipes(meals);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Something went wrong while searching. Please try again.');
        setAllRecipes([]);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [getFreshSignal]);

  const handleCategorySelect = useCallback(
    async (category) => {
      setSelectedCategory(category);

      if (!category) {
        const signal = getFreshSignal();
        setIsLoading(true);
        setError(null);
        try {
          const meals = await searchRecipes(searchQuery || '', { signal });
          setAllRecipes(meals);
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError('Failed to reload recipes.');
          }
        } finally {
          if (!signal.aborted) setIsLoading(false);
        }
        return;
      }

      if (searchQuery && allRecipes.length > 0) {
        return;
      }

      const signal = getFreshSignal();
      setIsLoading(true);
      setError(null);
      try {
        const meals = await filterByCategory(category, { signal });
        const detailed = await Promise.all(
          meals.slice(0, 20).map((meal) => lookupRecipeById(meal.idMeal, { signal }))
        );
        setAllRecipes(detailed.filter(Boolean));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load recipes for this category.');
          setAllRecipes([]);
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    },
    [searchQuery, allRecipes, getFreshSignal]
  );

  const displayRecipes = useMemo(() => {
    if (!selectedCategory || !searchQuery) return allRecipes;
    return allRecipes.filter(
      (meal) =>
        meal.strCategory &&
        meal.strCategory.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allRecipes, selectedCategory, searchQuery]);

  const clearSearch = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setAllRecipes([]);
    setSearchQuery('');
    setSelectedCategory('');
    setError(null);
    setIsLoading(false);
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

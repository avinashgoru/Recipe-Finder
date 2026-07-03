import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { loadBookmarks, saveBookmarks, isBookmarked, subscribeToStorageChanges } from '../utils/storage';

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks());
  const isInitialMount = useRef(true);

  // Sync bookmarks to localStorage whenever state changes (skipping initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Subscribe to storage changes across other browser tabs
  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges((syncedBookmarks) => {
      setBookmarks(syncedBookmarks);
    });
    return () => unsubscribe();
  }, []);

  const addBookmark = useCallback((meal) => {
    setBookmarks((prev) => {
      if (prev.some((m) => m.idMeal === meal.idMeal)) return prev;
      return [...prev, meal];
    });
    // Trigger toast outside state setter for deterministic React 19 compatibility
    toast.success(`${meal.strMeal} saved!`, { icon: '🔖' });
  }, []);

  const removeBookmark = useCallback((mealId, mealName = 'Recipe') => {
    setBookmarks((prev) => prev.filter((meal) => meal.idMeal !== mealId));
    toast(`${mealName} removed`, { icon: '🗑️' });
  }, []);

  const toggleBookmark = useCallback(
    (meal) => {
      if (isBookmarked(bookmarks, meal.idMeal)) {
        removeBookmark(meal.idMeal, meal.strMeal);
      } else {
        addBookmark(meal);
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  const checkIsBookmarked = useCallback(
    (mealId) => isBookmarked(bookmarks, mealId),
    [bookmarks]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    checkIsBookmarked,
  };
}

export default useBookmarks;

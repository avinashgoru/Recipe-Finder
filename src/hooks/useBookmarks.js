import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loadBookmarks, saveBookmarks, isBookmarked } from '../utils/storage';

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks());

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const addBookmark = useCallback((meal) => {
    setBookmarks((prev) => {
      if (prev.some((m) => m.idMeal === meal.idMeal)) return prev;
      
      toast.success(`${meal.strMeal} saved!`, { icon: '🔖' });
      return [...prev, meal];
    });
  }, []);

  const removeBookmark = useCallback((mealId) => {
    setBookmarks((prev) => {
      const mealToRemove = prev.find((m) => m.idMeal === mealId);
      if (mealToRemove) {
        toast(`${mealToRemove.strMeal} removed`, { icon: '🗑️' });
      }
      return prev.filter((meal) => meal.idMeal !== mealId);
    });
  }, []);

  const toggleBookmark = useCallback(
    (meal) => {
      if (isBookmarked(bookmarks, meal.idMeal)) {
        removeBookmark(meal.idMeal);
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

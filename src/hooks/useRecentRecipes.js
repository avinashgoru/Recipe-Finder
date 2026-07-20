import { useState, useEffect } from 'react';

const RECENT_RECIPES_KEY = 'recipe_finder_recent_recipes';
const MAX_RECENT = 10;

export default function useRecentRecipes() {
  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_RECIPES_KEY);
      if (stored) {
        setRecentRecipes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent recipes', e);
    }
  }, []);

  function addRecentRecipe(recipe) {
    if (!recipe || !recipe.idMeal) return;
    
    setRecentRecipes((prev) => {
      // Remove if it already exists to prevent duplicates
      const filtered = prev.filter((r) => r.idMeal !== recipe.idMeal);
      // Add to beginning and limit to MAX_RECENT
      const updated = [recipe, ...filtered].slice(0, MAX_RECENT);
      
      try {
        localStorage.setItem(RECENT_RECIPES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent recipe', e);
      }
      
      return updated;
    });
  }

  return { recentRecipes, addRecentRecipe };
}

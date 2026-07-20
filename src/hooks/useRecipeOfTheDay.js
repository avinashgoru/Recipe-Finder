import { useState, useEffect } from 'react';
import { fetchRandomRecipe } from '../services/mealApi';

const RECIPE_OF_THE_DAY_KEY = 'recipe_finder_featured_recipe';

export default function useRecipeOfTheDay() {
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRecipeOfTheDay() {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(RECIPE_OF_THE_DAY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = new Date();
          const storedDate = new Date(parsed.date);
          
          // Check if it's the same day (ignore time)
          if (
            now.getFullYear() === storedDate.getFullYear() &&
            now.getMonth() === storedDate.getMonth() &&
            now.getDate() === storedDate.getDate()
          ) {
            setRecipeOfTheDay(parsed.recipe);
            setIsLoading(false);
            return; // We have a valid recipe for today
          }
        }
        
        // If we get here, we need a new recipe
        const newRecipe = await fetchRandomRecipe();
        if (newRecipe) {
          setRecipeOfTheDay(newRecipe);
          localStorage.setItem(RECIPE_OF_THE_DAY_KEY, JSON.stringify({
            date: new Date().toISOString(),
            recipe: newRecipe
          }));
        }
      } catch (e) {
        console.error('Failed to load recipe of the day', e);
      } finally {
        setIsLoading(false);
      }
    }

    getRecipeOfTheDay();
  }, []);

  return { recipeOfTheDay, isLoading };
}

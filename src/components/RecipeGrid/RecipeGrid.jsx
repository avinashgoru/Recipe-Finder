import { motion } from 'framer-motion';
import RecipeCard from '../RecipeCard/RecipeCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import EmptyState from '../EmptyState/EmptyState';
import './RecipeGrid.css';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

function RecipeGrid({
  recipes,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  onBookmarkToggle,
  checkIsBookmarked,
}) {
  
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Initial empty state
  if (!searchQuery && !selectedCategory && recipes.length === 0 && !isLoading) {
    return (
      <EmptyState
        emoji="🍴"
        title="What are you hungry for?"
        message="Search for any recipe above or pick a category to explore dishes from around the world."
      />
    );
  }

  // Not found state
  if (recipes.length === 0 && !isLoading) {
    return (
      <EmptyState
        emoji="🔎"
        title="No recipes found"
        message={
          searchQuery
            ? `We couldn't find any recipes for "${searchQuery}". Try a different keyword.`
            : `No recipes available in this category right now.`
        }
      />
    );
  }

  return (
    <section aria-label="Recipe results">
      {!isLoading && (
        <p className="recipe-grid__count" role="status" aria-live="polite">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
        </p>
      )}

      {isLoading ? (
        <div className="recipe-grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div 
          className="recipe-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {recipes.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              meal={meal}
              isBookmarked={checkIsBookmarked(meal.idMeal)}
              onBookmarkToggle={onBookmarkToggle}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default RecipeGrid;

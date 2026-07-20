import { motion } from 'framer-motion';
import useRecipes from '../hooks/useRecipes';
import SearchBar from '../components/SearchBar/SearchBar';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import RecipeGrid from '../components/RecipeGrid/RecipeGrid';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import PremiumImage from '../components/PremiumImage/PremiumImage';
import { Sparkles, Clock, Utensils } from 'lucide-react';
import useRecentRecipes from '../hooks/useRecentRecipes';
import useRecipeOfTheDay from '../hooks/useRecipeOfTheDay';
import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const floatAnimation = (delay = 0, duration = 4) => ({
  y: [0, -12, 0],
  rotate: [0, 2, -2, 0],
  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: "easeInOut"
  }
});

function Home({ bookmarkHook }) {
  const {
    recipes,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    error,
    fetchRecipes,
    handleCategorySelect,
  } = useRecipes();

  const { recentRecipes } = useRecentRecipes();
  const { recipeOfTheDay, isLoading: isFeaturedLoading } = useRecipeOfTheDay();

  useSEO({
    title: 'Explore',
    description: 'Find and save your favorite recipes from around the world.'
  });

  return (
    <main className="home-page">
      {/* --- Hero Search Section --- */}
      <section className="home-page__hero">
        <div className="container home-page__hero-container">
          {/* Decorative Floating Food Illustrations (Desktop Only) */}
          <motion.div 
            className="home-page__floating-badge home-page__floating-badge--top-left"
            animate={floatAnimation(0, 4.5)}
            aria-hidden="true"
          >
            <span className="home-page__floating-emoji">🍕</span>
            <span className="home-page__floating-text">Artisan Pizza</span>
          </motion.div>

          <motion.div 
            className="home-page__floating-badge home-page__floating-badge--top-right"
            animate={floatAnimation(1, 5)}
            aria-hidden="true"
          >
            <span className="home-page__floating-emoji">🥗</span>
            <span className="home-page__floating-text">Fresh Salads</span>
          </motion.div>

          <motion.div 
            className="home-page__floating-badge home-page__floating-badge--bottom-left"
            animate={floatAnimation(0.5, 4.2)}
            aria-hidden="true"
          >
            <span className="home-page__floating-emoji">🍝</span>
            <span className="home-page__floating-text">Homemade Pasta</span>
          </motion.div>

          <motion.div 
            className="home-page__floating-badge home-page__floating-badge--bottom-right"
            animate={floatAnimation(1.5, 4.8)}
            aria-hidden="true"
          >
            <span className="home-page__floating-emoji">🥑</span>
            <span className="home-page__floating-text">Healthy Bowls</span>
          </motion.div>

          <motion.div 
            className="home-page__hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h2 className="home-page__hero-title">
              Discover Your Next
              <span className="home-page__hero-highlight"> Favorite Meal</span>
            </h2>
            <p className="home-page__hero-subtitle">
              Search from thousands of recipes, explore diverse cuisines, and master new dishes with step-by-step guidance.
            </p>

            <div className="home-page__search-container">
              <SearchBar onSearch={fetchRecipes} initialValue={searchQuery} isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Animated Scroll Indicator */}
          <motion.a
            href="#explore"
            className="home-page__scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            aria-label="Scroll to explore recipes"
          >
            <span className="home-page__scroll-text">Explore Recipes</span>
            <div className="home-page__scroll-icon">
              <div className="home-page__scroll-dot" />
            </div>
          </motion.a>
        </div>
      </section>

      {/* --- Main Content Section --- */}
      <section id="explore" className="home-page__content">
        <div className="container">
          
          {/* Recipe of the Day Section */}
          {recipeOfTheDay && !isFeaturedLoading && !searchQuery && !selectedCategory && (
            <div className="home-page__featured">
              <div className="home-page__featured-header">
                <h3 className="home-page__section-title">
                  <Sparkles className="text-primary" size={24} /> Recipe of the Day
                </h3>
              </div>
              <div className="home-page__featured-card">
                <div className="home-page__featured-image-wrapper">
                  <PremiumImage src={recipeOfTheDay.strMealThumb} alt={recipeOfTheDay.strMeal} />
                </div>
                <div className="home-page__featured-content">
                  <span className="home-page__featured-tag">{recipeOfTheDay.strCategory}</span>
                  <h4 className="home-page__featured-title">{recipeOfTheDay.strMeal}</h4>
                  <p className="home-page__featured-desc">
                    Discover this handpicked culinary delight. Perfect for your next meal!
                  </p>
                  <Link to={`/recipe/${recipeOfTheDay.idMeal}`} className="home-page__featured-btn">
                    <Utensils size={18} /> View Recipe
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recently Viewed Section */}
          {recentRecipes.length > 0 && !searchQuery && !selectedCategory && (
            <div className="home-page__recent">
              <div className="home-page__recent-header">
                <h3 className="home-page__section-title">
                  <Clock className="text-primary" size={24} /> Recently Viewed
                </h3>
              </div>
              <div className="home-page__recent-grid">
                {recentRecipes.slice(0, 4).map(meal => (
                  <RecipeCard
                    key={`recent-${meal.idMeal}`}
                    meal={meal}
                    onBookmarkToggle={bookmarkHook.toggleBookmark}
                    isBookmarked={bookmarkHook.checkIsBookmarked(meal.idMeal)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="home-page__explore-header">
            <h3 className="home-page__section-title">Explore All Recipes</h3>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <RecipeGrid
            recipes={recipes}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onBookmarkToggle={bookmarkHook.toggleBookmark}
            checkIsBookmarked={bookmarkHook.checkIsBookmarked}
          />
        </div>
      </section>
    </main>
  );
}

export default Home;

import { motion } from 'framer-motion';
import useRecipes from '../hooks/useRecipes';
import SearchBar from '../components/SearchBar/SearchBar';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import RecipeGrid from '../components/RecipeGrid/RecipeGrid';
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

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
        <div className="container">
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
              Search from thousands of recipes, explore diverse cuisines, and master new dishes.
            </p>

            <div className="home-page__search-container">
              <SearchBar onSearch={fetchRecipes} initialValue={searchQuery} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Main Content Section --- */}
      <section className="home-page__content">
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

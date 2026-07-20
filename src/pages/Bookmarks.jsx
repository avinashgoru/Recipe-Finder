import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft, Search } from 'lucide-react';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import EmptyState from '../components/EmptyState/EmptyState';
import useSEO from '../hooks/useSEO';
import './Bookmarks.css';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

function Bookmarks({ bookmarkHook }) {
  useSEO({
    title: 'My Bookmarks',
    description: 'View all your saved and favorite recipes.'
  });

  const { bookmarks, toggleBookmark, checkIsBookmarked } = bookmarkHook;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredAndSortedBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(meal => 
        meal.strMeal.toLowerCase().includes(q) || 
        meal.strCategory.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOrder === 'a-z') {
      result.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sortOrder === 'z-a') {
      result.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    }
    // 'newest' is the default order they are in the array (assuming added to start/end consistently)
    // In our `useBookmarks` we add to the start, so it's already 'newest' first.

    return result;
  }, [bookmarks, searchQuery, sortOrder]);

  return (
    <motion.main 
      className="bookmarks-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container">
        {/* --- Page Header --- */}
        <div className="bookmarks-page__header">
          <div className="bookmarks-page__title-group">
            <h2 className="bookmarks-page__title">
              <Bookmark className="bookmarks-page__title-icon" size={32} />
              My Collection
            </h2>
            <p className="bookmarks-page__subtitle">
              {bookmarks.length > 0
                ? `You have ${bookmarks.length} saved recipe${bookmarks.length !== 1 ? 's' : ''} in your collection.`
                : 'Your personal cookbook is waiting to be filled.'}
            </p>
          </div>

          {/* Back link — only shows when there are bookmarks */}
          {bookmarks.length > 0 && (
            <Link to="/" className="bookmarks-page__back-link">
              <ArrowLeft size={16} /> Discover More
            </Link>
          )}
        </div>

        {/* --- Content --- */}
        {bookmarks.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <EmptyState
              emoji="📭"
              title="No recipes saved yet"
              message="You haven't saved any recipes. Go search for something delicious and tap the heart icon on any recipe card to save it here!"
            >
              <Link to="/" className="bookmarks-page__discover-btn">
                Start Discovering
              </Link>
            </EmptyState>
          </motion.div>
        ) : (
          <div className="bookmarks-page__content-wrapper">
            <div className="bookmarks-page__controls">
              <div className="bookmarks-page__search-wrapper">
                <Search size={18} className="bookmarks-page__search-icon" />
                <input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bookmarks-page__search-input"
                  aria-label="Search bookmarks"
                />
              </div>
              
              <div className="bookmarks-page__sort-wrapper">
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bookmarks-page__sort-select"
                  aria-label="Sort bookmarks"
                >
                  <option value="newest">Recently Added</option>
                  <option value="a-z">Name (A-Z)</option>
                  <option value="z-a">Name (Z-A)</option>
                </select>
              </div>
            </div>

            {filteredAndSortedBookmarks.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <EmptyState
                  emoji="🔍"
                  title="No matches found"
                  message={`We couldn't find any bookmarks matching "${searchQuery}".`}
                />
              </motion.div>
            ) : (
              <section aria-label="Bookmarked recipes">
                <motion.div 
                  className="bookmarks-page__grid"
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredAndSortedBookmarks.map((meal) => (
                    <RecipeCard
                      key={meal.idMeal}
                      meal={meal}
                      isBookmarked={checkIsBookmarked(meal.idMeal)}
                      onBookmarkToggle={toggleBookmark}
                    />
                  ))}
                </motion.div>
              </section>
            )}
          </div>
        )}
      </div>
    </motion.main>
  );
}

export default Bookmarks;

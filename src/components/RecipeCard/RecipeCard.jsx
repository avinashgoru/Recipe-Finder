import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumImage from '../PremiumImage/PremiumImage';
import './RecipeCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function RecipeCard({ meal, isBookmarked, onBookmarkToggle }) {
  function handleBookmarkClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle(meal);
  }

  const displayName =
    meal.strMeal?.length > 45
      ? meal.strMeal.substring(0, 42) + '...'
      : meal.strMeal;

  return (
    <motion.article
      variants={cardVariants}
      className="recipe-card"
      aria-label={`Recipe: ${meal.strMeal}`}
    >
      <button
        type="button"
        className={`recipe-card__bookmark-btn ${isBookmarked ? 'recipe-card__bookmark-btn--active' : ''}`}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? `Remove ${meal.strMeal} from bookmarks` : `Save ${meal.strMeal} to bookmarks`}
        aria-pressed={isBookmarked}
      >
        <Heart
          size={20}
          className={isBookmarked ? 'recipe-card__heart-icon--filled' : 'recipe-card__heart-icon'}
          fill={isBookmarked ? 'currentColor' : 'none'}
        />
      </button>

      <Link to={`/recipe/${meal.idMeal}`} className="recipe-card__link">
        {/* --- Image Section --- */}
        <div className="recipe-card__image-wrapper">
          <PremiumImage
            src={meal.strMealThumb}
            alt={meal.strMeal}
            loading="lazy"
          />
        </div>

        {/* --- Content Section --- */}
        <div className="recipe-card__content">
          <div className="recipe-card__tags">
            {meal.strCategory && (
              <span className="recipe-card__tag">{meal.strCategory}</span>
            )}
            {meal.strArea && (
              <span className="recipe-card__tag recipe-card__tag--area">
                {meal.strArea}
              </span>
            )}
          </div>

          <h3 className="recipe-card__title" title={meal.strMeal}>
            {displayName}
          </h3>

          <div className="recipe-card__footer">
            <span className="recipe-card__view-btn">
              View Recipe <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default RecipeCard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, Video, List, ChefHat } from 'lucide-react';
import { lookupRecipeById } from '../services/mealApi';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './RecipeDetails.css';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

function RecipeDetails({ bookmarkHook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  function toggleIngredient(index) {
    setCheckedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  useEffect(() => {
    async function loadRecipe() {
      setIsLoading(true);
      try {
        const data = await lookupRecipeById(id);
        if (data) {
          setRecipe(data);
        } else {
          setError("Recipe not found.");
        }
      } catch {
        setError("Failed to load recipe details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  if (isLoading) return <div className="page-wrapper"><Loading /></div>;
  if (error || !recipe) return <div className="page-wrapper"><ErrorMessage message={error || 'Not found'} /></div>;

  const isBookmarked = bookmarkHook.checkIsBookmarked(recipe.idMeal);

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`] && recipe[`strIngredient${i}`].trim() !== "") {
      ingredients.push({
        ingredient: recipe[`strIngredient${i}`],
        measure: recipe[`strMeasure${i}`]
      });
    }
  }

  // Format instructions into steps
  const instructions = recipe.strInstructions
    .split(/\r\n|\n|\r/)
    .filter(step => step.trim().length > 3);

  // Extract YouTube ID safely
  let youtubeId = null;
  if (recipe.strYoutube) {
    // cspell:disable-next-line
    const match = recipe.strYoutube.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!'); // Simple toast for now
  }

  return (
    <motion.main 
      className="recipe-details"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Hero Section */}
      <div className="recipe-details__hero">
        <div className="recipe-details__hero-bg">
          <img src={recipe.strMealThumb} alt="" aria-hidden="true" />
        </div>
        
        <div className="container recipe-details__hero-content">
          <button className="recipe-details__back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} /> Back
          </button>

          <div className="recipe-details__header">
            <h1 className="recipe-details__title">{recipe.strMeal}</h1>
            <div className="recipe-details__meta">
              <span className="recipe-details__tag">{recipe.strCategory}</span>
              <span className="recipe-details__tag recipe-details__tag--area">{recipe.strArea}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container recipe-details__main">
        <div className="recipe-details__sidebar">
          {/* Action Card */}
          <div className="recipe-details__action-card">
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-details__thumbnail" />
            <div className="recipe-details__actions">
              <motion.button 
                className={`recipe-details__btn recipe-details__btn--bookmark ${isBookmarked ? 'active' : ''}`}
                onClick={() => bookmarkHook.toggleBookmark(recipe)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ scale: isBookmarked ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-flex' }}
                >
                  <Heart size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                </motion.div>
                {isBookmarked ? 'Saved' : 'Save Recipe'}
              </motion.button>
              <button className="recipe-details__btn recipe-details__btn--share" onClick={handleShare}>
                <Share2 size={20} /> Share
              </button>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="recipe-details__section">
            <h3 className="recipe-details__section-title">
              <List size={22} className="text-primary" /> Ingredients
            </h3>
            <ul className="recipe-details__ingredients">
              {ingredients.map((item, index) => {
                const isChecked = checkedIngredients.includes(index);
                return (
                  <li 
                    key={index} 
                    className={`recipe-details__ingredient-item ${isChecked ? 'recipe-details__ingredient-item--checked' : ''}`}
                    onClick={() => toggleIngredient(index)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleIngredient(index);
                      }
                    }}
                  >
                    <div className="recipe-details__ingredient-left">
                      <div className="recipe-details__checkbox">
                        {isChecked && <div className="recipe-details__checkbox-inner" />}
                      </div>
                      <span className="recipe-details__ingredient-name">{item.ingredient}</span>
                    </div>
                    <span className="recipe-details__ingredient-measure">{item.measure}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="recipe-details__content">
          {/* Instructions */}
          <div className="recipe-details__section">
            <h3 className="recipe-details__section-title">
              <ChefHat size={22} className="text-primary" /> Instructions
            </h3>
            <div className="recipe-details__instructions">
              {instructions.map((step, index) => (
                <div key={index} className="recipe-details__step">
                  <div className="recipe-details__step-number">{index + 1}</div>
                  <p className="recipe-details__step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          {youtubeId && (
            <div className="recipe-details__section">
              <h3 className="recipe-details__section-title">
                <Video size={22} className="text-primary" /> Video Tutorial
              </h3>
              <div className="recipe-details__video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
}

export default RecipeDetails;

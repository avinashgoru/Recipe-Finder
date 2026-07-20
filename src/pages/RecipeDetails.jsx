import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, List, ChefHat, Globe, Utensils, BookOpen, Sparkles, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { lookupRecipeById, filterByCategory } from '../services/mealApi';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import PremiumImage from '../components/PremiumImage/PremiumImage';
import useRecentRecipes from '../hooks/useRecentRecipes';
import useSEO from '../hooks/useSEO';
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
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const { addRecentRecipe } = useRecentRecipes();

  // Handle SEO dynamically based on loaded recipe
  useSEO({
    title: recipe ? recipe.strMeal : 'Loading...',
    description: recipe ? `Learn how to make ${recipe.strMeal}, a delicious ${recipe.strArea} ${recipe.strCategory}.` : undefined,
    image: recipe ? recipe.strMealThumb : undefined
  });

  // Load checked ingredients from localStorage
  useEffect(() => {
    if (id) {
      try {
        const stored = localStorage.getItem(`recipe_checklist_${id}`);
        if (stored) {
          setCheckedIngredients(JSON.parse(stored));
        }
      } catch (e) {}
    }
  }, [id]);

  // Save checked ingredients to localStorage
  useEffect(() => {
    if (id && !isLoading) {
      try {
        localStorage.setItem(`recipe_checklist_${id}`, JSON.stringify(checkedIngredients));
      } catch (e) {}
    }
  }, [checkedIngredients, id, isLoading]);

  function toggleIngredient(index) {
    setCheckedIngredients((prev) => {
      const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      if (next.length === ingredients.length && ingredients.length > 0) {
        toast.success('All ingredients checked off! Ready to cook 🍳', { id: 'all-checked' });
      }
      return next;
    });
  }

  useEffect(() => {
    async function loadRecipe() {
      setIsLoading(true);
      setCheckedIngredients([]);
      try {
        const data = await lookupRecipeById(id);
        if (data) {
          setRecipe(data);
          addRecentRecipe(data); // Save to recently viewed
          try {
            const related = await filterByCategory(data.strCategory);
            setRelatedRecipes(related.filter(r => r.idMeal !== id).slice(0, 4));
          } catch {
            setRelatedRecipes([]);
          }
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

  // Format instructions into steps (handles line breaks, existing numbering, or dense paragraphs)
  let instructions = (recipe.strInstructions || '')
    .split(/\r\n|\n|\r|(?=\b(?:step\s*\d+|\d+[.)])\s*)/i)
    .map(step => step.replace(/^(?:step\s*\d+|\d+[.)]|[-•*])\s*/i, '').trim())
    .filter(step => step.length > 3)
    .flatMap(step => {
      // Break down overly long paragraphs into sentences
      if (step.length > 120) {
        return step.split(/(?<=[.!?])\s+(?=[A-Z])/).map(s => s.trim()).filter(s => s.length > 3);
      }
      return step;
    });

  // Helper to highlight ingredient names and cooking actions inside instructions
  function renderHighlightedStep(stepText) {
    const cookingVerbs = [
      'bake', 'fry', 'boil', 'roast', 'chop', 'whisk', 'stir', 'sauté', 'saute', 
      'simmer', 'mix', 'blend', 'drain', 'slice', 'dice', 'preheat', 'marinate', 
      'pour', 'season', 'garnish', 'knead', 'fold', 'mash', 'peel', 'grate'
    ].sort((a, b) => b.length - a.length);

    const ingredientNames = ingredients
      .map(i => i.ingredient.trim())
      .filter(name => name.length >= 3)
      .sort((a, b) => b.length - a.length);

    const allKeywords = [...ingredientNames, ...cookingVerbs];
    if (!allKeywords.length) return stepText;

    const escapedNames = allKeywords.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(\\b(?:${escapedNames.join('|')})\\b)`, 'gi');

    const parts = stepText.split(regex);
    return parts.map((part, idx) => {
      const isIngredient = ingredientNames.some(name => name.toLowerCase() === part.toLowerCase());
      if (isIngredient) {
        return <mark key={idx} className="recipe-details__ingredient-highlight">{part}</mark>;
      }
      const isVerb = cookingVerbs.some(name => name.toLowerCase() === part.toLowerCase());
      if (isVerb) {
        return <strong key={idx} className="recipe-details__action-highlight">{part}</strong>;
      }
      return part;
    });
  }



  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: recipe.strMeal,
        text: `Check out this recipe for ${recipe.strMeal} on Recipe Finder!`,
        url: window.location.href,
      }).then(() => {
        toast.success('Shared successfully!');
      }).catch((e) => {
        if (e.name !== 'AbortError') toast.error('Failed to share.');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { icon: '📋' });
    }
  }

  function handlePrint() {
    window.print();
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
          <PremiumImage src={recipe.strMealThumb} alt="" aria-hidden="true" />
        </div>
        
        <div className="container recipe-details__hero-content">
          <button className="recipe-details__back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} /> Back
          </button>

          <div className="recipe-details__header">
            <h1 className="recipe-details__title">{recipe.strMeal}</h1>
            <div className="recipe-details__meta">
              <span className="recipe-details__tag">
                <Utensils size={14} /> {recipe.strCategory}
              </span>
              <span className="recipe-details__tag recipe-details__tag--area">
                <Globe size={14} /> {recipe.strArea}
              </span>
              <span className="recipe-details__tag recipe-details__tag--info">
                <List size={14} /> {ingredients.length} Ingredients
              </span>
              <span className="recipe-details__tag recipe-details__tag--info">
                <BookOpen size={14} /> Step-by-Step Guide
              </span>
              {recipe.strSource && (
                <a 
                  href={recipe.strSource} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="recipe-details__tag recipe-details__tag--source"
                >
                  <Sparkles size={14} /> Verified Source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container recipe-details__main">
        <div className="recipe-details__sidebar">
          {/* Action Card */}
          <div className="recipe-details__action-card">
            <PremiumImage src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-details__thumbnail" />
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
              <motion.button 
                className="recipe-details__btn recipe-details__btn--secondary"
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={18} /> Share
              </motion.button>
              <motion.button 
                className="recipe-details__btn recipe-details__btn--secondary hide-on-mobile"
                onClick={handlePrint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Printer size={18} /> Print
              </motion.button>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="recipe-details__section">
            <div className="recipe-details__section-header">
              <h3 className="recipe-details__section-title">
                <List size={22} className="text-primary" /> Ingredients
              </h3>
              <span className="recipe-details__progress">
                {checkedIngredients.length}/{ingredients.length} Done
              </span>
            </div>
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
                  <p className="recipe-details__step-text">
                    {renderHighlightedStep(step)}
                  </p>
                </div>
              ))}
            </div>
          </div>


          {/* Related Recipes ("You May Also Like") */}
          {relatedRecipes.length > 0 && (
            <div className="recipe-details__section recipe-details__related-section">
              <h3 className="recipe-details__section-title">
                <Sparkles size={22} className="text-primary" /> You May Also Like
              </h3>
              <div className="recipe-details__related-grid">
                {relatedRecipes.map((relRecipe) => (
                  <RecipeCard
                    key={relRecipe.idMeal}
                    meal={relRecipe}
                    onBookmarkToggle={bookmarkHook.toggleBookmark}
                    isBookmarked={bookmarkHook.checkIsBookmarked(relRecipe.idMeal)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
}

export default RecipeDetails;

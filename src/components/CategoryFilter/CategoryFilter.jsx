import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import './CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, onCategorySelect }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      <div className="category-filter__header">
        <UtensilsCrossed size={18} className="category-filter__icon" />
        <h3 className="category-filter__label">Explore Categories</h3>
      </div>

      <div className="category-filter__scroll-container">
        <div className="category-filter__scroll">
          <button
            className={`category-filter__btn ${!selectedCategory ? 'category-filter__btn--active' : ''}`}
            onClick={() => onCategorySelect('')}
            aria-pressed={!selectedCategory}
          >
            {/* Framer motion active indicator */}
            {!selectedCategory && (
              <motion.div layoutId="activeCategory" className="category-filter__active-bg" />
            )}
            <span className="category-filter__text">All Recipes</span>
          </button>

          {categories.map((category) => {
            const isActive = selectedCategory === category.strCategory;
            return (
              <button
                key={category.idCategory}
                className={`category-filter__btn ${isActive ? 'category-filter__btn--active' : ''}`}
                onClick={() => onCategorySelect(category.strCategory)}
                aria-pressed={isActive}
                title={category.strCategoryDescription?.substring(0, 100)}
              >
                {isActive && (
                  <motion.div layoutId="activeCategory" className="category-filter__active-bg" />
                )}
                <img
                  src={category.strCategoryThumb}
                  alt=""
                  className="category-filter__thumb"
                  loading="lazy"
                  aria-hidden="true"
                />
                <span className="category-filter__text">{category.strCategory}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoryFilter;

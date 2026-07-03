import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchBar.css';

function SearchBar({ onSearch, initialValue = '', isLoading = false }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  function handleClear() {
    setInputValue('');
    onSearch('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && inputValue) {
      e.preventDefault();
      handleClear();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(inputValue);
  }

  return (
    <form
      className={`search-bar ${isLoading ? 'search-bar--loading' : ''}`}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search recipes"
    >
      <div className="search-bar__input-wrapper">
        <div className="search-bar__icon-wrapper">
          {isLoading ? (
            <Loader2 className="search-bar__icon search-bar__icon--spin" size={20} />
          ) : (
            <Search className="search-bar__icon" size={20} />
          )}
        </div>

        <input
          type="text"
          className="search-bar__input"
          placeholder="Search recipes by name or ingredient (e.g., Chicken, Pasta)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search recipes"
          autoComplete="off"
        />

        <AnimatePresence>
          {inputValue && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              className="search-bar__clear"
              onClick={handleClear}
              aria-label="Clear search input"
              title="Clear (Esc)"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        type="submit"
        className="search-bar__button"
        disabled={isLoading}
        aria-label="Submit recipe search"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;

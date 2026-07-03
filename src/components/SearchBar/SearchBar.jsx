import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounce(inputValue, 500);

  // Auto-search when the user stops typing
  useEffect(() => {
    if (typeof debouncedValue === 'string') {
      onSearch(debouncedValue.trim());
    }
  }, [debouncedValue, onSearch]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleClear() {
    setInputValue('');
    onSearch(''); // Immediately clear results
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
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for your next favorite meal..."
          aria-label="Recipe search"
          autoComplete="off"
          spellCheck="false"
        />

        <AnimatePresence>
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              className="search-bar__clear"
              onClick={handleClear}
              aria-label="Clear search"
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
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;

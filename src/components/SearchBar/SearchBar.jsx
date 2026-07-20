import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, X, Loader2, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchBar.css';

const RECENT_SEARCHES_KEY = 'recipe_finder_recent_searches';
const MAX_RECENT = 5;

// Popular suggestions to mix in if recent searches are empty or small
const POPULAR_SUGGESTIONS = ['Chicken', 'Pasta', 'Beef', 'Salad', 'Cake', 'Pizza'];

function SearchBar({ onSearch, initialValue = '', isLoading = false }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(inputValue, 300); // 300ms debounce
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  function saveRecentSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

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
    setIsFocused(false);
    saveRecentSearch(inputValue);
    onSearch(inputValue);
  }

  function handleSuggestionClick(suggestion) {
    setInputValue(suggestion);
    setIsFocused(false);
    saveRecentSearch(suggestion);
    onSearch(suggestion);
  }

  // Highlight matching text in suggestions
  function renderHighlightedText(text, highlight) {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, idx) => 
      regex.test(part) ? <strong key={idx} className="text-primary">{part}</strong> : part
    );
  }

  // Generate suggestions based on input and recent searches
  const displaySuggestions = inputValue.trim() 
    ? [...recentSearches, ...POPULAR_SUGGESTIONS]
        .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
        .filter((val, idx, self) => self.indexOf(val) === idx)
        .slice(0, 5)
    : recentSearches;

  return (
    <div className="search-bar-container" ref={containerRef}>
      <form
        className={`search-bar ${isLoading ? 'search-bar--loading' : ''} ${isFocused ? 'search-bar--focused' : ''}`}
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
          onFocus={() => setIsFocused(true)}
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
    
    <AnimatePresence>
      {isFocused && displaySuggestions.length > 0 && (
        <motion.div
          className="search-bar__suggestions"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="search-bar__suggestions-header">
            {inputValue ? 'Suggestions' : 'Recent Searches'}
          </div>
          <ul className="search-bar__suggestions-list">
            {displaySuggestions.map((suggestion, idx) => (
              <li key={idx}>
                <button 
                  type="button" 
                  className="search-bar__suggestion-btn"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="search-bar__suggestion-icon">
                    {!inputValue && recentSearches.includes(suggestion) ? <Clock size={16} /> : <Search size={16} />}
                  </span>
                  <span className="search-bar__suggestion-text">
                    {renderHighlightedText(suggestion, inputValue)}
                  </span>
                  <ChevronRight className="search-bar__suggestion-arrow" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
}

export default SearchBar;

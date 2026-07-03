import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

function Header({ bookmarkCount }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__brand">
          <div className="header__logo-wrapper">
            <ChefHat size={28} className="header__logo-icon" />
          </div>
          <div className="header__title-group">
            <h1 className="header__title">Recipe Finder</h1>
            <span className="header__subtitle">Discover delicious meals</span>
          </div>
        </Link>

        <div className="header__nav-area">
          <Navbar />
          <div role="status" aria-live="polite" className="header__badge-container">
            <AnimatePresence>
              {bookmarkCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="header__bookmark-badge" 
                  aria-label={`${bookmarkCount} saved bookmarks`}
                >
                  {bookmarkCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

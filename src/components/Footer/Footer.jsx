import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowUp, Heart, ExternalLink, Code2 } from 'lucide-react';
import './Footer.css';

function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__container">
        {/* Top Row: Brand & Quick Links */}
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="Recipe Finder Home">
              <div className="footer__logo-icon">
                <ChefHat size={22} />
              </div>
              <span className="footer__logo-text">Recipe<span className="text-primary">Finder</span></span>
            </Link>
            <p className="footer__tagline">
              Discover, master, and save thousands of delicious recipes from around the globe with step-by-step guidance.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Navigation</h4>
              <ul className="footer__list">
                <li><Link to="/">Explore Recipes</Link></li>
                <li><Link to="/bookmarks">Saved Bookmarks</Link></li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Attribution & API</h4>
              <ul className="footer__list">
                <li>
                  <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer" className="footer__ext-link">
                    TheMealDB API <ExternalLink size={13} />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/avinashgoru/Recipe-Finder" target="_blank" rel="noopener noreferrer" className="footer__ext-link">
                    GitHub Repository <Code2 size={13} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Back To Top */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Recipe Finder. Crafted with <Heart size={14} className="footer__heart" /> for food lovers everywhere.
          </p>

          <button
            type="button"
            className="footer__back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <div className="footer__arrow-icon">
              <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

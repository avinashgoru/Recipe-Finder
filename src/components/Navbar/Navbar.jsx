import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bookmark } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        <Home size={18} />
        <span className="navbar__text">Home</span>
      </NavLink>

      <NavLink
        to="/bookmarks"
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        <Bookmark size={18} />
        <span className="navbar__text">Bookmarks</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;

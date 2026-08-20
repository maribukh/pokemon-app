import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header-area">
      <div className="header-container">
        <div className="brand">
          <h1>Poki Land</h1>
        </div>
        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'header-nav__link header-nav__link--active'
                : 'header-nav__link'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'header-nav__link header-nav__link--active'
                : 'header-nav__link'
            }
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

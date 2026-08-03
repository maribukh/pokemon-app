import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

function getNavLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'header-nav__link header-nav__link--active'
    : 'header-nav__link';
}

function Header() {
  return (
    <header className="header-area">
      <div className="header-container">
        <div className="brand">
          <h1>Poki Land</h1>
        </div>
        <div className="header-right">
          <nav className="header-nav">
            <NavLink to="/" end className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={getNavLinkClass}>
              About
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;

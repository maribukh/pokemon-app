import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header-area">
      <div className="header-container">
        <div className="brand">
          <h1>Poki Land</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className="header-nav__link">
            Home
          </Link>
          <Link to="/about" className="header-nav__link">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

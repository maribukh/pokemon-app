import { Component } from 'react';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="header-area">
        <div className="header-container">
          <div className="brand">
            <h1>Poki Land</h1>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;

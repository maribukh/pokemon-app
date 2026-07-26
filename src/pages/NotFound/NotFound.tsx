import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="not-found-page__link">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;

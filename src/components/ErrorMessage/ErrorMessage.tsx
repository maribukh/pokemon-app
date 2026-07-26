import type { ErrorMessageProps } from './ErrorMessage.types';
import './ErrorMessage.css';

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <span className="error-message__mark">!</span>
      <p className="error-message__text">
        No Pokémon match that name. Maybe it's hiding in the tall grass?
      </p>
      <p className="error-message__detail">{message}</p>
    </div>
  );
}

export default ErrorMessage;

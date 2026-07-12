import { Component } from 'react';
import type { ErrorMessageProps } from './ErrorMessage.types';
import './ErrorMessage.css';

class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    const { message } = this.props;

    return (
      <div className="error-message">
        <span className="error-message__mark">!</span>
        <p className="error-message__text">
          {' '}
          No Pokémon match that name. Maybe it's hiding in the tall grass?{' '}
        </p>
        <p> {message}</p>
      </div>
    );
  }
}

export default ErrorMessage;

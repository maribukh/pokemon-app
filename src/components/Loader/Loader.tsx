import { Component } from 'react';
import './Loader.css';

class Loader extends Component {
  render() {
    return (
      <div className="loader" role="status" aria-label="Loading">
        <div className="loader__spinner" />
      </div>
    );
  }
}

export default Loader;

import { Component } from 'react';
import type { BuggyButtonState } from './BuggyButton.types';
import './BuggyButton.css';

class BuggyButton extends Component<Record<string, never>, BuggyButtonState> {
  state: BuggyButtonState = {
    shouldThrow: false,
  };

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error triggered by BuggyButton');
    }

    return (
      <button className="buggy-button" onClick={this.handleClick}>
        Simulate Error
      </button>
    );
  }
}

export default BuggyButton;

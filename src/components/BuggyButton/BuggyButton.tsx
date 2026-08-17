'use client';
import { useState } from 'react';
import './BuggyButton.css';

function BuggyButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by BuggyButton');
  }

  return (
    <button className="buggy-button" onClick={() => setShouldThrow(true)}>
      Simulate Error
    </button>
  );
}

export default BuggyButton;

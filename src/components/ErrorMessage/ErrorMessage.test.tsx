import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the provided error message', () => {
    render(<ErrorMessage message="Pokemon not found" />);
    expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('renders different messages correctly', () => {
    render(<ErrorMessage message="Server error 500" />);
    expect(screen.getByText(/server error 500/i)).toBeInTheDocument();
  });
});

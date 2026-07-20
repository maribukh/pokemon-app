import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders input and search button', () => {
    render(<Search onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search pokemon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows empty input when no saved term exists', () => {
    render(<Search onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(
      /search pokemon/i
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('displays previously saved search term on mount', () => {
    localStorage.setItem('pokemon_search_term', 'pikachu');
    render(<Search onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(
      /search pokemon/i
    ) as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<Search onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search pokemon/i);

    await user.type(input, 'charizard');

    expect(input).toHaveValue('charizard');
  });

  it('calls onSearch with trimmed value when search button is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  squirtle  ');
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('squirtle');
  });

  it('saves trimmed term to localStorage on search', async () => {
    const user = userEvent.setup();
    render(<Search onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  eevee  ');
    await user.click(button);

    expect(localStorage.getItem('pokemon_search_term')).toBe('eevee');
  });

  it('does not call onSearch if search value is unchanged', async () => {
    const user = userEvent.setup();
    localStorage.setItem('pokemon_search_term', 'ditto');
    const onSearch = vi.fn();

    render(<Search onSearch={onSearch} />);
    const button = screen.getByRole('button', { name: /search/i });

    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('triggers search on Enter key press', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search pokemon/i);
    await user.type(input, 'mew{Enter}');

    expect(onSearch).toHaveBeenCalledWith('mew');
  });
});

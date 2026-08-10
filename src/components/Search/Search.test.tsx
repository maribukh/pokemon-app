import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';
import * as storage from '../../utils/storage';

vi.mock('../../utils/storage');

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getSavedSearchTerm).mockReturnValue('');
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
    vi.mocked(storage.getSavedSearchTerm).mockReturnValue('pikachu');
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

  it.each([
    ['  squirtle  ', 'squirtle'],
    ['charizard', 'charizard'],
    ['   bulbasaur', 'bulbasaur'],
  ])('trims "%s" to "%s" before calling onSearch', async (typed, expected) => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, typed);
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith(expected);
  });

  it('saves trimmed term via storage when search is performed', async () => {
    const user = userEvent.setup();
    render(<Search onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search pokemon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  eevee  ');
    await user.click(button);

    expect(storage.saveSearchTerm).toHaveBeenCalledWith('eevee');
  });

  it('does not call onSearch if search value is unchanged', async () => {
    vi.mocked(storage.getSavedSearchTerm).mockReturnValue('ditto');
    const user = userEvent.setup();
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

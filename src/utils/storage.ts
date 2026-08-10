const SEARCH_TERM_KEY = 'pokemon_search_term';

export function getSavedSearchTerm(): string {
  const saved = localStorage.getItem(SEARCH_TERM_KEY);
  return saved ?? '';
}

export function saveSearchTerm(term: string): void {
  localStorage.setItem(SEARCH_TERM_KEY, term);
}

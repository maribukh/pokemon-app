import { getSavedSearchTerm, saveSearchTerm } from './storage';

export const performSearch = (
  query: string,
  onSearch: (term: string) => void
) => {
  const trimmed = query.trim();
  const savedTerm = getSavedSearchTerm();

  if (trimmed === savedTerm) {
    return false;
  }

  saveSearchTerm(trimmed);
  onSearch(trimmed);
  return true;
};

export const getInitialSearchValue = () => {
  return getSavedSearchTerm();
};

export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length > 0;
};

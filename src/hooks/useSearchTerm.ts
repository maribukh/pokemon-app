import { useState } from 'react';
import { getInitialSearchValue, performSearch } from '../utils/searchUtils';

export function useSearchTerm(onSearch: (term: string) => void) {
  const [value, setValue] = useState<string>(() => getInitialSearchValue());

  const search = () => {
    const wasSearched = performSearch(value, onSearch);
    if (wasSearched) {
      setValue(value.trim());
    }
  };

  return { value, setValue, search };
}

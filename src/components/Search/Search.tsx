import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SearchProps } from './Search.types';
import { useSearchTerm } from '../../hooks/useSearchTerm';
import './Search.css';

function Search({ onSearch }: SearchProps) {
  const { value, setValue, search } = useSearchTerm(onSearch);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        className="search__input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search pokemon..."
      />
      <button className="search__button" onClick={search}>
        Search
      </button>
    </div>
  );
}

export default Search;

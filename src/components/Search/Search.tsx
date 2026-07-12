import { Component } from 'react';
import type { SearchProps, SearchState } from './Search.types';
import { performSearch, getInitialSearchValue } from '../../utils/searchUtils';
import './Search.css';

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    value: getInitialSearchValue(),
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSearchClick = () => {
    const wasSearched = performSearch(this.state.value, this.props.onSearch);
    if (wasSearched) {
      this.setState({ value: this.state.value.trim() });
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleSearchClick();
    }
  };

  render() {
    return (
      <div className="search">
        <input
          type="text"
          className="search__input"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Search pokemon..."
        />
        <button className="search__button" onClick={this.handleSearchClick}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;

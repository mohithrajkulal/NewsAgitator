import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from './searchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = _.debounce(() => setDebouncedQuery(query), 300);
    handler();
    return () => {
      handler.cancel();
    };
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setQuery(searchValue);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  return (
    <div className={styles.searchBar}>
      <FaSearch className={styles.searchIcon} />
      <input
        type='text'
        value={query}
        onChange={handleSearchText}
        placeholder='Search...'
        className={styles.searchInput}
      />
      {query && (
        <FaTimes
          className={styles.clearIcon}
          onClick={handleClearSearch}
          role='button'
          aria-label='Clear search'
        />
      )}
    </div>
  );
};

export default SearchBar;

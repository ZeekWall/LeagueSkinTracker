import React from 'react';
import { SearchBarProps } from '../shared/types';

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      onClearSearch();
    }
  };

  return (
    <div className="bg-league-bg-secondary/30 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm relative">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search champions..."
            className="
              w-full pl-8 pr-8 py-2 text-sm
              bg-league-bg-secondary text-league-text-primary placeholder-league-text-secondary
              border border-gray-600 rounded
              focus:outline-none focus:border-league-gold focus:ring-1 focus:ring-league-gold/20
              transition-all duration-200
            "
            aria-label="Search champions by name or title"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-league-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="
                absolute inset-y-0 right-0 pr-2 flex items-center
                text-league-text-secondary hover:text-league-gold
                transition-colors duration-200
                focus:outline-none focus:text-league-gold
              "
              title="Clear search"
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Compact Help Text */}
        <span className="text-xs text-league-text-secondary hidden md:block">
          Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd> to clear
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
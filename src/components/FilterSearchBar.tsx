import React from 'react';
import { FilterType } from '../shared/types';

interface FilterSearchBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  championCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  activeFilter,
  onFilterChange,
  championCount,
  searchQuery,
  onSearchChange,
  onClearSearch
}) => {
  const filters: { key: FilterType; label: string; description: string }[] = [
    { key: 'all', label: 'All', description: 'Show all champions' },
    { key: 'owned', label: 'Owned', description: 'Champions with skins' },
    { key: 'missing', label: 'Missing', description: 'Champions without skins' },
    { key: 'shards', label: 'Shards', description: 'Champions with shards only' },
    { key: 'both', label: 'Both', description: 'Champions with skins and shards' }
  ];

  const getFilterButtonClass = (filterKey: FilterType): string => {
    const baseClass = `
      px-3 py-1 text-sm font-medium rounded transition-all duration-200
      focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-league-bg-primary
      border
    `;

    if (activeFilter === filterKey) {
      return `${baseClass} 
        bg-league-gold text-league-bg-primary border-league-gold
        hover:bg-league-gold-dark font-bold
        focus:ring-league-gold
      `;
    }

    return `${baseClass}
      bg-league-bg-secondary text-league-text-primary border-gray-600
      hover:border-league-gold hover:text-league-gold hover:bg-league-bg-secondary/80
      focus:ring-league-gold
    `;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      onClearSearch();
    }
  };

  // Add global keyboard shortcuts
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search champions..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="bg-league-bg-secondary/40 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between gap-6">
        
        {/* Left: Filter Buttons */}
        <div className="flex gap-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={getFilterButtonClass(filter.key)}
              title={filter.description}
              aria-pressed={activeFilter === filter.key}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative">
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

        {/* Right: Results Count & Keyboard Shortcut */}
        <div className="flex items-center gap-4 text-sm whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-league-text-secondary">Showing:</span>
            <span className="text-league-gold font-semibold">
              {championCount} champion{championCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-xs text-league-text-secondary">
            <kbd className="px-1.5 py-0.5 bg-league-bg-secondary border border-gray-600 rounded text-xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-league-bg-secondary border border-gray-600 rounded text-xs">F</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSearchBar;
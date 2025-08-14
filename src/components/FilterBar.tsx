import React from 'react';
import { FilterBarProps, FilterType } from '../shared/types';

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  championCount
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

  return (
    <div className="bg-league-bg-secondary/50 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        {/* Filter Buttons */}
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

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-league-text-secondary">Showing:</span>
          <span className="text-league-gold font-semibold">
            {championCount} champion{championCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
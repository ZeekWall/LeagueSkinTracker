import React from 'react';
import ProgressBar from './ProgressBar';

interface FilterPanelProps {
  championCount: number;
  totalCount: number;
  skinProgress: number;
  shardProgress: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: 'all' | 'missing-skin' | 'missing-shard' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard' | 'missing-skin-missing-shard';
  onFilterChange: (type: 'all' | 'missing-skin' | 'missing-shard' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard' | 'missing-skin-missing-shard') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  championCount,
  totalCount,
  skinProgress,
  shardProgress,
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Champions' },
    { value: 'missing-skin', label: 'Missing Skin' },
    { value: 'missing-shard', label: 'Missing Shard' },
    { value: 'has-shard', label: 'Has Shard' },
    { value: 'missing-skin-has-shard', label: 'Missing Skin + Has Shard' },
    { value: 'has-skin-has-shard', label: 'Has Skin + Has Shard' },
    { value: 'missing-skin-missing-shard', label: 'Missing Skin + Missing Shard' }
  ];

  return (
    <div className="filter-panel">
      <div className="filter-widget">
        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search champions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Filter Dropdown */}
        <div className="filter-dropdown-container">
          <select
            className="filter-dropdown"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as any)}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Champion Count */}
        <div className="champion-count">
          Showing {championCount} of {totalCount} champions
        </div>

        {/* Progress Bars */}
        <div className="progress-widget">
          <ProgressBar 
            skinProgress={skinProgress}
            shardProgress={shardProgress}
            totalChampions={totalCount}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
import React from 'react';
import ProgressBar from './ProgressBar';

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: 'all' | 'missing-skin' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard';
  onFilterChange: (type: 'all' | 'missing-skin' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard') => void;
  championCount: number;
  totalCount: number;
  skinProgress: number;
  shardProgress: number;
  onQuickFillSkin?: () => void;
  onQuickFillShard?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  championCount,
  totalCount,
  skinProgress,
  shardProgress,
  onQuickFillSkin,
  onQuickFillShard
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-content">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search champions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Champions
          </button>
          <button
            className={`filter-btn ${filterType === 'missing-skin' ? 'active' : ''}`}
            onClick={() => onFilterChange('missing-skin')}
          >
            Missing Skin
          </button>
          <button
            className={`filter-btn ${filterType === 'has-shard' ? 'active' : ''}`}
            onClick={() => onFilterChange('has-shard')}
          >
            Has Shard
          </button>
          <button
            className={`filter-btn ${filterType === 'missing-skin-has-shard' ? 'active' : ''}`}
            onClick={() => onFilterChange('missing-skin-has-shard')}
          >
            Missing Skin + Has Shard
          </button>
          <button
            className={`filter-btn ${filterType === 'has-skin-has-shard' ? 'active' : ''}`}
            onClick={() => onFilterChange('has-skin-has-shard')}
          >
            Has Skin + Has Shard
          </button>
        </div>
        
        <div className="champion-count">
          Showing {championCount} of {totalCount} champions
        </div>
        
        <ProgressBar 
          skinProgress={skinProgress}
          shardProgress={shardProgress}
          totalChampions={totalCount}
        />
        
        {(onQuickFillSkin || onQuickFillShard) && (
          <div className="quick-fill-buttons">
            {onQuickFillSkin && (
              <button 
                className="btn btn-secondary quick-fill-btn"
                onClick={onQuickFillSkin}
                title="Mark all filtered champions as having skins"
              >
                🎨 Quick Fill Skins
              </button>
            )}
            {onQuickFillShard && (
              <button 
                className="btn btn-secondary quick-fill-btn"
                onClick={onQuickFillShard}
                title="Mark all filtered champions as having shards"
              >
                💎 Quick Fill Shards
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel; 
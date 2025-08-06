import React, { useState, useMemo } from 'react';
import ChampionCard from './ChampionCard';
import { Champion } from '../../main/database';

interface ChampionListProps {
  champions: Champion[];
  onChampionUpdate: (championId: string, hasSkin: boolean, hasShard: boolean) => void;
  bulkEditMode: boolean;
  selectedChampions: Set<string>;
  onChampionSelect: (championId: string) => void;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterType: 'all' | 'missing-skin' | 'has-shard' | 'missing-skin-has-shard' | 'has-skin-has-shard';
}

type SortOption = 'name' | 'skin-status' | 'shard-status' | 'name-desc' | 'skin-status-desc' | 'shard-status-desc';

const ChampionList: React.FC<ChampionListProps> = ({
  champions,
  onChampionUpdate,
  bulkEditMode,
  selectedChampions,
  onChampionSelect,
  viewMode,
  searchTerm,
  filterType
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showCompact, setShowCompact] = useState(false);

  // Filter and sort champions
  const filteredAndSortedChampions = useMemo(() => {
    let filtered = champions.filter(champion => {
      const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      switch (filterType) {
        case 'missing-skin':
          return !champion.hasSkin;
        case 'has-shard':
          return champion.hasShard && !champion.hasSkin;
        case 'missing-skin-has-shard':
          return !champion.hasSkin && champion.hasShard;
        case 'has-skin-has-shard':
          return champion.hasSkin && champion.hasShard;
        default:
          return true;
      }
    });

    // Sort champions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'skin-status':
          return (a.hasSkin === b.hasSkin) ? a.name.localeCompare(b.name) : (a.hasSkin ? -1 : 1);
        case 'skin-status-desc':
          return (a.hasSkin === b.hasSkin) ? a.name.localeCompare(b.name) : (a.hasSkin ? 1 : -1);
        case 'shard-status':
          return (a.hasShard === b.hasShard) ? a.name.localeCompare(b.name) : (a.hasShard ? -1 : 1);
        case 'shard-status-desc':
          return (a.hasShard === b.hasShard) ? a.name.localeCompare(b.name) : (a.hasShard ? 1 : -1);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [champions, searchTerm, filterType, sortBy]);

  const handleSkinToggle = (championId: string, currentHasSkin: boolean) => {
    const champion = champions.find(c => c.id === championId);
    if (champion) {
      onChampionUpdate(championId, !currentHasSkin, champion.hasShard); // Keep shard status
    }
  };

  const handleShardToggle = (championId: string, currentHasShard: boolean) => {
    const champion = champions.find(c => c.id === championId);
    if (champion) {
      onChampionUpdate(championId, champion.hasSkin, !currentHasShard); // Keep skin status
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="champion-list-container">
        {/* List Mode Controls */}
        <div className="list-controls">
          <div className="list-controls-left">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="name">Sort by Name (A-Z)</option>
              <option value="name-desc">Sort by Name (Z-A)</option>
              <option value="skin-status">Sort by Skin Status</option>
              <option value="skin-status-desc">Sort by Skin Status (Reverse)</option>
              <option value="shard-status">Sort by Shard Status</option>
              <option value="shard-status-desc">Sort by Shard Status (Reverse)</option>
            </select>
          </div>
          
          <div className="list-controls-right">
            <button
              className={`view-toggle-btn ${showCompact ? 'active' : ''}`}
              onClick={() => setShowCompact(!showCompact)}
              title={showCompact ? 'Switch to Detailed View' : 'Switch to Compact View'}
            >
              {showCompact ? '📋' : '📱'}
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className={`champion-list ${showCompact ? 'compact-grid' : ''}`}>
          {filteredAndSortedChampions.map((champion, index) => (
            <div
              key={champion.id}
              className={`champion-list-item ${selectedChampions.has(champion.id) ? 'selected' : ''} ${showCompact ? 'compact' : ''}`}
              onClick={() => bulkEditMode && onChampionSelect(champion.id)}
            >
              {/* Bulk Selection Checkbox */}
              {bulkEditMode && (
                <input
                  type="checkbox"
                  className="list-checkbox"
                  checked={selectedChampions.has(champion.id)}
                  onChange={() => onChampionSelect(champion.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="champion-list-content">
                <div className="champion-list-info">
                  <img 
                    src={champion.imageUrl} 
                    alt={champion.name}
                    className="champion-list-portrait"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5BPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="champion-list-details">
                    <div className="champion-list-name">{champion.name}</div>
                    {!showCompact && <div className="champion-list-title">{champion.title}</div>}
                  </div>
                </div>

                <div className="champion-list-actions">
                  {!bulkEditMode ? (
                    // Interactive Status Toggles
                    <div className="list-status-toggles">
                      <button
                        className={`list-status-toggle skin ${champion.hasSkin ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkinToggle(champion.id, champion.hasSkin);
                        }}
                        title={champion.hasSkin ? 'Remove skin ownership' : 'Mark as owning skin'}
                      >
                        {champion.hasSkin ? '✅' : '⬜'} {!showCompact && 'Skin'}
                      </button>
                      
                      <button
                        className={`list-status-toggle shard ${champion.hasShard ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShardToggle(champion.id, champion.hasShard);
                        }}
                        title={champion.hasShard ? 'Remove shard status' : 'Mark as having shard'}
                      >
                        {champion.hasShard ? '💎' : '○'} {!showCompact && 'Shard'}
                      </button>
                    </div>
                  ) : (
                    // Status Indicators for Bulk Mode
                    <div className="champion-list-status">
                      <div className={`status-indicator ${champion.hasSkin ? 'has-skin' : 'no-skin'}`}>
                        {champion.hasSkin ? '✓' : '✗'}
                      </div>
                      <div className={`status-indicator ${champion.hasShard ? 'has-shard' : 'no-shard'}`}>
                        {champion.hasShard ? '💎' : '○'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedChampions.length === 0 && (
          <div className="list-empty-state">
            <p>No champions match your current filters.</p>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    );
  }

  // Grid Mode
  return (
    <div className="champion-list-container">
      <div className="champion-grid">
        {filteredAndSortedChampions.map((champion) => (
          <ChampionCard
            key={champion.id}
            champion={champion}
            onUpdate={onChampionUpdate}
            bulkEditMode={bulkEditMode}
            isSelected={selectedChampions.has(champion.id)}
            onSelect={() => onChampionSelect(champion.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChampionList; 
import React from 'react';
import { Champion } from '../../main/database';

interface ChampionCardProps {
  champion: Champion;
  onUpdate: (championId: string, hasSkin: boolean, hasShard: boolean) => void;
  bulkEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  onUpdate,
  bulkEditMode,
  isSelected,
  onSelect
}) => {
  const handleSkinToggle = () => {
    onUpdate(champion.id, !champion.hasSkin, champion.hasShard);
  };

  const handleShardToggle = () => {
    onUpdate(champion.id, champion.hasSkin, !champion.hasShard);
  };

  const handleSelectionChange = () => {
    onSelect();
  };

  return (
    <div className={`champion-card ${isSelected ? 'selected' : ''}`}>
      <div className="champion-header">
        {bulkEditMode && (
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected}
            onChange={handleSelectionChange}
          />
        )}
        
        {champion.imageUrl && (
          <img
            src={champion.imageUrl}
            alt={champion.name}
            className="champion-avatar"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        <div className="champion-info">
          <h3 className="champion-name">{champion.name}</h3>
          <p className="champion-title">{champion.title}</p>
        </div>
      </div>
      
      {!bulkEditMode && (
        <div className="champion-actions">
          <button
            className={`status-toggle skin ${champion.hasSkin ? 'active' : ''}`}
            onClick={handleSkinToggle}
          >
            {champion.hasSkin ? '✅' : '⬜'} Own Skin
          </button>
          
          <button
            className={`status-toggle shard ${champion.hasShard ? 'active' : ''}`}
            onClick={handleShardToggle}
          >
            {champion.hasShard ? '🎁' : '⬜'} Has Shard
          </button>
        </div>
      )}
    </div>
  );
};

export default ChampionCard; 
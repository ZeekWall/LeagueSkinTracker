import React from 'react';
import { Champion } from '../../main/database';

interface ChampionCardProps {
  champion: Champion;
  onUpdate: (championId: string, hasSkin: boolean, hasShard: boolean) => void;
}

const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  onUpdate
}) => {
  const handleSkinToggle = () => {
    onUpdate(champion.id, !champion.hasSkin, champion.hasShard);
  };

  const handleShardToggle = () => {
    onUpdate(champion.id, champion.hasSkin, !champion.hasShard);
  };



  return (
    <div className="champion-card">
      <div className="champion-header">
        
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
    </div>
  );
};

export default ChampionCard; 
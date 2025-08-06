import React from 'react';

interface ProgressBarProps {
  skinProgress: number;
  shardProgress: number;
  totalChampions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ skinProgress, shardProgress, totalChampions }) => {
  const skinPercentage = totalChampions > 0 ? (skinProgress / totalChampions) * 100 : 0;
  const shardPercentage = totalChampions > 0 ? (shardProgress / totalChampions) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-section">
        <div className="progress-label">
          <span className="progress-icon">🎨</span>
          <span>Skins: {skinProgress}/{totalChampions}</span>
          <span className="progress-percentage">({skinPercentage.toFixed(1)}%)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill skin-progress" 
            style={{ width: `${skinPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-label">
          <span className="progress-icon">💎</span>
          <span>Shards: {shardProgress}/{totalChampions}</span>
          <span className="progress-percentage">({shardPercentage.toFixed(1)}%)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill shard-progress" 
            style={{ width: `${shardPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 
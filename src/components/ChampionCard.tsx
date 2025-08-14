import React from 'react';
import { ChampionCardProps } from '../shared/types';

const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  hasSkin,
  hasShard,
  onToggleSkin,
  onToggleShard
}) => {
  // Determine border styling based on ownership status
  const getBorderClass = (): string => {
    if (hasSkin && hasShard) {
      return 'ring-4 ring-league-gold shadow-[0_0_20px_rgba(240,230,210,0.6)] relative';
    }
    if (hasSkin) {
      return 'ring-4 ring-league-gold shadow-[0_0_15px_rgba(240,230,210,0.5)]';
    }
    if (hasShard) {
      return 'ring-4 ring-league-blue shadow-[0_0_16px_rgba(5,150,170,0.8)] brightness-110';
    }
    return 'ring-1 ring-gray-600';
  };

  // Get champion initials for placeholder
  const getChampionInitials = (): string => {
    const words = champion.name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return champion.name.substring(0, 2).toUpperCase();
  };

  // Handle skin toggle
  const handleSkinToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onToggleSkin(champion.id);
  };

  // Handle shard toggle
  const handleShardToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onToggleShard(champion.id);
  };

  return (
    <div 
      className={`
        bg-league-bg-secondary rounded-lg p-3 cursor-pointer
        transition-[filter,box-shadow] duration-200 ease-out
        hover:brightness-110 will-change-[filter]
        ${getBorderClass()}
      `}
      title={`${champion.name} - ${champion.title}`}
      data-testid="champion-card"
      data-champion-id={champion.id}
      data-champion-name={champion.name}
    >
      {/* Champion Portrait */}
      <div className="relative mb-3">
        {champion.iconUrl ? (
          <img
            src={champion.iconUrl}
            alt={champion.name}
            className="w-24 h-24 rounded object-cover bg-league-bg-secondary"
            onError={(e) => {
              // Fallback to initials if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
            onLoad={(e) => {
              // Hide initials when image loads successfully
              (e.target as HTMLImageElement).nextElementSibling?.classList.add('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback initials placeholder */}
        <div className={`
          w-24 h-24 bg-gradient-to-br from-league-bg-secondary to-league-blue/30 rounded 
          flex items-center justify-center text-2xl font-bold text-league-gold
          border border-league-gold/20
          ${champion.iconUrl ? 'hidden' : ''}
        `}>
          {getChampionInitials()}
        </div>

        {/* Status indicators overlay */}
        <div className="absolute -top-1 -right-1 flex flex-col gap-1">
          {hasSkin && (
            <div className="w-5 h-5 bg-league-gold rounded-full flex items-center justify-center">
              <span className="text-xs text-league-bg-primary font-bold">✓</span>
            </div>
          )}
          {hasShard && (
            <div className="w-5 h-5 bg-league-blue rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">◆</span>
            </div>
          )}
        </div>
      </div>

      {/* Champion Name */}
      <h3 className="text-league-text-primary text-sm font-semibold text-center mb-1 truncate">
        {champion.name}
      </h3>

      {/* Champion Title */}
      <p className="text-league-text-secondary text-xs text-center mb-3 h-8 leading-4 overflow-hidden">
        {champion.title}
      </p>

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        {/* Skin Button */}
        <button
          onClick={handleSkinToggle}
          className={`
            flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-league-bg-secondary
            ${hasSkin
              ? 'bg-league-gold text-league-bg-primary font-bold hover:bg-league-gold-dark focus:ring-league-gold' 
              : 'bg-gray-700 text-league-text-secondary border border-gray-600 hover:border-league-gold hover:text-league-gold hover:bg-gray-600 focus:ring-league-gold'
            }
          `}
          title={hasSkin ? 'Remove skin' : 'Add skin'}
          data-testid="skin-button"
          data-champion-id={champion.id}
        >
          Skin
        </button>

        {/* Shard Button */}
        <button
          onClick={handleShardToggle}
          className={`
            flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-league-bg-secondary
            ${hasShard
              ? 'bg-league-blue text-white font-bold hover:bg-league-blue-light focus:ring-league-blue' 
              : 'bg-gray-700 text-league-text-secondary border border-gray-600 hover:border-league-blue hover:text-league-blue hover:bg-gray-600 focus:ring-league-blue'
            }
          `}
          title={hasShard ? 'Remove shard' : 'Add shard'}
          data-testid="shard-button"
          data-champion-id={champion.id}
        >
          Shard
        </button>
      </div>
    </div>
  );
};

export default ChampionCard;
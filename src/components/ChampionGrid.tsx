import React, { useMemo } from 'react';
import ChampionCard from './ChampionCard';
import { ChampionGridProps } from '../shared/types';

const ChampionGrid: React.FC<ChampionGridProps> = ({
  champions,
  collection,
  onToggleSkin,
  onToggleShard
}) => {
  // Memoize the champion cards to prevent unnecessary re-renders
  const championCards = useMemo(() => {
    return champions.map(champion => {
      const championData = collection[champion.id] || { hasSkin: false, hasShard: false, lastModified: '' };
      
      return (
        <ChampionCard
          key={champion.id}
          champion={champion}
          hasSkin={championData.hasSkin}
          hasShard={championData.hasShard}
          onToggleSkin={onToggleSkin}
          onToggleShard={onToggleShard}
        />
      );
    });
  }, [champions, collection, onToggleSkin, onToggleShard]);

  // Show loading state if no champions
  // Show "No champions found" message for empty results (filtering)
  if (!champions || champions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-league-text-primary text-lg mb-2">No champions found</p>
          <p className="text-league-text-secondary text-sm">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      {/* Grid Container with Custom Scrollbar */}
      <div className="h-full overflow-y-auto px-4 py-2">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-4 pb-4">
          {championCards}
        </div>
      </div>
    </div>
  );
};

export default ChampionGrid;
import React from 'react';
import { ProgressBarProps } from '../shared/types';

const ProgressBar: React.FC<ProgressBarProps> = ({ statistics }) => {
  const {
    totalChampions,
    skinsOwned,
    shardsOwned,
    completionPercentage,
    shardsWithoutSkins
  } = statistics;

  return (
    <div className="bg-gradient-to-r from-league-bg-secondary to-league-bg-primary border-b border-gray-700 px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Main Progress Section */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-league-text-primary">
                Collection Progress
              </h2>
              <span className="text-league-gold font-bold text-lg">
                {completionPercentage}%
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-league-blue via-league-gold to-league-gold-dark transition-all duration-1000 ease-out rounded-full relative"
                style={{ width: `${completionPercentage}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Progress Text */}
          <div className="flex items-center gap-2 text-league-text-primary">
            <span className="text-2xl font-bold text-league-gold">
              {skinsOwned}
            </span>
            <span className="text-league-text-secondary">/</span>
            <span className="text-xl font-semibold">
              {totalChampions}
            </span>
            <span className="text-league-text-secondary text-sm">
              champions owned
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex gap-4">
          {/* Skins Owned Card */}
          <div className="bg-league-bg-secondary/50 rounded-lg p-4 border border-league-gold/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-league-gold mb-1">
                {skinsOwned}
              </div>
              <div className="text-xs text-league-text-secondary uppercase tracking-wider">
                Skins Owned
              </div>
            </div>
          </div>

          {/* Total Shards Card */}
          <div className="bg-league-bg-secondary/50 rounded-lg p-4 border border-league-blue/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-league-blue mb-1">
                {shardsOwned}
              </div>
              <div className="text-xs text-league-text-secondary uppercase tracking-wider">
                Total Shards
              </div>
            </div>
          </div>

          {/* Shards Without Skins Card */}
          <div className="bg-league-bg-secondary/50 rounded-lg p-4 border border-orange-400/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {shardsWithoutSkins}
              </div>
              <div className="text-xs text-league-text-secondary uppercase tracking-wider">
                Shards Only
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProgressBar;
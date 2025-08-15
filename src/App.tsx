import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from './components/Layout';
import ProgressBar from './components/ProgressBar';
import FilterSearchBar from './components/FilterSearchBar';
import ChampionGrid from './components/ChampionGrid';
import Toast from './components/Toast';
import { championApi } from './services/championApi';
import { browserDataStore as dataStore } from './services/browserDataStore';
import { analytics } from './services/analytics';
import { useToast } from './hooks/useToast';
import { ChampionData, ChampionCollection, FilterType, AppStatistics } from './shared/types';

const App: React.FC = () => {
  // State management
  const [champions, setChampions] = useState<ChampionData[]>([]);
  const [collection, setCollection] = useState<ChampionCollection>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search state
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Toast notifications
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load saved collection from Electron Store
        const savedCollection = dataStore.loadCollection();
        setCollection(savedCollection);

        // Fetch champion data (API with fallback to static)
        const championData = await championApi.fetchChampions();
        setChampions(championData);

        // Cache the champion data locally
        dataStore.saveCachedChampions(championData);

        console.log(`🎮 App initialized with ${championData.length} champions total`);
        
        // Track app initialization
        analytics.trackAppInit(championData.length, Object.keys(savedCollection).length);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to load champion data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Toggle skin ownership for a champion
  const handleToggleSkin = useCallback((championId: number) => {
    try {
      const champion = champions.find(c => c.id === championId);
      const newHasSkin = dataStore.toggleSkinOwnership(championId);
      
      setCollection(prev => ({
        ...prev,
        [championId]: {
          ...prev[championId],
          hasSkin: newHasSkin,
          lastModified: new Date().toISOString()
        }
      }));

      // Track skin toggle event
      if (champion) {
        analytics.trackSkinToggle(champion.name, newHasSkin);
      }

      console.log(`Toggled skin for champion ${championId}: ${newHasSkin}`);
    } catch (err) {
      console.error('Failed to toggle skin ownership:', err);
      setError('Failed to update skin status');
    }
  }, [champions]);

  // Toggle shard ownership for a champion
  const handleToggleShard = useCallback((championId: number) => {
    try {
      const champion = champions.find(c => c.id === championId);
      const newHasShard = dataStore.toggleShardOwnership(championId);
      
      setCollection(prev => ({
        ...prev,
        [championId]: {
          ...prev[championId],
          hasShard: newHasShard,
          lastModified: new Date().toISOString()
        }
      }));

      // Track shard toggle event
      if (champion) {
        analytics.trackShardToggle(champion.name, newHasShard);
      }

      console.log(`Toggled shard for champion ${championId}: ${newHasShard}`);
    } catch (err) {
      console.error('Failed to toggle shard ownership:', err);
      setError('Failed to update shard status');
    }
  }, []);

  // Filter champions based on active filter and search query
  const filteredChampions = useMemo(() => {
    let filtered = [...champions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(champion =>
        champion.name.toLowerCase().includes(query) ||
        champion.title.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(champion => {
        const championData = collection[champion.id] || { hasSkin: false, hasShard: false, lastModified: '' };
        
        switch (activeFilter) {
          case 'owned':
            return championData.hasSkin;
          case 'missing':
            return !championData.hasSkin;
          case 'shards':
            return championData.hasShard && !championData.hasSkin;
          case 'both':
            return championData.hasSkin && championData.hasShard;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [champions, collection, activeFilter, searchQuery]);

  // Calculate statistics
  const statistics: AppStatistics = useMemo(() => {
    const totalChampions = champions.length;
    let skinsOwned = 0;
    let shardsOwned = 0;
    let shardsWithoutSkins = 0;

    champions.forEach(champion => {
      const championData = collection[champion.id];
      if (championData) {
        if (championData.hasSkin) skinsOwned++;
        if (championData.hasShard) shardsOwned++;
        if (championData.hasShard && !championData.hasSkin) shardsWithoutSkins++;
      }
    });

    const completionPercentage = totalChampions > 0 ? (skinsOwned / totalChampions) * 100 : 0;

    const stats = {
      totalChampions,
      skinsOwned,
      shardsOwned,
      completionPercentage: Math.round(completionPercentage * 10) / 10,
      shardsWithoutSkins,
      lastUpdated: new Date().toISOString()
    };

    // Track collection progress milestones
    analytics.trackCollectionProgress(stats.completionPercentage);

    return stats;
  }, [champions, collection]);

  // Handle search change with debouncing
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Track search usage (only for non-empty queries)
    if (query.trim()) {
      analytics.trackSearch(query.trim());
    }
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    // Track filter usage
    analytics.trackFilterChange(filter);
  }, []);

  // Handle update champions
  const handleUpdateChampions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const previousCount = champions.length;
      const updatedChampions = await championApi.refreshChampions();
      setChampions(updatedChampions);
      dataStore.saveCachedChampions(updatedChampions);
      
      const newChampions = updatedChampions.length - previousCount;
      if (newChampions > 0) {
        showSuccess(`✨ Updated! Found ${newChampions} new champion${newChampions === 1 ? '' : 's'}`, 4000);
      } else {
        showSuccess(`🔄 Champion data updated! (${updatedChampions.length} total)`, 3000);
      }
      
      // Track champion update
      analytics.trackChampionUpdate(updatedChampions.length, Math.max(0, newChampions));
    } catch (err) {
      setError('Failed to update champion data');
      showError('Failed to update champion data. Check your internet connection.', 5000);
    } finally {
      setLoading(false);
    }
  }, [champions.length, showSuccess, showError]);

  // Show error state
  if (error && !loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4 animate-pulse">⚠️</div>
            <h2 className="text-2xl font-bold text-league-text-primary mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-league-text-secondary mb-6 text-sm leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="
                  px-6 py-3 bg-league-gold text-league-bg-primary
                  font-semibold rounded-lg hover:bg-league-gold-dark
                  transition-all duration-200 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-league-gold/50
                "
              >
                Reload App
              </button>
              <button
                onClick={() => setError(null)}
                className="
                  px-6 py-3 bg-league-bg-secondary text-league-text-primary
                  font-semibold rounded-lg border border-gray-600
                  hover:border-league-gold hover:text-league-gold
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-league-gold/50
                "
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state only when actually loading and we don't have any champions loaded yet
  if (loading && champions.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* LoL-themed loading animation */}
            <div className="relative mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-league-gold/20 border-t-league-gold"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-league-gold to-league-blue rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-league-text-primary mb-2">
              Loading Champions...
            </h2>
            <p className="text-league-text-secondary mb-2">
              Fetching latest data from DataDragon
            </p>
            <div className="flex justify-center items-center gap-1 text-xs text-league-text-secondary">
              <div className="w-1 h-1 bg-league-gold rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-league-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-league-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onUpdateChampions={handleUpdateChampions} isUpdating={loading && champions.length > 0}>
      {/* Progress Bar */}
      <ProgressBar statistics={statistics} />

      {/* Combined Filter and Search Bar */}
      <FilterSearchBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        championCount={filteredChampions.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* Champion Grid */}
      <ChampionGrid
        champions={filteredChampions}
        collection={collection}
        onToggleSkin={handleToggleSkin}
        onToggleShard={handleToggleShard}
      />

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Layout>
  );
};

export default App;

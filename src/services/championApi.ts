import axios, { AxiosResponse } from 'axios';
import { ChampionData, DataDragonResponse, DataDragonChampion } from '../shared/types';
import { API_CONFIG, STATIC_CHAMPIONS } from '../shared/constants';

/**
 * Service for fetching champion data from DataDragon API
 */
export class ChampionApiService {
  private static instance: ChampionApiService;
  private cachedChampions: ChampionData[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  private constructor() {}

  static getInstance(): ChampionApiService {
    if (!ChampionApiService.instance) {
      ChampionApiService.instance = new ChampionApiService();
    }
    return ChampionApiService.instance;
  }

  /**
   * Fetch champion data from DataDragon API with fallback to static data
   */
  async fetchChampions(): Promise<ChampionData[]> {
    try {
      // Return cached data if still fresh
      if (this.cachedChampions && (Date.now() - this.lastFetchTime) < this.CACHE_DURATION) {
        return this.cachedChampions;
      }
      
      // First get the latest version
      const versionResponse = await axios.get(API_CONFIG.VERSIONS_URL, { timeout: API_CONFIG.REQUEST_TIMEOUT });
      const latestVersion = versionResponse.data[0];
      
      // Then get champion data
      let championUrl = API_CONFIG.CHAMPION_DATA_URL.replace('{version}', latestVersion);
      
      // Apply CORS proxy for production
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      if (!isDev) {
        championUrl = API_CONFIG.CORS_PROXY + encodeURIComponent(championUrl);
      }
      
      const response: AxiosResponse<DataDragonResponse> = await axios.get(
        championUrl,
        {
          timeout: API_CONFIG.REQUEST_TIMEOUT,
          // Remove User-Agent header for CORS proxy compatibility
          headers: {}
        }
      );

      if (response.data && response.data.data) {
        const champions = this.transformDataDragonData(response.data.data, latestVersion);
        this.cachedChampions = champions;
        this.lastFetchTime = Date.now();
        
        // Update debug info in UI
        this.updateDebugInfo(latestVersion, champions.length);
        
        return champions;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      const staticChampions = this.getStaticChampions();
      this.updateDebugInfo('Static', staticChampions.length);
      return staticChampions;
    }
  }

  /**
   * Transform DataDragon API response to our champion data format
   */
  private transformDataDragonData(championData: Record<string, DataDragonChampion>, version: string): ChampionData[] {
    return Object.values(championData)
      .filter(champion => champion && champion.key && champion.name)
      .map(champion => {
        // Construct icon URL from DataDragon
        const iconUrl = `${API_CONFIG.DATA_DRAGON_BASE}/cdn/${version}/img/champion/${champion.image.full}`;
        
        return {
          id: parseInt(champion.key), // DataDragon uses string keys, we need numbers
          name: champion.name,
          title: champion.title || '',
          iconUrl
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get static champion data as fallback
   */
  private getStaticChampions(): ChampionData[] {
    return [...STATIC_CHAMPIONS].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Force refresh champion data from API
   */
  async refreshChampions(): Promise<ChampionData[]> {
    this.cachedChampions = null;
    this.lastFetchTime = 0;
    return this.fetchChampions();
  }

  /**
   * Get champion by ID
   */
  async getChampionById(id: number): Promise<ChampionData | null> {
    const champions = await this.fetchChampions();
    return champions.find(champion => champion.id === id) || null;
  }

  /**
   * Search champions by name
   */
  async searchChampions(query: string): Promise<ChampionData[]> {
    const champions = await this.fetchChampions();
    const lowercaseQuery = query.toLowerCase();
    
    return champions.filter(champion => 
      champion.name.toLowerCase().includes(lowercaseQuery) ||
      champion.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Check if cached data is available and fresh
   */
  hasFreshCache(): boolean {
    return this.cachedChampions !== null && 
           (Date.now() - this.lastFetchTime) < this.CACHE_DURATION;
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.cachedChampions = null;
    this.lastFetchTime = 0;
  }

  /**
   * Get cache info for debugging
   */
  getCacheInfo(): { hasCachedData: boolean; cacheAge: number; isExpired: boolean } {
    const cacheAge = Date.now() - this.lastFetchTime;
    return {
      hasCachedData: this.cachedChampions !== null,
      cacheAge,
      isExpired: cacheAge > this.CACHE_DURATION
    };
  }

  /**
   * Update debug info display in the UI
   */
  private updateDebugInfo(version: string, championCount: number): void {
    try {
      const debugElement = document.getElementById('debug-info');
      if (debugElement) {
        debugElement.textContent = `DataDragon v${version} • ${championCount} champions`;
      }
    } catch (error) {
      // Silently fail debug info update
    }
  }
}

// Export singleton instance
export const championApi = ChampionApiService.getInstance();
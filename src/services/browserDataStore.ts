import { ChampionCollection, StoredData, ChampionData, AppStatistics } from '../shared/types';
import { STORAGE_KEYS, APP_INFO } from '../shared/constants';

/**
 * Browser-compatible data store service using localStorage
 * This is used when running in the browser without Electron
 */
export class BrowserDataStoreService {
  private static instance: BrowserDataStoreService;

  private constructor() {}

  static getInstance(): BrowserDataStoreService {
    if (!BrowserDataStoreService.instance) {
      BrowserDataStoreService.instance = new BrowserDataStoreService();
    }
    return BrowserDataStoreService.instance;
  }

  /**
   * Save user's champion collection
   */
  saveCollection(collection: ChampionCollection): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
      console.log('Collection saved successfully to localStorage');
    } catch (error) {
      console.error('Failed to save collection:', error);
      throw new Error('Failed to save collection data');
    }
  }

  /**
   * Load user's champion collection
   */
  loadCollection(): ChampionCollection {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COLLECTION);
      if (stored) {
        const collection = JSON.parse(stored) as ChampionCollection;
        console.log(`Loaded collection with ${Object.keys(collection).length} champions from localStorage`);
        return collection;
      }
      return {};
    } catch (error) {
      console.error('Failed to load collection:', error);
      return {};
    }
  }

  /**
   * Update a single champion's status
   */
  updateChampionStatus(championId: number, hasSkin: boolean, hasShard: boolean): void {
    try {
      const collection = this.loadCollection();
      collection[championId] = {
        hasSkin,
        hasShard,
        lastModified: new Date().toISOString()
      };
      this.saveCollection(collection);
    } catch (error) {
      console.error('Failed to update champion status:', error);
      throw new Error('Failed to update champion status');
    }
  }

  /**
   * Toggle skin ownership for a champion
   */
  toggleSkinOwnership(championId: number): boolean {
    try {
      const collection = this.loadCollection();
      const current = collection[championId] || { hasSkin: false, hasShard: false, lastModified: '' };
      const newHasSkin = !current.hasSkin;
      
      collection[championId] = {
        ...current,
        hasSkin: newHasSkin,
        lastModified: new Date().toISOString()
      };
      
      this.saveCollection(collection);
      return newHasSkin;
    } catch (error) {
      console.error('Failed to toggle skin ownership:', error);
      throw new Error('Failed to toggle skin ownership');
    }
  }

  /**
   * Toggle shard ownership for a champion
   */
  toggleShardOwnership(championId: number): boolean {
    try {
      const collection = this.loadCollection();
      const current = collection[championId] || { hasSkin: false, hasShard: false, lastModified: '' };
      const newHasShard = !current.hasShard;
      
      collection[championId] = {
        ...current,
        hasShard: newHasShard,
        lastModified: new Date().toISOString()
      };
      
      this.saveCollection(collection);
      return newHasShard;
    } catch (error) {
      console.error('Failed to toggle shard ownership:', error);
      throw new Error('Failed to toggle shard ownership');
    }
  }

  /**
   * Save cached champion data
   */
  saveCachedChampions(champions: ChampionData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAMPIONS, JSON.stringify(champions));
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
      console.log(`Cached ${champions.length} champions in localStorage`);
    } catch (error) {
      console.error('Failed to save cached champions:', error);
    }
  }

  /**
   * Load cached champion data
   */
  loadCachedChampions(): ChampionData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAMPIONS);
      if (stored) {
        const champions = JSON.parse(stored) as ChampionData[];
        console.log(`Loaded ${champions.length} cached champions from localStorage`);
        return champions;
      }
      return [];
    } catch (error) {
      console.error('Failed to load cached champions:', error);
      return [];
    }
  }

  /**
   * Get last update timestamp
   */
  getLastUpdateTime(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    } catch (error) {
      console.error('Failed to get last update time:', error);
      return null;
    }
  }

  /**
   * Calculate and return app statistics
   */
  calculateStatistics(champions: ChampionData[]): AppStatistics {
    try {
      const collection = this.loadCollection();
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

      return {
        totalChampions,
        skinsOwned,
        shardsOwned,
        completionPercentage: Math.round(completionPercentage * 10) / 10, // Round to 1 decimal
        shardsWithoutSkins,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to calculate statistics:', error);
      return {
        totalChampions: 0,
        skinsOwned: 0,
        shardsOwned: 0,
        completionPercentage: 0,
        shardsWithoutSkins: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Export collection data as JSON
   */
  exportCollection(): string {
    try {
      const collection = this.loadCollection();
      const exportData: StoredData = {
        collection,
        lastApiUpdate: this.getLastUpdateTime() || new Date().toISOString(),
        cachedChampions: this.loadCachedChampions(),
        version: APP_INFO.VERSION
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export collection:', error);
      throw new Error('Failed to export collection data');
    }
  }

  /**
   * Import collection data from JSON
   */
  importCollection(jsonData: string): boolean {
    try {
      const importData: StoredData = JSON.parse(jsonData);
      
      // Validate import data structure
      if (!importData.collection || typeof importData.collection !== 'object') {
        throw new Error('Invalid import data format');
      }

      // Create backup before import
      const backup = this.exportCollection();
      localStorage.setItem('backup', backup);

      // Import the data
      this.saveCollection(importData.collection);
      
      if (importData.cachedChampions && Array.isArray(importData.cachedChampions)) {
        this.saveCachedChampions(importData.cachedChampions);
      }

      console.log('Collection imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import collection:', error);
      throw new Error('Failed to import collection data: ' + (error as Error).message);
    }
  }

  /**
   * Clear all data (with confirmation in UI)
   */
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All data cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get settings
   */
  getSettings(): any {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        version: APP_INFO.VERSION,
        firstRun: true,
        autoUpdate: true,
      };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {
        version: APP_INFO.VERSION,
        firstRun: true,
        autoUpdate: true,
      };
    }
  }

  /**
   * Update settings
   */
  updateSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }
}

// Export singleton instance
export const browserDataStore = BrowserDataStoreService.getInstance();
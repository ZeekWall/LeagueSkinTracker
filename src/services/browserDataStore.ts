import { ChampionCollection, StoredData, ChampionData, AppStatistics } from '../shared/types';
import { STORAGE_KEYS, APP_INFO } from '../shared/constants';

/**
 * Application settings interface
 */
interface AppSettings {
  version: string;
  firstRun: boolean;
  autoUpdate: boolean;
}

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
    } catch (error) {
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
        return collection;
      }
      return {};
    } catch (error) {
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
    } catch (error) {
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
        return champions;
      }
      return [];
    } catch (error) {
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

      return true;
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get settings
   */
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required properties exist with proper types
        return {
          version: parsed.version || APP_INFO.VERSION,
          firstRun: parsed.firstRun !== undefined ? Boolean(parsed.firstRun) : true,
          autoUpdate: parsed.autoUpdate !== undefined ? Boolean(parsed.autoUpdate) : true,
        };
      }
      return {
        version: APP_INFO.VERSION,
        firstRun: true,
        autoUpdate: true,
      };
    } catch (error) {
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
  updateSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      // Silently fail settings update
    }
  }
}

// Export singleton instance
export const browserDataStore = BrowserDataStoreService.getInstance();
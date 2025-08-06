import axios from 'axios';
import { DatabaseManager, Champion, PatchInfo } from '../database';

interface DataDragonChampion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
}

interface DataDragonResponse {
  data: { [key: string]: DataDragonChampion };
}

export class ChampionService {
  private readonly DATA_DRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com';
  private readonly PATCH_NOTES_BASE_URL = 'https://www.leagueoflegends.com/en-us/news/tags/patch-notes/';

  constructor(private dbManager: DatabaseManager) {}

  async getChampions(): Promise<Champion[]> {
    const champions = await this.dbManager.getChampions();
    
    // If no champions in database, fetch from API
    if (champions.length === 0) {
      return await this.refreshChampionsFromAPI();
    }
    
    return champions;
  }

  async refreshChampionsFromAPI(): Promise<Champion[]> {
    try {
      // Get latest version
      const versionsResponse = await axios.get(`${this.DATA_DRAGON_BASE_URL}/api/versions.json`);
      const latestVersion = versionsResponse.data[0];
      
      // Get champions data
      const championsResponse = await axios.get<DataDragonResponse>(
        `${this.DATA_DRAGON_BASE_URL}/cdn/${latestVersion}/data/en_US/champion.json`
      );
      
      // Transform data
      const champions: Omit<Champion, 'hasSkin' | 'hasShard' | 'lastUpdated'>[] = Object.values(
        championsResponse.data.data
      ).map(champion => ({
        id: champion.id,
        name: champion.name,
        title: champion.title,
        imageUrl: `${this.DATA_DRAGON_BASE_URL}/cdn/${latestVersion}/img/champion/${champion.image.full}`
      }));
      
      // Save to database
      await this.dbManager.upsertChampions(champions);
      
      // Update patch info
      const patchInfo: PatchInfo = {
        version: latestVersion,
        patchNotesUrl: `${this.PATCH_NOTES_BASE_URL}${latestVersion.replace('.', '-')}`
      };
      await this.dbManager.updatePatchInfo(patchInfo);
      
      // Return updated champions with existing status
      return await this.dbManager.getChampions();
    } catch (error) {
      console.error('Error fetching champions from API:', error);
      throw new Error('Failed to fetch champions from Data Dragon API');
    }
  }

  async updateChampionStatus(championId: string, hasSkin: boolean, hasShard: boolean): Promise<boolean> {
    return await this.dbManager.updateChampionStatus(championId, hasSkin, hasShard);
  }

  async bulkUpdateChampions(championIds: string[], hasSkin: boolean, hasShard: boolean): Promise<boolean> {
    return await this.dbManager.bulkUpdateChampions(championIds, hasSkin, hasShard);
  }

  async getPatchInfo(): Promise<PatchInfo> {
    const patchInfo = await this.dbManager.getPatchInfo();
    if (!patchInfo) {
      // If no patch info, try to fetch latest version
      try {
        const versionsResponse = await axios.get(`${this.DATA_DRAGON_BASE_URL}/api/versions.json`);
        const latestVersion = versionsResponse.data[0];
        const newPatchInfo: PatchInfo = {
          version: latestVersion,
          patchNotesUrl: `${this.PATCH_NOTES_BASE_URL}${latestVersion.replace('.', '-')}`
        };
        await this.dbManager.updatePatchInfo(newPatchInfo);
        return newPatchInfo;
      } catch (error) {
        console.error('Error fetching patch info:', error);
        return { version: 'Unknown', patchNotesUrl: '' };
      }
    }
    return patchInfo;
  }

  async exportData(): Promise<{ champions: Champion[], patchInfo: PatchInfo | null }> {
    return await this.dbManager.exportData();
  }

  async importData(data: any): Promise<Champion[]> {
    // Validate the data structure
    if (!data.champions || !Array.isArray(data.champions)) {
      throw new Error('Invalid data format: missing or invalid champions array');
    }

    // Import champions data
    await this.dbManager.upsertChampions(data.champions);

    // Import patch info if available
    if (data.patchInfo && data.patchInfo.version) {
      await this.dbManager.updatePatchInfo(data.patchInfo);
    }

    // Return the imported champions
    return await this.dbManager.getChampions();
  }
} 
import { Page } from '@playwright/test';
import mockChampionData from '../fixtures/champion-data.json';
import { ChampionData } from '../../src/shared/types';

/**
 * Mock API service for Playwright tests
 * Intercepts API calls and returns mock data to avoid rate limits
 */
export class MockApiService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Set up API mocking for the current page
   * This intercepts all DataDragon API calls and returns mock data
   */
  async setupMocking(): Promise<void> {
    // Intercept DataDragon version API
    await this.page.route('**/api/versions.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockChampionData.version])
      });
    });

    // Intercept DataDragon champion data API
    await this.page.route('**/data/**/champion.json', async (route) => {
      // Transform our mock data to match DataDragon format
      const dataDragonFormat = mockChampionData.champions.reduce((acc, champion) => {
        acc[champion.name] = {
          id: champion.name,
          key: champion.id,
          name: champion.name,
          title: champion.title,
          image: {
            full: `${champion.name}.png`,
            sprite: 'champion0.png',
            group: 'champion',
            x: 0,
            y: 0,
            w: 48,
            h: 48
          }
        };
        return acc;
      }, {} as any);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'champion',
          format: 'standAloneComplex',
          version: mockChampionData.version,
          data: dataDragonFormat
        })
      });
    });

    // Intercept champion images (return a placeholder or let them through)
    await this.page.route('**/img/champion/*.png', async (route) => {
      // Let images pass through normally or could return a placeholder
      await route.continue();
    });

    console.log('✅ Mock API service enabled for testing');
  }

  /**
   * Get mock champion data for assertions
   */
  getMockChampions(): ChampionData[] {
    return mockChampionData.champions.map(champ => ({
      id: champ.id,
      name: champ.name,
      title: champ.title,
      iconUrl: champ.iconUrl
    }));
  }

  /**
   * Get specific champion by name for testing
   */
  getChampionByName(name: string): ChampionData | undefined {
    const champ = mockChampionData.champions.find(c => c.name === name);
    if (!champ) return undefined;
    
    return {
      id: champ.id,
      name: champ.name,
      title: champ.title,
      iconUrl: champ.iconUrl
    };
  }

  /**
   * Get expected champion count for assertions
   */
  getExpectedChampionCount(): number {
    return mockChampionData.champions.length;
  }

  /**
   * Disable API mocking (restore normal API calls)
   */
  async disableMocking(): Promise<void> {
    await this.page.unrouteAll();
    console.log('✅ Mock API service disabled - using live API');
  }
}
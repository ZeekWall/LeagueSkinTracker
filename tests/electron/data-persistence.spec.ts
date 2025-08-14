import { test, expect } from '../utils/electron-helper';

test.describe('LoL Skin Tracker - Data Persistence', () => {
  
  test.beforeEach(async ({ page, mockApi }) => {
    // Wait for app to load completely
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    
    // Wait for champion data to load
    const loadingIndicator = page.locator('text=Loading Champions...');
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
    }
    
    // Ensure we have champion cards loaded
    await page.waitForSelector('[data-testid="champion-card"]', { timeout: 10000 });
    
    // Clear localStorage to start with clean state
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should save champion collection to localStorage on interaction', async ({ page, mockApi }) => {
    // Toggle first champion skin
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Wait a moment for save operation
    await page.waitForTimeout(100);
    
    // Verify localStorage contains the collection
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('lol-skin-tracker-collection');
    });
    
    expect(savedData).toBeTruthy();
    
    // Parse and validate the saved data structure
    const collection = JSON.parse(savedData!);
    expect(typeof collection).toBe('object');
    
    // Should have at least one champion saved
    const championIds = Object.keys(collection);
    expect(championIds.length).toBeGreaterThan(0);
    
    // Verify the champion data structure
    const firstChampionId = championIds[0];
    const championData = collection[firstChampionId];
    expect(championData).toHaveProperty('hasSkin');
    expect(championData).toHaveProperty('hasShard');
    expect(championData.hasSkin).toBe(true);
    // May also have additional fields like lastModified
  });

  test('should load saved collection data on app restart', async ({ page, mockApi, electronApp }) => {
    // Set up test data in localStorage before app loads
    const testCollection = {
      '266': { hasSkin: true, hasShard: false },  // Aatrox
      '103': { hasSkin: false, hasShard: true },  // Ahri
      '84': { hasSkin: true, hasShard: true }     // Akali
    };
    
    await page.evaluate((collection) => {
      localStorage.setItem('lol-skin-tracker-collection', JSON.stringify(collection));
    }, testCollection);
    
    // Refresh the page to simulate app restart
    await page.reload();
    
    // Wait for app to load
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    const loadingIndicator = page.locator('text=Loading Champions...');
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
    }
    
    // Verify Aatrox (skin owned) has gold border
    const aatroxCard = page.locator('[data-testid="champion-card"][data-champion-name="Aatrox"]');
    await expect(aatroxCard).toHaveClass(/ring-4 ring-league-gold/);
    await expect(aatroxCard.locator('[data-testid="skin-button"]')).toHaveClass(/bg-league-gold/);
    
    // Verify Ahri (shard owned) has blue border
    const ahriCard = page.locator('[data-testid="champion-card"][data-champion-name="Ahri"]');
    await expect(ahriCard).toHaveClass(/ring-4 ring-league-blue/);
    await expect(ahriCard.locator('[data-testid="shard-button"]')).toHaveClass(/bg-league-blue/);
    
    // Verify Akali (both owned) has enhanced gold border
    const akaliCard = page.locator('[data-testid="champion-card"][data-champion-name="Akali"]');
    await expect(akaliCard).toHaveClass(/ring-4 ring-league-gold/);
    await expect(akaliCard.locator('[data-testid="skin-button"]')).toHaveClass(/bg-league-gold/);
    await expect(akaliCard.locator('[data-testid="shard-button"]')).toHaveClass(/bg-league-blue/);
    
    // Verify stats reflect loaded data
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    await expect(skinsOwnedStat).toContainText('2'); // Aatrox + Akali
    
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    await expect(shardsOwnedStat).toContainText('2'); // Ahri + Akali
  });

  test('should maintain data consistency during multiple interactions', async ({ page, mockApi }) => {
    // Perform multiple champion interactions
    const champions = await page.locator('[data-testid="champion-card"]').all();
    const targetChampions = champions.slice(0, 5); // Work with first 5 champions
    
    // Toggle various combinations
    await targetChampions[0].locator('[data-testid="skin-button"]').click(); // Skin only
    await targetChampions[1].locator('[data-testid="shard-button"]').click(); // Shard only
    await targetChampions[2].locator('[data-testid="skin-button"]').click(); // Both
    await targetChampions[2].locator('[data-testid="shard-button"]').click();
    await targetChampions[3].locator('[data-testid="skin-button"]').click(); // Skin, then remove
    await targetChampions[3].locator('[data-testid="skin-button"]').click();
    // Champion 4 remains untouched
    
    // Verify localStorage matches UI state
    const savedData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('lol-skin-tracker-collection') || '{}');
    });
    
    // Get champion IDs for verification
    const champ0Id = await targetChampions[0].getAttribute('data-champion-id');
    const champ1Id = await targetChampions[1].getAttribute('data-champion-id');
    const champ2Id = await targetChampions[2].getAttribute('data-champion-id');
    const champ3Id = await targetChampions[3].getAttribute('data-champion-id');
    const champ4Id = await targetChampions[4].getAttribute('data-champion-id');
    
    // Verify saved data matches expected state (ignoring additional fields like lastModified)
    expect(savedData[champ0Id!]).toMatchObject({ hasSkin: true, hasShard: false });
    expect(savedData[champ1Id!]).toMatchObject({ hasSkin: false, hasShard: true });
    expect(savedData[champ2Id!]).toMatchObject({ hasSkin: true, hasShard: true });
    expect(savedData[champ3Id!]).toMatchObject({ hasSkin: false, hasShard: false });
    expect(savedData[champ4Id!]).toBeUndefined(); // Should not be saved if untouched
  });

  test('should handle corrupted localStorage data gracefully', async ({ page, mockApi }) => {
    // Set corrupted data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('lol-skin-tracker-collection', 'invalid-json-data');
    });
    
    // Refresh the page
    await page.reload();
    
    // App should still load without crashing
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    
    // Should fallback to empty collection (all champions unowned)
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await expect(firstChampion).toHaveClass(/ring-1 ring-gray-600/);
    
    // Stats should show 0 owned
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    await expect(skinsOwnedStat).toContainText('0');
    
    // New interactions should work and overwrite corrupted data
    await firstChampion.locator('[data-testid="skin-button"]').click();
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
    
    // Verify localStorage is now valid
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('lol-skin-tracker-collection');
    });
    expect(() => JSON.parse(savedData!)).not.toThrow();
  });

  test('should handle large collection datasets efficiently', async ({ page, mockApi }) => {
    // Create a large test collection (all mock champions owned)
    const mockChampions = mockApi.getMockChampions();
    const largeCollection = mockChampions.reduce((acc, champion) => {
      acc[champion.id] = { hasSkin: true, hasShard: true };
      return acc;
    }, {} as any);
    
    // Set large collection in localStorage
    await page.evaluate((collection) => {
      localStorage.setItem('lol-skin-tracker-collection', JSON.stringify(collection));
    }, largeCollection);
    
    // Measure load time
    const startTime = Date.now();
    await page.reload();
    
    // Wait for app to load
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    const loadingIndicator = page.locator('text=Loading Champions...');
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
    }
    
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (< 10 seconds even with large dataset)
    expect(loadTime).toBeLessThan(10000);
    
    // Verify all champions show as owned
    const championCards = page.locator('[data-testid="champion-card"]');
    const cardCount = await championCards.count();
    
    // Check a few random champions to verify they're loaded correctly
    for (let i = 0; i < Math.min(5, cardCount); i++) {
      const randomIndex = Math.floor(Math.random() * cardCount);
      const championCard = championCards.nth(randomIndex);
      await expect(championCard).toHaveClass(/ring-4 ring-league-gold/);
    }
    
    // Verify stats reflect large collection
    const expectedCount = mockChampions.length;
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    await expect(skinsOwnedStat).toContainText(expectedCount.toString());
  });

  test('should preserve collection data during rapid interactions', async ({ page, mockApi }) => {
    // Perform rapid consecutive interactions
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const skinButton = firstChampion.locator('[data-testid="skin-button"]');
    const shardButton = firstChampion.locator('[data-testid="shard-button"]');
    
    // Rapid toggle sequence
    await skinButton.click();
    await shardButton.click();
    await skinButton.click();
    await shardButton.click();
    await skinButton.click();
    
    // Wait for all save operations to complete
    await page.waitForTimeout(200);
    
    // Verify final state in localStorage
    const savedData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('lol-skin-tracker-collection') || '{}');
    });
    
    const championId = await firstChampion.getAttribute('data-champion-id');
    const championData = savedData[championId!];
    
    // Final state should be: skin owned, no shard (ignoring additional fields)
    expect(championData).toMatchObject({ hasSkin: true, hasShard: false });
    
    // UI should match saved state
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
    await expect(skinButton).toHaveClass(/bg-league-gold/);
    await expect(shardButton).not.toHaveClass(/bg-league-blue/);
    
    // Refresh and verify persistence
    await page.reload();
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    const loadingIndicator = page.locator('text=Loading Champions...');
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
    }
    
    // State should be preserved after reload
    const reloadedChampion = page.locator(`[data-testid="champion-card"][data-champion-id="${championId}"]`);
    await expect(reloadedChampion).toHaveClass(/ring-4 ring-league-gold/);
  });

});
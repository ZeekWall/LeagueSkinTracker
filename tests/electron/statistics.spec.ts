import { test, expect } from '../utils/electron-helper';

test.describe('LoL Skin Tracker - Statistics Validation', () => {
  
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
  });

  test('should show correct initial statistics (0% completion)', async ({ page, mockApi }) => {
    // Verify initial state - no champions owned
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const shardsOnlyStat = page.locator('text=Shards Only').locator('..').locator('div').first();
    const progressPercentage = page.locator('span.text-league-gold').first();
    const championsOwnedText = page.locator('text=champions owned').locator('..').locator('span').first();
    const totalChampionsText = page.locator('text=champions owned').locator('..').locator('span').nth(2);
    
    // Verify all stats show 0
    await expect(skinsOwnedStat).toContainText('0');
    await expect(shardsOwnedStat).toContainText('0');
    await expect(shardsOnlyStat).toContainText('0');
    await expect(progressPercentage).toContainText('0%');
    
    // Verify champion counts
    await expect(championsOwnedText).toContainText('0');
    const expectedTotal = mockApi.getExpectedChampionCount();
    await expect(totalChampionsText).toContainText(expectedTotal.toString());
  });

  test('should calculate statistics correctly after single champion interaction', async ({ page, mockApi }) => {
    // Toggle first champion skin
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Calculate expected percentage (app shows 1 decimal place)
    const totalChampions = mockApi.getExpectedChampionCount();
    const exactPercentage = (1 / totalChampions) * 100;
    const expectedPercentage = Math.round(exactPercentage * 10) / 10; // Round to 1 decimal
    
    // Verify updated statistics
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const progressPercentage = page.locator('span.text-league-gold').first();
    const championsOwnedText = page.locator('text=champions owned').locator('..').locator('span').first();
    
    await expect(skinsOwnedStat).toContainText('1');
    await expect(progressPercentage).toContainText(`${expectedPercentage}%`);
    await expect(championsOwnedText).toContainText('1');
    
    // Shards should still be 0
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const shardsOnlyStat = page.locator('text=Shards Only').locator('..').locator('div').first();
    await expect(shardsOwnedStat).toContainText('0');
    await expect(shardsOnlyStat).toContainText('0');
  });

  test('should calculate shard statistics correctly', async ({ page, mockApi }) => {
    // Toggle different champions for different states
    const champions = page.locator('[data-testid="champion-card"]');
    
    // Champion 0: Skin only
    await champions.nth(0).locator('[data-testid="skin-button"]').click();
    
    // Champion 1: Shard only
    await champions.nth(1).locator('[data-testid="shard-button"]').click();
    
    // Champion 2: Both skin and shard
    await champions.nth(2).locator('[data-testid="skin-button"]').click();
    await champions.nth(2).locator('[data-testid="shard-button"]').click();
    
    // Verify statistics
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const shardsOnlyStat = page.locator('text=Shards Only').locator('..').locator('div').first();
    
    // Skins owned: Champion 0 + Champion 2 = 2
    await expect(skinsOwnedStat).toContainText('2');
    
    // Total shards: Champion 1 + Champion 2 = 2
    await expect(shardsOwnedStat).toContainText('2');
    
    // Shards only: Champion 1 only = 1
    await expect(shardsOnlyStat).toContainText('1');
    
    // Progress should be based on skins owned (2 out of total)
    const totalChampions = mockApi.getExpectedChampionCount();
    const exactPercentage = (2 / totalChampions) * 100;
    const expectedPercentage = Math.round(exactPercentage * 10) / 10; // Round to 1 decimal
    const progressPercentage = page.locator('span.text-league-gold').first();
    await expect(progressPercentage).toContainText(`${expectedPercentage}%`);
  });

  test('should handle 100% completion correctly', async ({ page, mockApi }) => {
    // Get all champions and mark them as owned
    const champions = page.locator('[data-testid="champion-card"]');
    const totalChampions = await champions.count();
    
    // Mark all champions as skin owned
    for (let i = 0; i < totalChampions; i++) {
      await champions.nth(i).locator('[data-testid="skin-button"]').click();
    }
    
    // Verify 100% completion
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const progressPercentage = page.locator('span.text-league-gold').first();
    const championsOwnedText = page.locator('text=champions owned').locator('..').locator('span').first();
    
    await expect(skinsOwnedStat).toContainText(totalChampions.toString());
    await expect(progressPercentage).toContainText('100%');
    await expect(championsOwnedText).toContainText(totalChampions.toString());
  });

  test('should update statistics in real-time during interactions', async ({ page, mockApi }) => {
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const progressPercentage = page.locator('span.text-league-gold').first();
    
    // Initial state
    await expect(skinsOwnedStat).toContainText('0');
    await expect(progressPercentage).toContainText('0%');
    
    // Click skin button
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Statistics should update immediately
    await expect(skinsOwnedStat).toContainText('1');
    await expect(progressPercentage).not.toContainText('0%');
    
    // Click skin button again to remove
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Should return to 0
    await expect(skinsOwnedStat).toContainText('0');
    await expect(progressPercentage).toContainText('0%');
  });

  test('should calculate complex scenarios correctly', async ({ page, mockApi }) => {
    // Create a complex scenario with mixed ownership states
    const champions = page.locator('[data-testid="champion-card"]');
    const totalChampions = Math.min(10, await champions.count()); // Work with first 10 champions
    
    // Set up specific pattern:
    // - 4 champions: Skin only
    // - 3 champions: Shard only  
    // - 2 champions: Both
    // - 1 champion: Neither
    
    // Skin only (0-3)
    for (let i = 0; i < 4; i++) {
      await champions.nth(i).locator('[data-testid="skin-button"]').click();
    }
    
    // Shard only (4-6)
    for (let i = 4; i < 7; i++) {
      await champions.nth(i).locator('[data-testid="shard-button"]').click();
    }
    
    // Both (7-8)
    for (let i = 7; i < 9; i++) {
      await champions.nth(i).locator('[data-testid="skin-button"]').click();
      await champions.nth(i).locator('[data-testid="shard-button"]').click();
    }
    
    // Champion 9 remains untouched (neither)
    
    // Verify calculations
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const shardsOnlyStat = page.locator('text=Shards Only').locator('..').locator('div').first();
    
    // Skins owned: 4 (skin only) + 2 (both) = 6
    await expect(skinsOwnedStat).toContainText('6');
    
    // Total shards: 3 (shard only) + 2 (both) = 5
    await expect(shardsOwnedStat).toContainText('5');
    
    // Shards only: 3 (shard only, excluding those with both)
    await expect(shardsOnlyStat).toContainText('3');
    
    // Progress percentage based on skins owned
    const mockTotal = mockApi.getExpectedChampionCount();
    const exactPercentage = (6 / mockTotal) * 100;
    const expectedPercentage = Math.round(exactPercentage * 10) / 10; // Round to 1 decimal
    const progressPercentage = page.locator('span.text-league-gold').first();
    await expect(progressPercentage).toContainText(`${expectedPercentage}%`);
  });

  test('should handle edge case calculations (rounding)', async ({ page, mockApi }) => {
    // Test edge case where percentage calculation might have rounding issues
    const champions = page.locator('[data-testid="champion-card"]');
    
    // Toggle exactly 1/3 of champions (if possible)
    const totalChampions = mockApi.getExpectedChampionCount();
    const oneThird = Math.floor(totalChampions / 3);
    
    // Mark 1/3 of champions as owned
    for (let i = 0; i < oneThird; i++) {
      await champions.nth(i).locator('[data-testid="skin-button"]').click();
    }
    
    // Calculate expected percentage (should be properly rounded to 1 decimal)
    const exactPercentage = (oneThird / totalChampions) * 100;
    const expectedPercentage = Math.round(exactPercentage * 10) / 10;
    
    // Verify percentage is reasonable and properly formatted
    const progressPercentage = page.locator('span.text-league-gold').first();
    const percentageText = await progressPercentage.textContent();
    
    expect(percentageText).toMatch(/^\d{1,3}(\.\d)?%$/); // Should be 1-3 digits, optional decimal, followed by %
    expect(parseFloat(percentageText!)).toBe(expectedPercentage);
    
    // Verify counts match
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    await expect(skinsOwnedStat).toContainText(oneThird.toString());
  });

  test('should maintain statistical accuracy during rapid changes', async ({ page, mockApi }) => {
    // Perform rapid changes and verify statistics remain accurate
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const secondChampion = page.locator('[data-testid="champion-card"]').nth(1);
    
    // Rapid sequence of changes
    await firstChampion.locator('[data-testid="skin-button"]').click();
    await secondChampion.locator('[data-testid="shard-button"]').click();
    await firstChampion.locator('[data-testid="shard-button"]').click();
    await secondChampion.locator('[data-testid="skin-button"]').click();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Wait for all updates to settle
    await page.waitForTimeout(100);
    
    // Final state: First champion has shard only, Second champion has both
    // Expected: 1 skin owned, 2 shards owned, 1 shard only
    
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const shardsOnlyStat = page.locator('text=Shards Only').locator('..').locator('div').first();
    
    await expect(skinsOwnedStat).toContainText('1');
    await expect(shardsOwnedStat).toContainText('2');
    await expect(shardsOnlyStat).toContainText('1');
    
    // Progress should be based on 1 skin owned
    const totalChampions = mockApi.getExpectedChampionCount();
    const exactPercentage = (1 / totalChampions) * 100;
    const expectedPercentage = Math.round(exactPercentage * 10) / 10; // Round to 1 decimal
    const progressPercentage = page.locator('span.text-league-gold').first();
    await expect(progressPercentage).toContainText(`${expectedPercentage}%`);
  });

});
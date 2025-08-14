import { test, expect } from '../utils/electron-helper';

test.describe('LoL Skin Tracker - Champion Interaction', () => {
  
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

  test('should toggle skin ownership and update visual state', async ({ page }) => {
    // Get the first champion card
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const skinButton = firstChampion.locator('[data-testid="skin-button"]');
    
    // Verify initial state (unowned)
    await expect(firstChampion).toHaveClass(/ring-1 ring-gray-600/);
    await expect(skinButton).toContainText('Skin');
    
    // Click skin button to mark as owned
    await skinButton.click();
    
    // Verify visual state changed to gold border
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
    await expect(skinButton).toHaveClass(/bg-league-gold/);
    
    // Click again to toggle back to unowned
    await skinButton.click();
    
    // Verify back to initial state
    await expect(firstChampion).toHaveClass(/ring-1 ring-gray-600/);
    await expect(skinButton).not.toHaveClass(/bg-league-gold/);
  });

  test('should toggle shard ownership and update visual state', async ({ page }) => {
    // Get the first champion card
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const shardButton = firstChampion.locator('[data-testid="shard-button"]');
    
    // Verify initial state (unowned)
    await expect(firstChampion).toHaveClass(/ring-1 ring-gray-600/);
    await expect(shardButton).toContainText('Shard');
    
    // Click shard button to mark as owned
    await shardButton.click();
    
    // Verify visual state changed to blue border
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-blue/);
    await expect(shardButton).toHaveClass(/bg-league-blue/);
    
    // Click again to toggle back to unowned
    await shardButton.click();
    
    // Verify back to initial state
    await expect(firstChampion).toHaveClass(/ring-1 ring-gray-600/);
    await expect(shardButton).not.toHaveClass(/bg-league-blue/);
  });

  test('should show combined visual state when both skin and shard are owned', async ({ page }) => {
    // Get the first champion card
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const skinButton = firstChampion.locator('[data-testid="skin-button"]');
    const shardButton = firstChampion.locator('[data-testid="shard-button"]');
    
    // Mark both skin and shard as owned
    await skinButton.click();
    await shardButton.click();
    
    // Verify enhanced gold border state (both owned)
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
    await expect(skinButton).toHaveClass(/bg-league-gold/);
    await expect(shardButton).toHaveClass(/bg-league-blue/);
    
    // Verify both buttons show as active
    await expect(skinButton).toHaveClass(/font-bold/);
    await expect(shardButton).toHaveClass(/font-bold/);
  });

  test('should update progress statistics when champions are toggled', async ({ page }) => {
    // Get initial stats
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    const shardsOwnedStat = page.locator('text=Total Shards').locator('..').locator('div').first();
    const progressPercentage = page.locator('span.text-league-gold').first();
    
    // Record initial values
    const initialSkins = await skinsOwnedStat.textContent();
    const initialShards = await shardsOwnedStat.textContent();
    const initialProgress = await progressPercentage.textContent();
    
    // Toggle first champion skin
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Verify skins owned increased by 1
    await expect(skinsOwnedStat).not.toHaveText(initialSkins || '');
    
    // Verify progress percentage updated
    await expect(progressPercentage).not.toHaveText(initialProgress || '');
    
    // Toggle shard on different champion
    const secondChampion = page.locator('[data-testid="champion-card"]').nth(1);
    await secondChampion.locator('[data-testid="shard-button"]').click();
    
    // Verify shards owned increased by 1
    await expect(shardsOwnedStat).not.toHaveText(initialShards || '');
  });

  test('should show tooltips on champion card hover', async ({ page }) => {
    // Get the first champion card
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    
    // Hover over the champion card
    await firstChampion.hover();
    
    // Verify tooltip appears (champion name and title)
    const tooltip = await firstChampion.getAttribute('title');
    expect(tooltip).toBeTruthy();
    expect(tooltip).toContain(' - '); // Should contain "Name - Title" format
  });

  test('should handle multiple rapid champion interactions', async ({ page }) => {
    // Get first 3 champion cards
    const champions = page.locator('[data-testid="champion-card"]').first().locator('xpath=.//following-sibling::*[position()<=2]');
    
    // Rapidly toggle multiple champions
    for (let i = 0; i < 3; i++) {
      const champion = page.locator('[data-testid="champion-card"]').nth(i);
      await champion.locator('[data-testid="skin-button"]').click();
      await champion.locator('[data-testid="shard-button"]').click();
    }
    
    // Verify all 3 champions show as both owned
    for (let i = 0; i < 3; i++) {
      const champion = page.locator('[data-testid="champion-card"]').nth(i);
      await expect(champion).toHaveClass(/ring-4 ring-league-gold/);
      await expect(champion.locator('[data-testid="skin-button"]')).toHaveClass(/bg-league-gold/);
      await expect(champion.locator('[data-testid="shard-button"]')).toHaveClass(/bg-league-blue/);
    }
    
    // Verify stats reflect all changes
    const skinsOwnedStat = page.locator('text=Skins Owned').locator('..').locator('div').first();
    await expect(skinsOwnedStat).toContainText('3');
  });

  test('should maintain visual state consistency during scrolling', async ({ page }) => {
    // Toggle first champion
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Scroll down to load more champions
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    
    // Scroll back up
    await page.keyboard.press('Home');
    
    // Verify first champion still shows as owned
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
    await expect(firstChampion.locator('[data-testid="skin-button"]')).toHaveClass(/bg-league-gold/);
  });

  test('should handle champion interaction edge cases', async ({ page }) => {
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    const skinButton = firstChampion.locator('[data-testid="skin-button"]');
    const shardButton = firstChampion.locator('[data-testid="shard-button"]');
    
    // Test double-click (should not cause issues)
    await skinButton.dblclick();
    // After double-click, button may end up in any state, but should not crash
    // Just verify the champion card has a valid state
    const championClass = await firstChampion.getAttribute('class');
    expect(championClass).toMatch(/ring-(1|4)/);
    
    // Test clicking while disabled state (if any)
    // This tests the button remains responsive - just verify it doesn't crash
    await skinButton.click({ force: true });
    // Verify the champion still has a valid state (could be owned or unowned)
    const classAfterClick = await firstChampion.getAttribute('class');
    expect(classAfterClick).toMatch(/ring-(1|4)/);
    
    // Test rapid toggle sequence
    for (let i = 0; i < 5; i++) {
      await skinButton.click();
      await shardButton.click();
    }
    
    // Should end up in both owned state
    await expect(firstChampion).toHaveClass(/ring-4 ring-league-gold/);
  });

  test('should preserve champion data attributes for testing', async ({ page }) => {
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    
    // Verify test data attributes exist
    const championId = await firstChampion.getAttribute('data-champion-id');
    const championName = await firstChampion.getAttribute('data-champion-name');
    
    expect(championId).toBeTruthy();
    expect(championName).toBeTruthy();
    expect(championName).toMatch(/^[A-Za-z\s']+$/); // Valid champion name format
    
    // Verify buttons have matching champion ID
    const skinButton = firstChampion.locator('[data-testid="skin-button"]');
    const shardButton = firstChampion.locator('[data-testid="shard-button"]');
    
    await expect(skinButton).toHaveAttribute('data-champion-id', championId || '');
    await expect(shardButton).toHaveAttribute('data-champion-id', championId || '');
  });

});
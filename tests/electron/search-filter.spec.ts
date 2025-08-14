import { test, expect } from '../utils/electron-helper';

test.describe('LoL Skin Tracker - Search & Filtering', () => {
  
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

  test('should filter by "All" showing all champions', async ({ page, mockApi }) => {
    // Click "All" filter (should be active by default)
    const allButton = page.locator('button:has-text("All")');
    await allButton.click();
    
    // Verify all champions are visible
    const championCards = page.locator('[data-testid="champion-card"]');
    const cardCount = await championCards.count();
    const expectedCount = mockApi.getExpectedChampionCount();
    expect(cardCount).toBe(expectedCount);
    
    // Verify results count display
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText(expectedCount.toString());
    
    // Verify button is active
    await expect(allButton).toHaveClass(/bg-league-gold/);
  });

  test('should filter by "Owned" showing only champions with skins', async ({ page, mockApi }) => {
    // Toggle a few champions to owned state
    const champions = page.locator('[data-testid="champion-card"]');
    await champions.nth(0).locator('[data-testid="skin-button"]').click();
    await champions.nth(2).locator('[data-testid="skin-button"]').click();
    await champions.nth(4).locator('[data-testid="skin-button"]').click();
    
    // Click "Owned" filter
    const ownedButton = page.locator('button:has-text("Owned")');
    await ownedButton.click();
    
    // Should show only 3 champions
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(3);
    
    // All visible champions should have gold borders
    for (let i = 0; i < 3; i++) {
      await expect(visibleCards.nth(i)).toHaveClass(/ring-4 ring-league-gold/);
    }
    
    // Verify results count
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText('3');
    
    // Verify button is active
    await expect(ownedButton).toHaveClass(/bg-league-gold/);
  });

  test('should filter by "Missing" showing only champions without skins', async ({ page, mockApi }) => {
    // Toggle one champion to owned state
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Click "Missing" filter
    const missingButton = page.locator('button:has-text("Missing")');
    await missingButton.click();
    
    // Should show all except the owned one
    const expectedCount = mockApi.getExpectedChampionCount() - 1;
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(expectedCount);
    
    // All visible champions should have gray borders (unowned)
    const randomIndex = Math.floor(Math.random() * expectedCount);
    await expect(visibleCards.nth(randomIndex)).toHaveClass(/ring-1 ring-gray-600/);
    
    // Verify results count
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText(expectedCount.toString());
  });

  test('should filter by "Shards" showing only champions with shards', async ({ page, mockApi }) => {
    // Toggle a few champions to shard-only state
    const champions = page.locator('[data-testid="champion-card"]');
    await champions.nth(1).locator('[data-testid="shard-button"]').click();
    await champions.nth(3).locator('[data-testid="shard-button"]').click();
    
    // Click "Shards" filter
    const shardsButton = page.locator('button:has-text("Shards")');
    await shardsButton.click();
    
    // Should show only 2 champions
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(2);
    
    // All visible champions should have blue borders
    for (let i = 0; i < 2; i++) {
      await expect(visibleCards.nth(i)).toHaveClass(/ring-4 ring-league-blue/);
    }
    
    // Verify results count
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText('2');
  });

  test('should filter by "Both" showing champions with both skins and shards', async ({ page, mockApi }) => {
    // Toggle some champions to both owned
    const champions = page.locator('[data-testid="champion-card"]');
    await champions.nth(0).locator('[data-testid="skin-button"]').click();
    await champions.nth(0).locator('[data-testid="shard-button"]').click();
    await champions.nth(2).locator('[data-testid="skin-button"]').click();
    await champions.nth(2).locator('[data-testid="shard-button"]').click();
    
    // Click "Both" filter
    const bothButton = page.locator('button:has-text("Both")');
    await bothButton.click();
    
    // Should show only 2 champions
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(2);
    
    // All visible champions should have gold borders and both buttons active
    for (let i = 0; i < 2; i++) {
      await expect(visibleCards.nth(i)).toHaveClass(/ring-4 ring-league-gold/);
      await expect(visibleCards.nth(i).locator('[data-testid="skin-button"]')).toHaveClass(/bg-league-gold/);
      await expect(visibleCards.nth(i).locator('[data-testid="shard-button"]')).toHaveClass(/bg-league-blue/);
    }
  });

  test('should search champions by name', async ({ page, mockApi }) => {
    // Search for "Ahri" (should be in our mock data)
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await searchInput.fill('Ahri');
    
    // Should show only Ahri
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(1);
    
    // Verify it's actually Ahri
    await expect(visibleCards.first()).toHaveAttribute('data-champion-name', 'Ahri');
    
    // Verify results count
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText('1');
  });

  test('should search champions by partial name (case insensitive)', async ({ page, mockApi }) => {
    // Search for "aa" (should match Aatrox)
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await searchInput.fill('aa');
    
    // Should show champions containing "aa"
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    const cardCount = await visibleCards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Verify at least one result contains "aa" in the name
    const firstCard = visibleCards.first();
    const championName = await firstCard.getAttribute('data-champion-name');
    expect(championName?.toLowerCase()).toContain('aa');
  });

  test('should show no results for invalid search', async ({ page, mockApi }) => {
    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await searchInput.fill('InvalidChampionName');
    
    // Should show no champions
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(0);
    
    // Results count should show 0
    const resultsCount = page.locator('text=Showing:').locator('..').locator('span.text-league-gold');
    await expect(resultsCount).toContainText('0');
  });

  test('should clear search using clear button', async ({ page, mockApi }) => {
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    
    // Enter search term
    await searchInput.fill('Ahri');
    await expect(page.locator('[data-testid="champion-card"]:visible')).toHaveCount(1);
    
    // Click clear button (X)
    const clearButton = searchInput.locator('..').locator('button[title="Clear search"]');
    await clearButton.click();
    
    // Search should be cleared
    await expect(searchInput).toHaveValue('');
    
    // All champions should be visible again
    const expectedCount = mockApi.getExpectedChampionCount();
    await expect(page.locator('[data-testid="champion-card"]:visible')).toHaveCount(expectedCount);
  });

  test('should clear search using Escape key', async ({ page, mockApi }) => {
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    
    // Enter search term
    await searchInput.fill('Ahri');
    await expect(page.locator('[data-testid="champion-card"]:visible')).toHaveCount(1);
    
    // Focus search input and press Escape
    await searchInput.focus();
    await page.keyboard.press('Escape');
    
    // Search should be cleared
    await expect(searchInput).toHaveValue('');
    
    // All champions should be visible again
    const expectedCount = mockApi.getExpectedChampionCount();
    await expect(page.locator('[data-testid="champion-card"]:visible')).toHaveCount(expectedCount);
  });

  test('should use keyboard shortcut Ctrl+F to focus search', async ({ page, mockApi }) => {
    // Press Ctrl+F
    await page.keyboard.press('Control+f');
    
    // Search input should be focused
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await expect(searchInput).toBeFocused();
    
    // Should be able to type immediately
    await page.keyboard.type('Ahri');
    await expect(searchInput).toHaveValue('Ahri');
  });

  test('should combine search and filter functionality', async ({ page, mockApi }) => {
    // Set up test data: toggle some champions
    const champions = page.locator('[data-testid="champion-card"]');
    
    // Toggle Aatrox (first champion) to owned
    const aatroxCard = page.locator('[data-testid="champion-card"][data-champion-name="Aatrox"]');
    await aatroxCard.locator('[data-testid="skin-button"]').click();
    
    // Search for "A" (should include Aatrox, Ahri, etc.)
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await searchInput.fill('A');
    
    // Apply "Owned" filter
    const ownedButton = page.locator('button:has-text("Owned")');
    await ownedButton.click();
    
    // Should show only Aatrox (owned + starts with A)
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first()).toHaveAttribute('data-champion-name', 'Aatrox');
    
    // Verify it has gold border (owned)
    await expect(visibleCards.first()).toHaveClass(/ring-4 ring-league-gold/);
  });

  test('should maintain filter state when search changes', async ({ page, mockApi }) => {
    // Toggle a champion to owned
    const firstChampion = page.locator('[data-testid="champion-card"]').first();
    await firstChampion.locator('[data-testid="skin-button"]').click();
    
    // Apply "Owned" filter
    const ownedButton = page.locator('button:has-text("Owned")');
    await ownedButton.click();
    
    // Verify filter button remains active
    await expect(ownedButton).toHaveClass(/bg-league-gold/);
    
    // Change search
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await searchInput.fill('test');
    
    // Filter button should still be active
    await expect(ownedButton).toHaveClass(/bg-league-gold/);
    
    // Clear search
    await searchInput.fill('');
    
    // Should still show only owned champions
    const visibleCards = page.locator('[data-testid="champion-card"]:visible');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first()).toHaveClass(/ring-4 ring-league-gold/);
  });

});
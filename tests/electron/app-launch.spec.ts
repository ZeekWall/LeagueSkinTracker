import { test, expect } from '../utils/electron-helper';

test.describe('LoL Skin Tracker - App Launch', () => {
  
  test('should launch successfully with correct title', async ({ electronApp, page }) => {
    // Check if app launched
    expect(electronApp).toBeTruthy();
    
    // Wait for app to fully load first
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")', { timeout: 15000 });
    
    // Check if main content loads
    await expect(page.locator('h1')).toContainText('LoL Skin Tracker');
    await expect(page.locator('h1')).toContainText('v2.0');
    
    // Check window title (might be set by the HTML title element)
    const title = await page.title();
    expect(title).toContain('LoL Skin Tracker');
  });

  test('should load champion data', async ({ page, mockApi }) => {
    // Wait for loading to complete
    const loadingIndicator = page.locator('text=Loading Champions...');
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
    }
    
    // Check that champion data loaded
    const debugInfo = page.locator('#debug-info');
    await expect(debugInfo).toContainText('champions loaded');
    
    // Verify we have champion cards (expected count from mock data)
    const championCards = page.locator('[data-testid="champion-card"]');
    const cardCount = await championCards.count();
    const expectedCount = mockApi.getExpectedChampionCount();
    expect(cardCount).toBe(expectedCount);
  });

  test('should display correct UI elements', async ({ page }) => {
    // Wait for app to load
    await page.waitForSelector('h1:has-text("LoL Skin Tracker")');
    
    // Check main UI components exist
    await expect(page.locator('text=Collection Progress')).toBeVisible();
    await expect(page.locator('input[placeholder="Search champions..."]')).toBeVisible();
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Owned")')).toBeVisible();
    await expect(page.locator('button:has-text("Missing")')).toBeVisible();
    await expect(page.locator('button:has-text("Shards")')).toBeVisible();
    await expect(page.locator('button:has-text("Both")')).toBeVisible();
  });

  test('should have working keyboard shortcut for search', async ({ page }) => {
    // Wait for app to load
    await page.waitForSelector('input[placeholder="Search champions..."]');
    
    // Press Ctrl+F to focus search
    await page.keyboard.press('Control+f');
    
    // Check if search input is focused
    const searchInput = page.locator('input[placeholder="Search champions..."]');
    await expect(searchInput).toBeFocused();
  });

});
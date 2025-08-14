import { test as base, ElectronApplication, Page, _electron as electron } from '@playwright/test';
import path from 'path';
import { MockApiService } from './mock-api';

export interface ElectronFixtures {
  electronApp: ElectronApplication;
  page: Page;
  mockApi: MockApiService;
}

/**
 * Fixture that launches the Electron app and provides access to the main window
 */
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    // Launch Electron app
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '../../build/electron/main.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    });

    // Wait for the first window to be created
    await electronApp.firstWindow();
    
    await use(electronApp);
    
    // Clean up
    await electronApp.close();
  },

  page: async ({ electronApp }, use) => {
    // Get the first (and usually only) window
    const page = await electronApp.firstWindow();
    
    await use(page);
  },

  mockApi: async ({ page }, use) => {
    // Create mock API service and set up mocking BEFORE page loads
    const mockApi = new MockApiService(page);
    await mockApi.setupMocking();
    
    // Now wait for the app to be ready with mocked APIs
    await page.waitForLoadState('domcontentloaded');
    
    await use(mockApi);
    
    // Clean up after test
    await mockApi.disableMocking();
  },
});

export { expect } from '@playwright/test';
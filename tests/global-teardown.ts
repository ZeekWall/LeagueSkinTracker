import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  // Clean up any global resources here
  
  console.log('✅ Global teardown complete');
}

export default globalTeardown;
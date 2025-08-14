import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Ensure the app is built
  console.log('📦 Ensuring app is built...');
  
  // You can add any global setup here, like:
  // - Building the app
  // - Starting test databases
  // - Setting up test data
  
  console.log('✅ Global setup complete');
}

export default globalSetup;
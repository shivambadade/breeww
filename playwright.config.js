import { defineConfig, devices } from '@playwright/test';

const appUrl = process.env.TARGET_URL || 'http://localhost:5174';
const appPort = new URL(appUrl).port || '5174';
const authFile = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: authFile },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], storageState: authFile },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: `npm run dev -- --host 0.0.0.0 --port ${appPort}`,
    url: appUrl,
    reuseExistingServer: !process.env.CI,
  },
});

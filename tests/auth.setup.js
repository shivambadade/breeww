import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test as setup } from '@playwright/test';

const appUrl = process.env.TARGET_URL || 'http://localhost:5174';
const testsDir = fileURLToPath(new URL('.', import.meta.url));
const authFile = path.join(testsDir, '..', 'playwright', '.auth', 'user.json');
const PLAYWRIGHT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6NDEwMjQ0NDgwMH0.playwright-signature';

setup('authenticate Breeww user', async ({ page }) => {
  mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto(`${appUrl}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((value) => {
    window.localStorage.setItem('userToken', value);
  }, PLAYWRIGHT_TOKEN);

  await page.context().storageState({ path: authFile });
});

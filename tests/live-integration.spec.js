import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5174';

test.describe('Live Backend Integration', () => {
  const timestamp = Date.now();
  const testEmail = `live_e2e_${timestamp}@example.com`;
  const testPassword = 'password123';

  test('should register, login, check balance, and fail to bet with 0 balance', async ({ page }) => {
    // 1. Register a new user
    await page.goto(`${TARGET_URL}/register`);
    
    // Switch to email method
    await page.getByRole('button', { name: 'Email address' }).click();

    // Fill in registration details
    await page.getByPlaceholder('Please enter the email address').fill(testEmail);
    await page.getByPlaceholder('Set password').fill(testPassword);
    await page.getByPlaceholder('Confirm password').fill(testPassword);
    
    // Check agreement
    await page.locator('input[type="checkbox"]').check();

    // Submit Registration
    await page.getByRole('button', { name: 'Register' }).click();

    // Expect navigation to home page (or login, but the app navigates to '/' on success)
    await expect(page).toHaveURL(`${TARGET_URL}/`, { timeout: 10000 });

    // 2. The token is now in localStorage. Verify we are authenticated by checking for wallet balance.
    // The balance should be 0 for a new user.
    // In Breeww, balance might be shown in the wallet page or top bar, but we can just go to the game.

    await page.goto(`${TARGET_URL}/game/color-prediction`);
    await expect(page.getByTestId('wingo-title')).toBeVisible({ timeout: 15000 });

    // Ensure balance is loaded as 0 from the real backend
    await expect.poll(async () => {
      const text = await page.getByTestId('game-wallet-balance').innerText();
      return Number(text.replace(/[^\d]/g, ''));
    }, { timeout: 10000 }).toBe(0);

    // 3. Attempt to place a bet
    await page.getByRole('button', { name: 'Red' }).click();
    await page.getByTestId('bet-amount-input').fill('10');
    await page.getByTestId('place-bet-button').click();

    // 4. Expect backend validation to kick in since wallet is empty
    // The UI should show a toast or error message (often caught by the app and displayed)
    // We can check that the balance is STILL 0 and the bet was not placed (success overlay is NOT visible)
    await expect(page.getByTestId('wingo-bet-success')).toBeHidden();
    
    // Check if there's a visible error message toast or just balance remains 0
    await expect.poll(async () => {
      const text = await page.getByTestId('game-wallet-balance').innerText();
      return Number(text.replace(/[^\d]/g, ''));
    }).toBe(0);
  });
});

import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5174';
const PLAYWRIGHT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6NDEwMjQ0NDgwMH0.playwright-signature';
const DEFAULT_ROUND = {
  roundId: 501,
  roundNumber: 901,
  status: 'open',
  timerLeft: 28,
  totalPot: 4200,
  playersCount: 12,
  roundDuration: 30,
};
const DECLARED_AT = '2026-04-29T12:00:00.000Z';

test.describe.configure({ timeout: 90000 });

const parseBalance = async (page) => {
  const balanceText = await page.getByTestId('game-wallet-balance').innerText();
  return Number(balanceText.replace(/[^\d]/g, ''));
};

const readTimerSeconds = async (page) => {
  const timerText = await page.getByTestId('wingo-timer-text').textContent();
  return Number(String(timerText || '').split(':')[1]);
};

const buildOptionId = (type, value) => {
  const normalizedType = String(type || '').toLowerCase();
  const normalizedValue = String(value ?? '').toLowerCase();

  if (normalizedType === 'color' || normalizedType === 'colour') {
    return `color:${normalizedValue}`;
  }

  if (normalizedType === 'size') {
    return `size:${normalizedValue}`;
  }

  return `number:${normalizedValue}`;
};

const createStepReader = (steps, fallbackValue) => {
  let index = 0;
  return () => {
    if (!steps?.length) {
      return fallbackValue;
    }

    const value = steps[Math.min(index, steps.length - 1)];
    index += 1;
    return value;
  };
};

const installColourPredictionMocks = async (page, {
  balance = 10000,
  currentRoundSequence = [DEFAULT_ROUND],
  historySequence = [[]],
} = {}) => {
  const state = {
    balance,
    totalPot: Number(currentRoundSequence.find(Boolean)?.totalPot ?? DEFAULT_ROUND.totalPot),
    nextCurrentRound: createStepReader(currentRoundSequence, null),
    nextHistory: createStepReader(historySequence, []),
    betCount: 0,
  };

  await page.route('**/api/auth/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          user: {
            id: 1,
            username: 'playwright-user',
            balance: state.balance,
          },
        },
      }),
    });
  });

  await page.route('**/api/games/catalog', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: 'colour',
            name: 'Colour Prediction',
            status: 'active',
            settings: {
              enabled: true,
              maintenanceMode: false,
            },
          },
        ],
      }),
    });
  });

  await page.route('**/api/games/colour/round/current', async (route) => {
    const round = state.nextCurrentRound();
    if (!round) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'No active round found' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          ...round,
          totalPot: state.totalPot,
        },
      }),
    });
  });

  await page.route('**/api/games/colour/round/history', async (route) => {
    const historyRows = state.nextHistory();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: historyRows,
      }),
    });
  });

  await page.route('**/api/games/colour/round/bet', async (route) => {
    const request = route.request().postDataJSON();
    const amount = Number(request.amount) || 0;

    state.balance -= amount;
    state.totalPot += amount;
    state.betCount += 1;

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          betId: `bet-${state.betCount}`,
          roundId: DEFAULT_ROUND.roundId,
          optionId: buildOptionId(request.type, request.value),
          amount,
          balanceAfter: state.balance,
          totalPot: state.totalPot,
          timerLeft: DEFAULT_ROUND.timerLeft - 1,
        },
      }),
    });
  });
};

const openGame = async (page, mockOptions = {}) => {
  await installColourPredictionMocks(page, mockOptions);
  await page.addInitScript((value) => {
    window.localStorage.setItem('userToken', value);
  }, PLAYWRIGHT_TOKEN);
  await page.goto(`${TARGET_URL}/game/color-prediction`, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/game\/color-prediction\/?$/);
  await expect(page.getByTestId('wingo-title')).toHaveText('WinGo 30s');
};

test.describe('WinGo 30s (Color Prediction) Game', () => {
  test('should display live balance and current round header', async ({ page }) => {
    await openGame(page);

    await expect(page.getByTestId('wingo-title')).toBeVisible();
    await expect(page.getByTestId('wingo-period')).toHaveText('901');
    await expect.poll(() => parseBalance(page)).toBe(10000);
    await expect(page.getByText('Live Backend')).toBeVisible();
  });

  test('should have a working countdown timer', async ({ page }) => {
    await openGame(page);

    const initialSeconds = await readTimerSeconds(page);
    await page.waitForTimeout(2000);
    const updatedSeconds = await readTimerSeconds(page);
    expect(updatedSeconds).not.toBe(initialSeconds);
  });

  test('should allow placing a bet and refresh balance from the backend', async ({ page }) => {
    await openGame(page);

    const initialBalance = await parseBalance(page);
    await page.getByRole('button', { name: 'Red' }).click();
    await page.getByTestId('bet-amount-input').fill('100');
    await page.getByTestId('place-bet-button').click();
    await expect(page.getByTestId('wingo-bet-success')).toBeVisible();
    await expect.poll(() => parseBalance(page)).toBe(initialBalance - 100);
  });

  test('should block betting during the close window', async ({ page }) => {
    await openGame(page, {
      currentRoundSequence: [{ ...DEFAULT_ROUND, timerLeft: 5 }],
    });

    await expect(page.getByTestId('wingo-countdown-overlay')).toBeVisible();
    await expect(page.getByTestId('place-bet-button')).toBeDisabled();
  });

  test('should update game history after the backend settles the round', async ({ page }) => {
    await openGame(page, {
      currentRoundSequence: [
        DEFAULT_ROUND,
        DEFAULT_ROUND,
        null,
      ],
      historySequence: [
        [],
        [],
        [
          {
            roundId: DEFAULT_ROUND.roundId,
            roundNumber: DEFAULT_ROUND.roundNumber,
            result: '7',
            totalPot: 4300,
            adminSet: true,
            createdAt: DECLARED_AT,
          },
        ],
      ],
    });

    await expect
      .poll(() => page.getByTestId('wingo-history-row').count(), { timeout: 45000 })
      .toBe(1);
    await expect(page.getByTestId('wingo-history-row').first()).toContainText('901');
  });
});

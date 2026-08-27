const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const requestJsonWithRetry = async (url, options = {}, attempts = 3) => {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const res = await fetch(url, options);
      const body = await res.json().catch(() => ({}));

      if (!res.ok && RETRYABLE_STATUSES.has(res.status) && index < attempts - 1) {
        await wait(250 * (index + 1));
        continue;
      }

      return {
        ok: res.ok,
        status: res.status,
        body,
      };
    } catch (error) {
      if (index === attempts - 1) {
        throw error;
      }
      await wait(250 * (index + 1));
    }
  }

  return null;
};

export const fetchGamesCatalog = async () => {
  try {
    const response = await requestJsonWithRetry(`${baseUrl}/games/catalog`);
    if (!response?.ok || !response.body?.success) return [];
    return response.body.data || [];
  } catch {
    return [];
  }
};

export const fetchCurrentRound = async (gameId) => {
  const response = await requestJsonWithRetry(`${baseUrl}/games/${gameId}/round/current`);
  if (response?.status === 404) {
    return null;
  }

  if (!response?.ok || !response.body?.success) {
    throw new Error(response?.body?.message || 'Unable to load the current round');
  }

  return response.body.data || null;
};

export const fetchGameHistory = async (gameId) => {
  const response = await requestJsonWithRetry(`${baseUrl}/games/${gameId}/round/history`);
  if (!response?.ok || !response.body?.success) {
    throw new Error(response?.body?.message || 'Unable to load round history');
  }

  return response.body.data || [];
};

export const submitBet = async (betData) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Not authenticated');
  
  const response = await requestJsonWithRetry(`${baseUrl}/games/${betData.gameId}/round/bet`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(betData)
  }, 1);

  if (!response?.ok || !response.body?.success) {
    throw new Error(response?.body?.message || 'Unable to place bet');
  }

  return response.body;
};

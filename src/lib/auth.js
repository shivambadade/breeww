import { normalizePath, pageHref } from './navigation';

const USER_TOKEN_KEY = 'userToken';
const SESSION_PROFILE_PATH = '/auth/profile';

const decodeJwtPayload = (token) => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

export const getStoredUserToken = () => {
  try {
    return localStorage.getItem(USER_TOKEN_KEY)?.trim() || '';
  } catch {
    return '';
  }
};

export const storeUserToken = (token) => {
  if (!token) return;
  localStorage.setItem(USER_TOKEN_KEY, String(token).trim());
};

export const clearUserSession = ({ redirectTo, replace = true } = {}) => {
  localStorage.removeItem(USER_TOKEN_KEY);

  if (!redirectTo) return;

  const targetPath = normalizePath(redirectTo);
  if (normalizePath(window.location.pathname) === targetPath) return;

  const destination = pageHref(targetPath);
  if (replace) {
    window.location.replace(destination);
    return;
  }

  window.location.assign(destination);
};

export const hasFreshUserToken = () => {
  const token = getStoredUserToken();
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;

  return payload.exp * 1000 > Date.now();
};

export const validateStoredUserSession = async () => {
  const token = getStoredUserToken();
  if (!token) return false;

  if (!hasFreshUserToken()) {
    clearUserSession();
    return false;
  }

  const baseUrl = String(import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

  try {
    const response = await fetch(`${baseUrl}${SESSION_PROFILE_PATH}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (response.status === 401 || response.status === 403) {
      clearUserSession();
      return false;
    }

    if (!response.ok) {
      clearUserSession();
      return false;
    }

    const data = await response.json();
    if (!data?.success) {
      clearUserSession();
      return false;
    }

    return true;
  } catch {
    clearUserSession();
    return false;
  }
};

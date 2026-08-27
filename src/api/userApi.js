import { clearUserSession, getStoredUserToken, storeUserToken } from '../lib/auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const loginUser = async (credentials) => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  storeUserToken(data.data.token);
  return data.data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  storeUserToken(data.data.token);
  return data.data;
};

export const getUserProfile = async () => {
  const token = getStoredUserToken();
  if (!token) return { id: null, name: 'Guest' };
  
  try {
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) {
      clearUserSession({ redirectTo: '/login' });
      return { id: null, name: 'Guest' };
    }
    return data.data.user;
  } catch(e) {
    clearUserSession({ redirectTo: '/login' });
    return { id: null, name: 'Guest' };
  }
};

export const updateSettings = async (settings) => {
  return { success: true };
};

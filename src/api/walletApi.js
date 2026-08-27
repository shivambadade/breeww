const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const getBalance = async () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) return null;
    return parseFloat(data.data.user.balance) || 0;
  } catch {
    return null;
  }
};

export const updateBalance = async (amount) => {
  return { success: true, newBalance: amount };
};

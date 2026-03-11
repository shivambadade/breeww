export const getBalance = async () => {
  return 10000;
};

export const updateBalance = async (amount) => {
  return { success: true, newBalance: 10000 + amount };
};

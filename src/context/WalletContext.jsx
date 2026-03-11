import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(10000); // Initial balance ₹10,000

  const placeBet = (amount) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addWin = (amount) => {
    setBalance((prev) => prev + (Number(amount) || 0));
  };

  const deductLoss = (amount) => {
    setBalance((prev) => prev - (Number(amount) || 0));
  };

  return (
    <WalletContext.Provider value={{ balance, placeBet, addWin, deductLoss }}>
      {children}
    </WalletContext.Provider>
  );
};

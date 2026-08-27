/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getBalance } from '../api/walletApi';

const WalletContext = createContext();
const INITIAL_BALANCE = 0;

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const refreshBalance = useCallback(async () => {
    const nextBalance = await getBalance();
    if (Number.isFinite(nextBalance)) {
      setBalance(nextBalance);
    }
    setIsWalletLoading(false);
    return nextBalance;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBalance = async () => {
      const nextBalance = await getBalance();
      if (!isMounted) return;

      if (Number.isFinite(nextBalance)) {
        setBalance(nextBalance);
      }
      setIsWalletLoading(false);
    };

    loadBalance();

    return () => {
      isMounted = false;
    };
  }, []);

  const placeBet = useCallback((amount) => {
    const wager = Number(amount);
    if (!Number.isFinite(wager) || wager <= 0 || balance < wager) {
      return false;
    }

    setBalance((prev) => prev - wager);
    return true;
  }, [balance]);

  const addWin = useCallback((amount) => {
    const payout = Number(amount);
    if (!Number.isFinite(payout) || payout <= 0) return;
    setBalance((prev) => prev + payout);
  }, []);

  const deductLoss = useCallback((amount) => {
    const loss = Number(amount);
    if (!Number.isFinite(loss) || loss <= 0) return;
    setBalance((prev) => Math.max(0, prev - loss));
  }, []);

  return (
    <WalletContext.Provider value={{ balance, placeBet, addWin, deductLoss, refreshBalance, isWalletLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

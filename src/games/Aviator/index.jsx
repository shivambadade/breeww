import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Info, HelpCircle } from 'lucide-react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../hooks/useWallet';
import { useBets } from '../../hooks/useBets';
import { formatINR } from '../../utils/formatCurrency';
import AviatorGraph from './AviatorGraph';
import AviatorControls from './AviatorControls';
import AviatorHistory from './AviatorHistory';
import AviatorSidebar from './AviatorSidebar';

const Aviator = () => {
  const { balance, placeBet, addWin } = useWallet();
  const { addBet, clearBets } = useBets();

  // Game States
  const [gameState, setGameState] = useState('waiting'); // waiting, running, crashed
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashAt, setCrashAt] = useState(0);
  const [history, setHistory] = useState([
    { id: 1, multiplier: 1.39 },
    { id: 2, multiplier: 2.08 },
    { id: 3, multiplier: 1.60 },
    { id: 4, multiplier: 1.00 },
    { id: 5, multiplier: 1.74 },
    { id: 6, multiplier: 26.70 },
    { id: 7, multiplier: 2.52 },
  ]);

  // Betting States
  const [betAmount, setBetAmount] = useState(100);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [allBets, setAllBets] = useState([]);

  // Mock initial bets
  useEffect(() => {
    const mockUsers = ['x***6', 'a***9', 'x***1', 'm***9', 'w***8', 'z***8', 'f***e', 'y***8'];
    const initialBets = mockUsers.map((user, i) => ({
      id: i,
      user,
      amount: Math.floor(Math.random() * 5000) + 1000,
      hasCashedOut: false,
      cashoutMult: 0
    }));
    setAllBets(initialBets);
  }, []);

  // Game Loop Simulation
  useEffect(() => {
    let interval;
    if (gameState === 'running') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        // Exponential-like growth formula for multiplier
        const newMultiplier = Math.pow(Math.E, 0.06 * elapsed);
        
        if (newMultiplier >= crashAt) {
          setMultiplier(crashAt);
          setGameState('crashed');
          clearInterval(interval);
        } else {
          setMultiplier(newMultiplier);
          
          // Randomly cash out some mock users
          setAllBets(prev => prev.map(bet => {
            if (!bet.hasCashedOut && Math.random() < 0.01 && newMultiplier > 1.2) {
              return { ...bet, hasCashedOut: true, cashoutMult: newMultiplier };
            }
            return bet;
          }));
        }
      }, 50);
    }

    if (gameState === 'waiting') {
      setMultiplier(1.0);
      setHasCashedOut(false);
      setIsBetPlaced(false);
      // Reset mock bets for new round
      setAllBets(prev => prev.map(bet => ({ ...bet, hasCashedOut: false, cashoutMult: 0 })));
      
      const timer = setTimeout(() => {
        // Generate random crash point following a crash game distribution
        // Probability of crashing at x is roughly 1/x
        const r = Math.random();
        const crash = 0.99 / (1 - r);
        setCrashAt(Math.max(1.0, crash));
        setGameState('running');
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (gameState === 'crashed') {
      setHistory(prev => [{ id: Date.now(), multiplier }, ...prev].slice(0, 15));
      const timer = setTimeout(() => {
        setGameState('waiting');
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [gameState, crashAt]);

  const handlePlaceBet = useCallback((amount) => {
    if (gameState === 'running' && !isBetPlaced) {
      // Allow betting during run for NEXT round
      setIsBetPlaced(true);
      setShowBetSuccess(true);
      setTimeout(() => setShowBetSuccess(false), 2000);
      return;
    }
    if (gameState !== 'waiting' || isBetPlaced) return;
    if (amount <= 0 || amount > balance) return;

    if (placeBet(amount)) {
      setIsBetPlaced(true);
      setShowBetSuccess(true);
      setTimeout(() => setShowBetSuccess(false), 2000);
      addBet({
        type: 'aviator',
        amount,
        target: 'crash'
      });
    }
  }, [gameState, isBetPlaced, balance, placeBet, addBet]);

  const handleCashout = useCallback(() => {
    if (gameState === 'running' && isBetPlaced && !hasCashedOut) {
      const winAmount = betAmount * multiplier;
      addWin(winAmount);
      setHasCashedOut(true);
      // Update our bet in the sidebar (simulated)
      setAllBets(prev => [{
        id: 'me',
        user: 'You',
        amount: betAmount,
        hasCashedOut: true,
        cashoutMult: multiplier
      }, ...prev]);
    }
  }, [gameState, isBetPlaced, hasCashedOut, betAmount, multiplier, addWin]);

  return (
    <GameLayout title="AVIATOR" isWide={true} hideBetPanel={true}>
      <div className="flex flex-col lg:flex-row gap-4 max-w-[1600px] mx-auto w-full pb-10">
        
        {/* Left Sidebar - Bets List */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <AviatorSidebar allBets={allBets} />
        </div>

        {/* Center Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Multiplier History */}
          <AviatorHistory history={history} />

          {/* Graph Section */}
          <div className="flex-1 min-h-[350px] md:min-h-[450px]">
            <AviatorGraph multiplier={multiplier} gameState={gameState} />
          </div>

          {/* Betting Controls */}
          <AviatorControls 
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onPlaceBet={handlePlaceBet}
            onCashout={handleCashout}
            gameState={gameState}
            isBetPlaced={isBetPlaced}
            hasCashedOut={hasCashedOut}
            multiplier={multiplier}
          />

          {/* Small screens sidebar (collapsible/below) */}
          <div className="lg:hidden mt-6">
            <AviatorSidebar allBets={allBets} />
          </div>
        </div>

      </div>

      {/* Bet Success Toast */}
      <AnimatePresence>
        {showBetSuccess && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#28a745] px-10 py-5 rounded-2xl shadow-[0_0_50px_rgba(40,167,69,0.5)] font-black text-white uppercase tracking-widest border border-green-400">
              Bet Placed Successfully
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cashout Success Overlay */}
      <AnimatePresence>
        {hasCashedOut && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-[70] pb-40 lg:pb-0"
          >
            <div className="bg-green-600 px-10 py-5 rounded-2xl shadow-[0_0_50px_rgba(22,163,74,0.5)] border-2 border-green-400 text-center backdrop-blur-sm bg-opacity-90">
              <div className="text-white text-xs font-black uppercase tracking-widest mb-1">You cashed out at</div>
              <div className="text-4xl font-black text-white italic tracking-tighter mb-1">
                {multiplier.toFixed(2)}x
              </div>
              <div className="text-white font-black text-2xl drop-shadow-md">
                {formatINR(betAmount * multiplier)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
};

export default Aviator;

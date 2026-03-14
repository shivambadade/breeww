import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, History, CheckCircle2, Info, TrendingUp, Minus, Plus, RefreshCw } from 'lucide-react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../hooks/useWallet';
import { useBets } from '../../hooks/useBets';
import { formatINR } from '../../utils/formatCurrency';
import MineGrid from './MineGrid';
import MineControls from './MineControls';

const Mines = () => {
  const { balance, placeBet, addWin } = useWallet();
  const { bets, addBet, clearBets, totalBetAmount } = useBets();

  // Game State
  const [mineCount, setMineCount] = useState(3);
  const [betAmount, setBetAmount] = useState(100);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle', 'playing', 'ended'
  const [tiles, setTiles] = useState(Array(25).fill('hidden'));
  const [minePositions, setMinePositions] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [lastWin, setLastWin] = useState(null);
  const [autoGame, setAutoGame] = useState(false);

  // Multiplier logic: 1 + openedTiles * 0.2
  // We'll use a slightly adjusted one that scales with mine count for better gameplay
  // But we'll follow the user's provided example base.
  const calculateMultiplier = (opened) => {
    if (opened === 0) return 1;
    // Base formula from prompt: 1 + openedTiles * 0.2
    // We add a small bonus for more mines to make it fair
    const mineBonus = mineCount / 3;
    return 1 + (opened * 0.2 * mineBonus);
  };

  useEffect(() => {
    setMultiplier(calculateMultiplier(revealedCount));
  }, [revealedCount, mineCount]);

  const startGame = (amount) => {
    if (amount <= 0 || amount > balance) return;

    if (placeBet(amount)) {
      // Generate mines
      const newMines = [];
      while (newMines.length < mineCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!newMines.includes(pos)) newMines.push(pos);
      }

      setMinePositions(newMines);
      setTiles(Array(25).fill('hidden'));
      setRevealedCount(0);
      setGameStatus('playing');
      setLastWin(null);
      
      addBet({
        type: 'mines',
        amount,
        mines: mineCount
      });
    }
  };

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing' || tiles[index] !== 'hidden') return;

    if (minePositions.includes(index)) {
      // Hit a mine!
      const newTiles = [...tiles];
      minePositions.forEach(pos => {
        newTiles[pos] = pos === index ? 'mine' : 'mine-revealed';
      });
      setTiles(newTiles);
      setGameStatus('ended');
      setGameHistory(prev => [{
        id: Date.now(),
        mines: mineCount,
        revealed: revealedCount,
        outcome: 'Loss',
        profit: -betAmount
      }, ...prev].slice(0, 10));
      
      setTimeout(() => clearBets(), 2000);
    } else {
      // Safe!
      const newTiles = [...tiles];
      newTiles[index] = 'safe';
      setTiles(newTiles);
      setRevealedCount(prev => prev + 1);
      
      // Auto-win if all safe tiles are found
      if (revealedCount + 1 === 25 - mineCount) {
        cashOut();
      }
    }
  };

  const cashOut = () => {
    if (gameStatus !== 'playing' || revealedCount === 0) return;

    const currentMultiplier = calculateMultiplier(revealedCount);
    const winAmount = betAmount * currentMultiplier;
    
    addWin(winAmount);
    setLastWin(winAmount);
    setGameStatus('ended');

    // Reveal all mines (as hidden/dimmed)
    const newTiles = [...tiles];
    minePositions.forEach(pos => {
      if (newTiles[pos] === 'hidden') {
        newTiles[pos] = 'mine-revealed';
      }
    });
    setTiles(newTiles);

    setGameHistory(prev => [{
      id: Date.now(),
      mines: mineCount,
      revealed: revealedCount,
      outcome: 'Win',
      profit: winAmount - betAmount
    }, ...prev].slice(0, 10));

    setTimeout(() => clearBets(), 3000);
  };

  const handleRandom = () => {
    const opts = [1, 3, 5, 8, 10];
    setMineCount(opts[Math.floor(Math.random() * opts.length)]);
  };

  useEffect(() => {
    if (autoGame && gameStatus === 'ended') {
      const delay = setTimeout(() => {
        if (balance > 0) {
          startGame(Math.max(10, Math.min(100, balance)));
        }
      }, 1500);
      return () => clearTimeout(delay);
    }
  }, [autoGame, gameStatus, balance]);

  return (
    <GameLayout title="MINES" isWide={true} hideHeader hideBetPanel>
      <div className="bg-gradient-to-br from-[#0f57c7] via-[#0f65e1] to-[#1571ff] min-h-screen text-white p-2 md:p-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/20 bg-[#0b3f95]/80 p-3 md:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0e3b90] border border-blue-500/30 rounded-2xl p-2 md:p-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
              <div className="bg-[#143f82] px-2 py-1 rounded-full">MINES</div>
              <div className="bg-[#f7a93b] px-2 py-1 rounded-full text-black">How to Play?</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-black">
              <div className="bg-[#143f82] px-2 py-1 rounded-full">Mines: {mineCount}</div>
              <div className="bg-[#f7a93b] px-2 py-1 rounded-full text-black">Next: {multiplier.toFixed(2)}x</div>
            </div>
            <div className="text-xs font-black">{formatINR(balance)}</div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/20 bg-[#103e9d]/90 p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-xs font-black uppercase tracking-[0.15em] text-slate-200">Mines: {mineCount}</div>
              <div className="flex items-center gap-2">
                <button onClick={handleRandom} className="rounded-xl bg-[#1a4fbd] px-3 py-1 text-xs font-black uppercase">RANDOM</button>
                <button onClick={() => setAutoGame(!autoGame)} className={`rounded-xl px-3 py-1 text-xs font-black uppercase ${autoGame ? 'bg-green-400 text-black' : 'bg-[#1a4fbd] text-white'}`}>
                  Auto Game {autoGame ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            <div className="mt-3">
              <MineGrid tiles={tiles} onTileClick={handleTileClick} gameStatus={gameStatus} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[180px] rounded-xl border border-white/20 bg-[#0c2e78] p-2 text-center">
                <div className="text-[10px] uppercase tracking-[0.1em]">Bet INR</div>
                <div className="text-xl font-black">{(betAmount/100).toFixed(2)}</div>
              </div>
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="w-10 h-10 rounded-full bg-[#1f4ec2] flex items-center justify-center">-</button>
              <button onClick={() => setBetAmount(Math.min(balance, betAmount + 10))} className="w-10 h-10 rounded-full bg-[#1f4ec2] flex items-center justify-center">+</button>
              <button onClick={() => onStart(betAmount)} disabled={betAmount <= 0 || betAmount > balance} className="flex-1 rounded-xl bg-[#2dc329] text-black font-black py-2 uppercase">BET</button>
            </div>
          </div>

          <AnimatePresence>
            {lastWin && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-3 rounded-xl bg-green-500/90 p-2 text-center font-black">
                Big Win! {formatINR(lastWin)}
              </motion.div>
            )}
          </AnimatePresence>

          {bets.length > 0 && (
            <div className="mt-3 rounded-xl border border-white/20 bg-[#0d2a72] p-2 text-xs font-black uppercase tracking-[0.15em]">
              Active Bet: {formatINR(totalBetAmount)}
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
};

export default Mines;

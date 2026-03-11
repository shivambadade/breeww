import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, History, CheckCircle2, Info, TrendingUp } from 'lucide-react';
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

  return (
    <GameLayout title="MINES" isWide={true}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
        
        {/* Balance Section */}
        <div className="bg-[#141A3C]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 shadow-inner">
              <Wallet size={32} />
            </div>
            <div>
              <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Your Balance</div>
              <div className="text-3xl font-black text-white">{formatINR(balance)}</div>
            </div>
          </div>
          <button className="bg-indigo-600 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            Deposit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
          {/* Game Board Side */}
          <div className="order-2 lg:order-1 flex items-center justify-center">
            <MineGrid 
              tiles={tiles} 
              onTileClick={handleTileClick} 
              gameStatus={gameStatus}
              mines={minePositions}
            />
          </div>

          {/* Controls Side */}
          <div className="order-1 lg:order-2">
            <MineControls 
              gameStatus={gameStatus}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              mineCount={mineCount}
              setMineCount={setMineCount}
              onStart={startGame}
              onCashout={cashOut}
              revealedCount={revealedCount}
              multiplier={multiplier}
              balance={balance}
            />
          </div>
        </div>

        {/* Win Notification Overlay */}
        <AnimatePresence>
          {lastWin && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <div className="bg-green-600 px-12 py-6 rounded-3xl shadow-[0_0_50px_rgba(22,163,74,0.5)] border-2 border-green-400 text-center">
                <div className="text-white text-sm font-black uppercase tracking-widest mb-1">Big Win!</div>
                <div className="text-4xl font-black text-white italic tracking-tighter">
                  {formatINR(lastWin)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Bets */}
        <AnimatePresence>
          {bets.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-[#141A3C] rounded-2xl border border-white/5 shadow-xl overflow-hidden mt-4"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Active Bet</h3>
                </div>
                <div className="text-xs font-black text-white">
                  {formatINR(totalBetAmount)}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between bg-[#0B0F2A]/50">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Mines</span>
                    <span className="text-xs font-black text-white">{mineCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Status</span>
                    <span className="text-xs font-black text-indigo-400 animate-pulse uppercase">In Play</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Current Payout</span>
                  <span className="text-sm font-black text-green-400">{multiplier.toFixed(2)}x</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Table */}
        <div className="bg-[#141A3C] rounded-2xl border border-white/5 shadow-xl overflow-hidden mt-4">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <History size={16} className="text-casino-accent" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">Game History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/20">
                  <th className="px-5 py-3">Mines</th>
                  <th className="px-5 py-3">Tiles</th>
                  <th className="px-5 py-3">Outcome</th>
                  <th className="px-5 py-3 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gameHistory.length > 0 ? (
                  gameHistory.map((h) => (
                    <tr key={h.id} className="text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-md text-[10px]">
                          {h.mines} 💣
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md text-[10px]">
                          {h.revealed} 💎
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={h.outcome === 'Win' ? 'text-green-500' : 'text-red-500'}>
                          {h.outcome}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-right font-black ${h.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {h.profit >= 0 ? '+' : ''}{h.profit.toFixed(0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-gray-600 italic">
                      No game history yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </GameLayout>
  );
};

export default Mines;

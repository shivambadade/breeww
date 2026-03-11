import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Info, History, TrendingUp, TrendingDown, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, Copy, ExternalLink, HelpCircle } from 'lucide-react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../hooks/useWallet';
import { useBets } from '../../hooks/useBets';
import { formatINR } from '../../utils/formatCurrency';

const Dice = () => {
  const { balance, placeBet, addWin } = useWallet();
  const { bets, addBet, clearBets, totalBetAmount } = useBets();

  // Local state
  const [targetNumber, setTargetNumber] = useState(50.00);
  const [betAmount, setBetAmount] = useState('10.00');
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [winStatus, setWinStatus] = useState(null); // 'win', 'loss'
  const [encryptedResult, setEncryptedResult] = useState('edc86831f1e6f5cea82724493fe3a0746...');

  // Stats
  const houseEdge = 1; // 1% house edge
  const chanceUnder = targetNumber;
  const chanceOver = 100 - targetNumber;
  
  // Multipliers based on chance
  const multiplierUnder = (99 / chanceUnder).toFixed(4);
  const multiplierOver = (99 / chanceOver).toFixed(4);

  const handleBet = useCallback((type) => {
    const amount = Number(betAmount);
    if (amount <= 0 || amount > balance) return;
    if (isRolling) return;

    const currentMultiplier = type === 'under' ? multiplierUnder : multiplierOver;
    const currentChance = type === 'under' ? chanceUnder : chanceOver;

    if (placeBet(amount)) {
      addBet({
        type,
        target: targetNumber,
        amount,
        multiplier: currentMultiplier
      });
      setShowBetSuccess(true);
      setTimeout(() => setShowBetSuccess(false), 2000);

      setIsRolling(true);
      setResult(null);
      setWinStatus(null);

      // Generate a new mock hash for each round
      setEncryptedResult(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

      // Animation duration: 1.5 seconds
      setTimeout(() => {
        const rollResult = (Math.random() * 100).toFixed(2);
        setResult(parseFloat(rollResult));
        setIsRolling(false);

        // Evaluate win condition
        const isWin = type === 'under' 
          ? parseFloat(rollResult) < targetNumber 
          : parseFloat(rollResult) > targetNumber;

        if (isWin) {
          const winAmount = amount * parseFloat(currentMultiplier);
          addWin(winAmount);
          setWinStatus('win');
        } else {
          setWinStatus('loss');
        }

        // Add to history
        const historyEntry = {
          id: Date.now(),
          result: rollResult,
          type,
          target: targetNumber.toFixed(2),
          outcome: isWin ? 'Win' : 'Lose',
          profit: isWin ? (amount * (parseFloat(currentMultiplier) - 1)).toFixed(2) : `-${amount.toFixed(2)}`
        };
        setGameHistory(prev => [historyEntry, ...prev].slice(0, 10));

        // Cleanup after showing result
        setTimeout(() => {
          clearBets();
        }, 3000);
      }, 1500);
    }
  }, [betAmount, balance, isRolling, multiplierUnder, multiplierOver, chanceUnder, chanceOver, targetNumber, placeBet, addBet, addWin, clearBets]);

  return (
    <GameLayout title="DICE">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto pb-10">
        
        {/* Top bar like screenshot */}
        <div className="flex justify-between items-center bg-[#0B0F2A]/80 p-3 rounded-xl border border-white/5 mb-2">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                <HelpCircle size={14} />
                How to Play?
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-white font-black text-sm">{formatINR(balance)}</div>
             <div className="bg-[#141A3C] p-1.5 rounded-lg border border-white/10">
                <TrendingUp size={14} className="text-gray-400" />
             </div>
          </div>
        </div>

        {/* Dice Board Section */}
        <div className="bg-[#141A3C] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Encrypted Result Mock */}
          <div className="flex items-center gap-2 mb-8 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 font-bold">Encrypted Result:</span>
            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">{encryptedResult}</span>
            <Copy size={12} className="text-gray-500 cursor-pointer hover:text-white" />
            <RotateCcw size={12} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>

          {/* Main Number Display */}
          <div className="text-7xl font-black text-white mb-10 tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {isRolling ? (
               <motion.span
                 animate={{ opacity: [1, 0.5, 1] }}
                 transition={{ duration: 0.1, repeat: Infinity }}
               >
                 {(Math.random() * 100).toFixed(2)}
               </motion.span>
            ) : result !== null ? result.toFixed(2) : targetNumber.toFixed(2)}
          </div>

          {/* Custom Track (Dual Bar style) */}
          <div className="w-full relative px-4 mb-12">
            
            {/* Top Bar (Roll Over Visualization) */}
            <div className="h-6 w-full flex rounded-sm overflow-hidden mb-1 border border-black/40">
               <div className="bg-red-600/80 h-full transition-all duration-300" style={{ width: `${targetNumber}%` }}></div>
               <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${100 - targetNumber}%` }}></div>
            </div>

            {/* Bottom Bar (Roll Under Visualization) */}
            <div className="h-6 w-full flex rounded-sm overflow-hidden border border-black/40">
               <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${targetNumber}%` }}></div>
               <div className="bg-red-600/80 h-full transition-all duration-300" style={{ width: `${100 - targetNumber}%` }}></div>
            </div>

            {/* Scale/Ticks */}
            <div className="flex justify-between mt-1 text-[10px] font-bold text-gray-500/50 uppercase">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            {/* Slider Handle (Yellow Dot) */}
            <div 
              className="absolute left-4 right-4 h-12 top-0 pointer-events-none"
            >
               <motion.div 
                 animate={{ left: `${targetNumber}%` }}
                 className="absolute -top-1 -translate-x-1/2 w-8 h-14 flex items-center justify-center pointer-events-auto cursor-pointer group"
               >
                  <div className="w-5 h-5 bg-[#FFD700] rounded-full border-4 border-[#141A3C] shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-transform flex items-center justify-center">
                     <div className="w-1 h-1 bg-black rounded-full"></div>
                  </div>
               </motion.div>
            </div>

            {/* Transparent input for slider control */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.01"
              value={targetNumber}
              onChange={(e) => setTargetNumber(parseFloat(e.target.value))}
              disabled={isRolling}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Payout/Potential Win/Chance panel */}
          <div className="w-full bg-black/30 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">Payout</span>
                <div className="bg-[#0B0F2A] px-6 py-2 rounded-xl text-sm font-black text-white border border-white/5">
                   {multiplierUnder}x
                </div>
             </div>
             
             {/* Visual Divider/Slider Element (Mock) */}
             <div className="h-8 w-px bg-white/10 mx-4"></div>

             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">Potential win:</span>
                <div className="text-sm font-black text-white">
                   {(Number(betAmount) * multiplierUnder).toFixed(2)} INI
                </div>
             </div>

             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">Chance:</span>
                <div className="text-sm font-black text-white">
                   {chanceUnder.toFixed(1)}%
                </div>
             </div>
          </div>
        </div>

        {/* Betting Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          
          {/* Bet Amount Input */}
          <div className="md:col-span-2 bg-[#141A3C] p-2 rounded-2xl border border-white/5 flex items-center gap-2">
             <div className="bg-[#0B0F2A] px-4 py-2 rounded-xl text-[10px] font-black text-gray-500 uppercase">Bet</div>
             <input
               type="text"
               value={betAmount}
               onChange={(e) => setBetAmount(e.target.value)}
               className="bg-transparent flex-1 py-3 text-lg font-black text-white focus:outline-none"
             />
             <div className="flex gap-1 pr-2">
                <button 
                  onClick={() => setBetAmount((prev) => (Math.max(0, parseFloat(prev) - 10)).toFixed(2))}
                  className="w-8 h-8 rounded-lg bg-[#0B0F2A] flex items-center justify-center text-gray-400 hover:text-white border border-white/5"
                >
                  -
                </button>
                <div className="w-8 h-8 rounded-lg bg-[#0B0F2A] flex items-center justify-center text-gray-400">
                   <RotateCcw size={14} />
                </div>
                <button 
                  onClick={() => setBetAmount((prev) => (parseFloat(prev) + 10).toFixed(2))}
                  className="w-8 h-8 rounded-lg bg-[#0B0F2A] flex items-center justify-center text-gray-400 hover:text-white border border-white/5"
                >
                  +
                </button>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:col-span-2">
             <button 
               className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95"
               onClick={() => setTargetNumber(50)}
             >
                <RotateCcw size={20} />
             </button>
             
             {/* Roll Under Button */}
             <button
               onClick={() => handleBet('under')}
               disabled={isRolling || !betAmount || Number(betAmount) <= 0 || Number(betAmount) > balance}
               className={`flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 relative overflow-hidden group ${
                 isRolling ? 'opacity-50 grayscale' : 'bg-gradient-to-b from-[#00D1B2] to-[#00A38B] hover:shadow-[0_0_20px_rgba(0,209,178,0.3)] shadow-[0_4px_0_#007D6B]'
               }`}
             >
                <TrendingDown size={18} className="text-white mb-0.5" />
                <span className="text-sm font-black text-white leading-none">{targetNumber.toFixed(1)}</span>
             </button>

             {/* Roll Over Button */}
             <button
               onClick={() => handleBet('over')}
               disabled={isRolling || !betAmount || Number(betAmount) <= 0 || Number(betAmount) > balance}
               className={`flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 relative overflow-hidden group ${
                 isRolling ? 'opacity-50 grayscale' : 'bg-gradient-to-b from-[#0094FF] to-[#0075CC] hover:shadow-[0_0_20px_rgba(0,148,255,0.3)] shadow-[0_4px_0_#005999]'
               }`}
             >
                <TrendingUp size={18} className="text-white mb-0.5" />
                <span className="text-sm font-black text-white leading-none">{(100 - targetNumber).toFixed(1)}</span>
             </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-[#141A3C] rounded-2xl border border-white/5 shadow-xl overflow-hidden mt-6">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <History size={16} className="text-casino-accent" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/20">
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Bet Type</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Profit</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gameHistory.length > 0 ? (
                  gameHistory.map((h) => (
                    <tr key={h.id} className="text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-black">{h.result}</td>
                      <td className="px-4 py-3 uppercase">
                        <span className={h.type === 'under' ? 'text-green-500' : 'text-blue-500'}>{h.type}</span>
                      </td>
                      <td className="px-4 py-3">{h.target}</td>
                      <td className={`px-4 py-3 ${h.outcome === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                        {h.profit} INI
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 text-[10px]">
                        {new Date(h.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-gray-600 italic">
                      Start rolling to see your history
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

export default Dice;

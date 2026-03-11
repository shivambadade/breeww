import React from 'react';
import { motion } from 'framer-motion';

const MineControls = ({
  gameStatus,
  betAmount,
  setBetAmount,
  mineCount,
  setMineCount,
  onStart,
  onCashout,
  revealedCount,
  multiplier,
  balance
}) => {
  const isPlaying = gameStatus === 'playing';

  return (
    <div className="bg-[#141A3C]/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/5 space-y-8 h-full flex flex-col justify-center">
      {/* Multiplier / Stats display while playing */}
      {isPlaying && (
        <div className="text-center space-y-2 py-4 bg-[#0B0F2A] rounded-xl border border-indigo-500/20 shadow-inner">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Current Multiplier
          </div>
          <motion.div
            key={multiplier}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]"
          >
            {multiplier.toFixed(2)}x
          </motion.div>
          <div className="text-gray-500 text-[10px] uppercase font-bold">
            Safe Tiles: {revealedCount}
          </div>
        </div>
      )}

      {/* Settings when not playing */}
      {!isPlaying && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block ml-1">
              Number of Mines
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 8, 10].map(count => (
                <button
                  key={count}
                  onClick={() => setMineCount(count)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                    mineCount === count
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0B0F2A] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/20'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block ml-1">
              Bet Amount
            </label>
            <div className="flex items-center gap-3 bg-[#0B0F2A] rounded-xl p-2 border border-white/5 shadow-inner">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 hover:bg-white/5"
              >
                -
              </button>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                className="flex-1 bg-transparent text-center font-black text-lg text-white focus:outline-none"
              />
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 hover:bg-white/5"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map(val => (
                <button
                  key={val}
                  onClick={() => setBetAmount(val)}
                  className="py-2 rounded-lg bg-[#0B0F2A] border border-white/5 text-[10px] font-black text-gray-400 hover:text-white transition-all"
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2">
        {!isPlaying ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(betAmount)}
            disabled={betAmount <= 0 || betAmount > balance}
            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-xl
              ${betAmount <= 0 || betAmount > balance
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
              }
            `}
          >
            Start Game
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCashout}
            disabled={revealedCount === 0}
            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-xl
              ${revealedCount === 0
                ? 'bg-gray-800 text-gray-600'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/30'
              }
            `}
          >
            {revealedCount === 0 ? 'Pick a Tile' : `Cash Out (₹${(betAmount * multiplier).toFixed(0)})`}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MineControls;

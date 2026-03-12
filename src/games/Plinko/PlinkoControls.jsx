import React from 'react';
import { motion } from 'framer-motion';

const PlinkoControls = ({
  rows,
  setRows,
  risk,
  setRisk,
  betAmount,
  setBetAmount,
  balance,
  onDropBall,
}) => {
  const rowOptions = [8, 10, 12, 14, 16];
  const riskOptions = ['low', 'medium', 'high'];

  return (
    <div className="bg-[#141A3C]/50 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/5 space-y-6">
      {/* Risk Selector */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest block ml-1">
          Risk Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {riskOptions.map((option) => (
            <button
              key={option}
              onClick={() => setRisk(option)}
              className={`py-2.5 rounded-xl text-xs font-black transition-all border uppercase
                ${risk === option
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-[#0B0F2A] border-white/5 text-gray-400 hover:text-gray-200'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Rows Selector */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest block ml-1">
          Rows
        </label>
        <div className="grid grid-cols-5 gap-2">
          {rowOptions.map((row) => (
            <button
              key={row}
              onClick={() => setRows(row)}
              className={`py-2.5 rounded-xl text-xs font-black transition-all border
                ${rows === row
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                  : 'bg-[#0B0F2A] border-white/5 text-gray-400 hover:text-gray-200'
                }
              `}
            >
              {row}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Amount */}
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
          {[10, 50, 100, 500].map((val) => (
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

      {/* Drop Ball Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDropBall(betAmount)}
        disabled={betAmount <= 0 || betAmount > balance}
        className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-xl
          ${betAmount <= 0 || betAmount > balance
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
          }
        `}
      >
        Drop Ball
      </motion.button>
    </div>
  );
};

export default PlinkoControls;

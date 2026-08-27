import React, { useState } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const AviatorControls = ({ betAmount, setBetAmount, onPlaceBet, onCashout, gameState, hasCashedOut, multiplier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <BetPanel 
        betAmount={betAmount} 
        setBetAmount={setBetAmount} 
        onPlaceBet={onPlaceBet} 
        onCashout={onCashout} 
        gameState={gameState} 
        hasCashedOut={hasCashedOut} 
        multiplier={multiplier} 
      />
      <BetPanel 
        betAmount={betAmount} 
        setBetAmount={setBetAmount} 
        onPlaceBet={onPlaceBet} 
        onCashout={onCashout} 
        gameState={gameState} 
        hasCashedOut={hasCashedOut} 
        multiplier={multiplier} 
      />
    </div>
  );
};

const BetPanel = ({ betAmount, setBetAmount, onPlaceBet, onCashout, gameState, hasCashedOut, multiplier }) => {
  const [activeTab, setActiveTab] = useState('bet'); // bet, auto
  const quickBets = [100, 200, 500, 1000];

  const canBet = gameState === 'waiting' && !hasCashedOut;
  const canCashout = gameState === 'running' && !hasCashedOut;

  return (
    <div className="bg-[#141A3C] p-4 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex bg-[#0B0F2A] rounded-full p-1 self-center w-full max-w-[200px] border border-white/5">
        <button
          onClick={() => setActiveTab('bet')}
          className={`flex-1 py-1 px-4 rounded-full text-xs font-black uppercase transition-all ${
            activeTab === 'bet' ? 'bg-[#2a325d] text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          Bet
        </button>
        <button
          onClick={() => setActiveTab('auto')}
          className={`flex-1 py-1 px-4 rounded-full text-xs font-black uppercase transition-all ${
            activeTab === 'auto' ? 'bg-[#2a325d] text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          Auto
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row items-center">
        {/* Amount Control */}
        <div className="flex flex-col gap-2 flex-1 w-full lg:w-auto">
          <div className="flex items-center justify-between bg-[#0B0F2A] rounded-xl p-2 border border-white/5 shadow-inner min-w-[150px]">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              disabled={!canBet}
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 hover:bg-white/5 disabled:opacity-50"
            >
              <Minus size={18} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none mb-1">Bet Amount</span>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                disabled={!canBet}
                className="bg-transparent text-center font-black text-lg text-white focus:outline-none w-20 leading-none"
              />
            </div>
            <button
              onClick={() => setBetAmount(betAmount + 10)}
              disabled={!canBet}
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 hover:bg-white/5 disabled:opacity-50"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickBets.map((val) => (
              <button
                key={val}
                onClick={() => setBetAmount(val)}
                disabled={!canBet}
                className="py-1.5 rounded-lg bg-[#0B0F2A] border border-white/5 text-[10px] font-black text-gray-400 hover:text-white transition-all disabled:opacity-50"
              >
                ₹{val}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-1 w-full lg:w-auto">
          {canCashout ? (
            <button
              onClick={onCashout}
              className="w-full h-[84px] bg-orange-500 hover:bg-orange-400 text-black rounded-2xl flex flex-col items-center justify-center transition-all shadow-[0_6px_0_rgb(154,52,18)] active:translate-y-1 active:shadow-none relative group overflow-hidden"
            >
              <span className="text-xl font-black uppercase tracking-wider z-10">Cash Out</span>
              <span className="text-2xl font-black tabular-nums z-10">{formatINR(betAmount * multiplier)}</span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ) : (
            <button
              onClick={() => onPlaceBet(betAmount)}
              disabled={!canBet || betAmount <= 0}
              className={`w-full h-[84px] rounded-2xl flex flex-col items-center justify-center transition-all shadow-2xl relative group overflow-hidden ${
                canBet && betAmount > 0
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_6px_0_rgb(22,101,52)] active:translate-y-1 active:shadow-none'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl font-black uppercase tracking-widest z-10 leading-none mb-1">Bet</span>
              <span className="text-lg font-black opacity-80 z-10 leading-none">
                {betAmount > 0 ? formatINR(betAmount) : '0.00'}
              </span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AviatorControls;

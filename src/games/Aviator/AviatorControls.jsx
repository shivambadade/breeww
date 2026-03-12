import React, { useState } from 'react';
import { Minus, Plus, Settings2 } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const AviatorControls = ({ betAmount, setBetAmount, onPlaceBet, onCashout, gameState, isBetPlaced, hasCashedOut, multiplier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <BetPanel 
        betAmount={betAmount} 
        setBetAmount={setBetAmount} 
        onPlaceBet={onPlaceBet} 
        onCashout={onCashout} 
        gameState={gameState} 
        isBetPlaced={isBetPlaced}
        hasCashedOut={hasCashedOut} 
        multiplier={multiplier} 
      />
      <BetPanel 
        betAmount={betAmount} 
        setBetAmount={setBetAmount} 
        onPlaceBet={onPlaceBet} 
        onCashout={onCashout} 
        gameState={gameState} 
        isBetPlaced={isBetPlaced}
        hasCashedOut={hasCashedOut} 
        multiplier={multiplier} 
      />
    </div>
  );
};

const BetPanel = ({ betAmount, setBetAmount, onPlaceBet, onCashout, gameState, isBetPlaced, hasCashedOut, multiplier }) => {
  const [activeTab, setActiveTab] = useState('bet');
  const quickBets = [10, 100, 500, 1000];

  const canBet = (gameState === 'waiting' || gameState === 'running') && !isBetPlaced;
  const canCashout = gameState === 'running' && isBetPlaced && !hasCashedOut;

  return (
    <div className="bg-[#1c1c1e] p-3 rounded-xl border border-white/5 shadow-2xl">
      {/* Tabs */}
      <div className="flex bg-[#000000] rounded-full p-1 mb-3 max-w-[180px] mx-auto">
        <button
          onClick={() => setActiveTab('bet')}
          className={`flex-1 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
            activeTab === 'bet' ? 'bg-[#444446] text-white shadow-lg' : 'text-gray-500'
          }`}
        >
          Bet
        </button>
        <button
          onClick={() => setActiveTab('auto')}
          className={`flex-1 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
            activeTab === 'auto' ? 'bg-[#444446] text-white shadow-lg' : 'text-gray-500'
          }`}
        >
          Auto
        </button>
      </div>

      <div className="flex items-stretch gap-3">
        {/* Left Side: Controls */}
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex items-center bg-black rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              disabled={!canBet}
              className="p-1 hover:bg-white/5 rounded-md transition-colors disabled:opacity-30"
            >
              <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-gray-400">
                <Minus size={14} />
              </div>
            </button>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
              disabled={!canBet}
              className="bg-transparent text-center font-bold text-base text-white focus:outline-none w-full tabular-nums"
            />
            <button
              onClick={() => setBetAmount(betAmount + 10)}
              disabled={!canBet}
              className="p-1 hover:bg-white/5 rounded-md transition-colors disabled:opacity-30"
            >
              <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-gray-400">
                <Plus size={14} />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickBets.map((val) => (
              <button
                key={val}
                onClick={() => setBetAmount(val)}
                disabled={!canBet}
                className="py-1 rounded-lg bg-[#2c2c2e] border border-white/5 text-[11px] font-bold text-gray-300 hover:text-white transition-all disabled:opacity-30"
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Bet Button */}
        <div className="w-1/2">
          {canCashout ? (
            <button
              onClick={onCashout}
              className="w-full h-full min-h-[80px] bg-orange-500 hover:bg-orange-400 text-black rounded-xl flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 border-2 border-orange-300/30"
            >
              <span className="text-[10px] font-bold uppercase opacity-80">Cash Out</span>
              <span className="text-lg font-black tabular-nums">{multiplier.toFixed(2)}x</span>
              <span className="text-xs font-bold">{formatINR(betAmount * multiplier)}</span>
            </button>
          ) : (
            <button
              onClick={() => onPlaceBet(betAmount)}
              disabled={!canBet || betAmount <= 0}
              className={`w-full h-full min-h-[80px] rounded-xl flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 border-2 ${
                canBet && betAmount > 0
                  ? 'bg-[#28a745] hover:bg-[#218838] border-green-400/30 text-white'
                  : (isBetPlaced && !hasCashedOut) || gameState === 'running'
                    ? 'bg-[#b91c1c] border-red-500/30 text-white shadow-inner opacity-80'
                    : 'bg-[#444446] border-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-xl font-black uppercase tracking-tight leading-none mb-1">
                {isBetPlaced && !hasCashedOut ? 'Waiting' : gameState === 'running' ? 'Wait' : 'Bet'}
              </span>
              <span className="text-xs font-bold opacity-90 text-center leading-tight uppercase">
                {isBetPlaced && !hasCashedOut ? 'for next round' : betAmount > 0 ? `${betAmount}.00 INR` : '0.00 INR'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AviatorControls;

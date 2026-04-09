import React from 'react';
import { formatINR } from '../../utils/formatCurrency';

const quickBets = [10, 50, 100, 500];

const actionButtonBase =
  'min-h-12 rounded-2xl border px-4 py-3 text-sm font-black uppercase tracking-[0.16em] transition-all focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#0B0F2A]';

const ChamberControls = ({
  betAmount,
  onBetAmountChange,
  onQuickBet,
  onStartGame,
  onNextRound,
  onCashout,
  selectedChamber,
  statusTone,
  canStart,
  canPlayRound,
  canCashout,
}) => {
  const panelToneClass =
    statusTone === 'danger'
      ? 'border-rose-300/20 bg-rose-400/10 text-rose-100'
      : statusTone === 'success'
        ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
        : 'border-sky-300/20 bg-sky-400/10 text-sky-100';

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,60,0.94),rgba(11,15,42,0.92))] p-4 text-white shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-5">
      <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-100/55">Controls</div>
      <h3 className="mt-1 text-xl font-black">Betting Console</h3>
      <div className={`mt-4 rounded-[22px] border px-4 py-3 text-sm font-semibold ${panelToneClass}`}>
        Selected chamber: <span className="font-black">#{selectedChamber}</span>
      </div>

      <div className="mt-4">
        <label htmlFor="chamber-bet" className="text-xs font-black uppercase tracking-[0.22em] text-white/65">
          Bet Amount
        </label>
        <div className="mt-2 rounded-[24px] border border-white/10 bg-black/20 p-2">
          <input
            id="chamber-bet"
            type="number"
            min="1"
            step="10"
            value={betAmount}
            onChange={(event) => onBetAmountChange(Number(event.target.value) || 0)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-lg font-black text-white outline-none placeholder:text-white/25 focus:border-sky-300/45"
            placeholder="Enter stake"
          />
        </div>
        <input
          type="range"
          min="10"
          max="5000"
          step="10"
          value={Math.max(10, betAmount)}
          onChange={(event) => onBetAmountChange(Number(event.target.value))}
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-400"
        />
      </div>

      <div className="mt-4">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-white/65">Quick Bets</div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickBets.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onQuickBet(amount)}
              className={`rounded-2xl border px-3 py-3 text-sm font-black transition-all focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#0B0F2A] ${
                betAmount === amount
                  ? 'border-sky-300/55 bg-sky-400/20 text-white shadow-[0_0_25px_rgba(59,130,246,0.22)]'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {formatINR(amount)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onStartGame}
          disabled={!canStart}
          className={`${actionButtonBase} border-emerald-300/25 bg-[linear-gradient(180deg,rgba(16,185,129,0.95),rgba(5,150,105,0.92))] text-white shadow-[0_12px_30px_rgba(16,185,129,0.22)] enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-45`}
        >
          Start Game
        </button>
        <button
          type="button"
          onClick={onNextRound}
          disabled={!canPlayRound}
          className={`${actionButtonBase} border-sky-300/25 bg-[linear-gradient(180deg,rgba(59,130,246,0.95),rgba(37,99,235,0.92))] text-white shadow-[0_12px_30px_rgba(59,130,246,0.22)] enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-45`}
        >
          Next Round
        </button>
        <button
          type="button"
          onClick={onCashout}
          disabled={!canCashout}
          className={`${actionButtonBase} border-violet-300/25 bg-[linear-gradient(180deg,rgba(168,85,247,0.95),rgba(124,58,237,0.92))] text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)] enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-45`}
        >
          Cashout
        </button>
      </div>
      </div>
    </div>
  );
};

export default ChamberControls;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../hooks/useWallet';
import { formatINR } from '../../utils/formatCurrency';
import ChamberBoard from './ChamberBoard';
import ChamberControls from './ChamberControls';
import MultiplierDisplay from './MultiplierDisplay';
import ChamberHistory from './ChamberHistory';
import { createChamberResult, getMultiplierForRound } from '../../engines/chamberEngine';

const initialHistory = [
  { id: 'seed-1', round: 1, multiplierLabel: '1.20x', result: 'Safe' },
  { id: 'seed-2', round: 2, multiplierLabel: '1.50x', result: 'Safe' },
  { id: 'seed-3', round: 3, multiplierLabel: '0.00x', result: 'Lose' },
];

const ChamberRisk = () => {
  const { balance } = useWallet();
  const [betAmount, setBetAmount] = useState(100);
  const [round, setRound] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [gameState, setGameState] = useState('idle');
  const [selectedChamber, setSelectedChamber] = useState(1);
  const [revealedChamber, setRevealedChamber] = useState(null);
  const [history, setHistory] = useState(initialHistory);
  const [statusLabel, setStatusLabel] = useState('Load your stake and begin the run');
  const [lastOutcome, setLastOutcome] = useState('idle');
  const [lastWinAmount, setLastWinAmount] = useState(null);
  const resolveTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  const potentialWin = useMemo(
    () => Number((betAmount * multiplier).toFixed(2)),
    [betAmount, multiplier]
  );

  useEffect(() => {
    return () => {
      if (resolveTimeoutRef.current) window.clearTimeout(resolveTimeoutRef.current);
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const canStart = gameState === 'idle' && betAmount > 0 && betAmount <= balance;
  const canPlayRound = gameState === 'playing';
  const canCashout = gameState === 'playing' && round > 0;
  const progressPercent = Math.min(100, Math.round((round / 5) * 100));
  const statusTone =
    lastOutcome === 'lose' ? 'danger' : lastOutcome === 'safe' || lastOutcome === 'cashout' ? 'success' : 'neutral';

  const handleQuickBet = (amount) => {
    setBetAmount(amount);
  };

  const handleStartGame = () => {
    if (!canStart) {
      setStatusLabel(
        betAmount > balance
          ? 'Insufficient balance for this stake'
          : 'Enter a valid amount to start'
      );
      return;
    }

    setRound(0);
    setMultiplier(1);
    setGameState('playing');
    setRevealedChamber(null);
    setLastOutcome('idle');
    setLastWinAmount(null);
    setStatusLabel('Game started. Pick a chamber and continue the climb.');
  };

  const handleNextRound = () => {
    if (!canPlayRound) return;

    if (resolveTimeoutRef.current) window.clearTimeout(resolveTimeoutRef.current);
    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);

    setGameState('resolving');
    setRevealedChamber(null);
    setStatusLabel(`Resolving chamber ${selectedChamber}...`);

    const result = createChamberResult(selectedChamber);

    resolveTimeoutRef.current = window.setTimeout(() => {
      setRevealedChamber(selectedChamber);

      if (result.isSafe) {
        const nextRound = round + 1;
        const nextMultiplier = getMultiplierForRound(nextRound);

        setRound(nextRound);
        setMultiplier(nextMultiplier);
        setGameState('playing');
        setLastOutcome('safe');
        setStatusLabel(`Safe chamber. Multiplier boosted to ${nextMultiplier.toFixed(2)}x.`);
        setHistory((currentHistory) => [
          {
            id: `round-${Date.now()}`,
            round: nextRound,
            multiplierLabel: `${nextMultiplier.toFixed(2)}x`,
            result: 'Safe',
          },
          ...currentHistory,
        ].slice(0, 10));
      } else {
        const nextRound = round + 1;

        setRound(nextRound);
        setMultiplier(0);
        setGameState('lost');
        setLastOutcome('lose');
        setStatusLabel('Chamber hit. Round lost.');
        setHistory((currentHistory) => [
          {
            id: `round-${Date.now()}`,
            round: nextRound,
            multiplierLabel: '0.00x',
            result: 'Lose',
          },
          ...currentHistory,
        ].slice(0, 10));

        resetTimeoutRef.current = window.setTimeout(() => {
          setGameState('idle');
          setRevealedChamber(null);
          setMultiplier(1);
          setRound(0);
          setLastOutcome('idle');
          setStatusLabel('Load your stake and begin the run');
        }, 1800);
      }
    }, 850);
  };

  const handleCashout = () => {
    if (!canCashout) return;

    const winAmount = betAmount * multiplier;
    setLastWinAmount(winAmount);
    setGameState('idle');
    setLastOutcome('cashout');
    setStatusLabel(`Cashed out ${formatINR(winAmount)} at ${multiplier.toFixed(2)}x.`);
    setRevealedChamber(null);
    setRound(0);
    setMultiplier(1);
  };

  const statCards = useMemo(
    () => [
      { label: 'Wallet', value: formatINR(balance), icon: ShieldCheck },
      { label: 'Active Bet', value: formatINR(betAmount), icon: Zap },
      { label: 'Max Potential', value: formatINR(potentialWin), icon: AlertTriangle },
    ],
    [balance, betAmount, potentialWin]
  );

  return (
    <GameLayout title="CHAMBER RISK" isWide hideBetPanel>
      <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.16),transparent_24%),linear-gradient(180deg,#0B0F2A_0%,#0D1233_100%)] px-3 py-4 text-white sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,60,0.85),rgba(11,15,42,0.78))] p-4 shadow-[0_30px_100px_rgba(17,24,39,0.45)] backdrop-blur-xl sm:p-5">
            <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.44em] text-sky-100/55">Survival Multiplier</div>
                <h1 className="mt-1 bg-gradient-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                  Chamber Risk
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold text-white/65">
                  Pick among six futuristic chambers, survive each round, and cash out before the losing slot lands.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-100">
                  <Sparkles size={14} />
                  Premium interactive preview
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {statCards.map((stat) => (
                  <div key={stat.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex items-center gap-2 text-sky-200">
                      <stat.icon size={15} />
                      <span className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">{stat.label}</span>
                    </div>
                    <div className="mt-2 text-lg font-black text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <MultiplierDisplay
                betAmount={betAmount}
                multiplier={multiplier}
                potentialWin={potentialWin}
                statusLabel={statusLabel}
                round={round}
                progressPercent={progressPercent}
              />

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                <ChamberBoard
                  selectedChamber={selectedChamber}
                  revealedChamber={revealedChamber}
                  isAnimating={gameState === 'resolving'}
                  outcome={lastOutcome}
                  onSelectChamber={setSelectedChamber}
                  disabled={gameState === 'resolving'}
                />

                <ChamberControls
                  betAmount={betAmount}
                  onBetAmountChange={setBetAmount}
                  onQuickBet={handleQuickBet}
                  onStartGame={handleStartGame}
                  onNextRound={handleNextRound}
                  onCashout={handleCashout}
                  selectedChamber={selectedChamber}
                  statusTone={statusTone}
                  canStart={canStart}
                  canPlayRound={canPlayRound}
                  canCashout={canCashout}
                />
              </div>
            </div>

            <ChamberHistory entries={history} />
          </div>
        </div>

        <AnimatePresence>
          {lastOutcome === 'cashout' && lastWinAmount && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -16 }}
              className="pointer-events-none fixed bottom-6 left-1/2 z-[80] w-[min(92vw,420px)] -translate-x-1/2 rounded-[28px] border border-emerald-300/30 bg-[linear-gradient(180deg,rgba(16,185,129,0.96),rgba(5,150,105,0.94))] px-6 py-4 text-center text-white shadow-[0_20px_60px_rgba(16,185,129,0.28)]"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.36em] text-emerald-50/80">Cashout Success</div>
              <div className="mt-2 text-2xl font-black">{formatINR(lastWinAmount)}</div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
};

export default ChamberRisk;

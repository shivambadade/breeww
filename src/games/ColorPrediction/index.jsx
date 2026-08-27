import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Info, Wallet, CheckCircle2 } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../GameLayout';
import ColorBoard from './ColorBoard';
import SizeBoard from './SizeBoard';
import NumberBoard from './NumberBoard';
import HistoryTable from './HistoryTable';
import { useWallet } from '../../hooks/useWallet';
import { useBets } from '../../hooks/useBets';
import { formatINR } from '../../utils/formatCurrency';
import { getColorClass } from '../../utils/gameHelpers';
import { fetchCurrentRound, fetchGameHistory, submitBet } from '../../api/gameApi';
import { describeColourResult, evaluateColourBets } from './resultUtils';

const GAME_ID = 'colour';
const POLL_INTERVAL_MS = 3000;
const RESULT_REVEAL_MS = 3000;
const BET_SUCCESS_MS = 2000;

const toSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getRoundPeriod = (round) => String(round?.roundNumber ?? round?.roundId ?? '--');

const createClientBetId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `bet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeHistoryRow = (row) => describeColourResult(row.result, {
  roundId: row.roundId,
  roundNumber: row.roundNumber,
  period: getRoundPeriod(row),
  totalPot: toSafeNumber(row.totalPot),
  adminSet: Boolean(row.adminSet),
  createdAt: row.createdAt,
});

const ColorPrediction = () => {
  const { balance, refreshBalance, isWalletLoading } = useWallet();
  const { bets, addBet, clearBetsForRound } = useBets();

  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(null);
  const [selectedBet, setSelectedBet] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentRoundResult, setCurrentRoundResult] = useState(null);
  const [isResultRevealing, setIsResultRevealing] = useState(false);
  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [resolvedBetCount, setResolvedBetCount] = useState(0);
  const [isLoadingRound, setIsLoadingRound] = useState(true);
  const [isSubmittingBet, setIsSubmittingBet] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const betsRef = useRef([]);
  const latestResolvedRoundRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const betSuccessTimeoutRef = useRef(null);

  useEffect(() => {
    betsRef.current = bets;
  }, [bets]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  useEffect(() => () => {
    window.clearTimeout(revealTimeoutRef.current);
    window.clearTimeout(betSuccessTimeoutRef.current);
  }, []);

  const handleResolvedRound = useCallback((historyRow) => {
    const matchingBets = betsRef.current.filter((bet) => String(bet.roundId) === String(historyRow.roundId));
    const evaluation = evaluateColourBets(matchingBets, historyRow.resultToken);

    setIsResultRevealing(true);
    setCurrentRoundResult(historyRow);
    setResolvedBetCount(matchingBets.length);
    setTotalWinAmount(evaluation.totalWon);
    clearBetsForRound(historyRow.roundId);
    void refreshBalance();

    window.clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = window.setTimeout(() => {
      setIsResultRevealing(false);
      setCurrentRoundResult(null);
      setTotalWinAmount(0);
      setResolvedBetCount(0);
      setSelectedBet(null);
    }, RESULT_REVEAL_MS);
  }, [clearBetsForRound, refreshBalance]);

  const syncGameState = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoadingRound(true);
    }

    try {
      const [currentRound, historyRows] = await Promise.all([
        fetchCurrentRound(GAME_ID),
        fetchGameHistory(GAME_ID),
      ]);

      const normalizedHistory = historyRows
        .map(normalizeHistoryRow)
        .filter(Boolean)
        .slice(0, 10);

      setRound(currentRound);
      setTimeLeft(Math.max(0, toSafeNumber(currentRound?.timerLeft)));
      setGameHistory(normalizedHistory);
      setStatusMessage(currentRound ? '' : 'Waiting for the next round to open.');

      const latestHistoryRow = normalizedHistory[0];
      if (latestHistoryRow) {
        if (!latestResolvedRoundRef.current) {
          latestResolvedRoundRef.current = latestHistoryRow.roundId;
        } else if (String(latestResolvedRoundRef.current) !== String(latestHistoryRow.roundId)) {
          latestResolvedRoundRef.current = latestHistoryRow.roundId;
          handleResolvedRound(latestHistoryRow);
        }
      }
    } catch (error) {
      setStatusMessage(error.message || 'Unable to load live round data.');
    } finally {
      if (!silent) {
        setIsLoadingRound(false);
      }
    }
  }, [handleResolvedRound]);

  useEffect(() => {
    void syncGameState();

    const poller = window.setInterval(() => {
      void syncGameState({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(poller);
  }, [syncGameState]);

  useEffect(() => {
    if (!round?.roundId) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [round?.roundId]);

  const handleBetClick = async (amount) => {
    if (!selectedBet) return;
    if (!round?.roundId) return;

    const wager = Number(amount);
    if (!Number.isFinite(wager) || wager <= 0) return;
    if (timeLeft <= 5 || isSubmittingBet) return;

    setIsSubmittingBet(true);

    try {
      const response = await submitBet({
        gameId: GAME_ID,
        amount: wager,
        type: selectedBet.type,
        value: selectedBet.value,
        roundId: round.roundId,
        clientBetId: createClientBetId(),
      });

      const betData = response.data || {};
      const alreadyTracked = betsRef.current.some((bet) => String(bet.betId) === String(betData.betId));

      if (!alreadyTracked) {
        addBet({
          ...selectedBet,
          betId: betData.betId,
          roundId: betData.roundId ?? round.roundId,
          period: getRoundPeriod(round),
          amount: wager,
          optionId: betData.optionId,
        });
      }

      setStatusMessage('');
      setTimeLeft((previous) => Math.min(previous, Math.max(0, toSafeNumber(betData.timerLeft, previous))));
      window.clearTimeout(betSuccessTimeoutRef.current);
      setShowBetSuccess(true);
      betSuccessTimeoutRef.current = window.setTimeout(() => setShowBetSuccess(false), BET_SUCCESS_MS);

      void refreshBalance();
      void syncGameState({ silent: true });
    } catch (error) {
      setStatusMessage(error.message || 'Unable to place bet.');
      void refreshBalance();
    } finally {
      setIsSubmittingBet(false);
    }
  };

  const period = getRoundPeriod(round);
  const isBettingDisabled =
    isWalletLoading ||
    isLoadingRound ||
    isSubmittingBet ||
    !round?.roundId ||
    timeLeft <= 5 ||
    isResultRevealing;

  return (
    <GameLayout title="WinGo 30s" onPlaceBet={handleBetClick} betDisabled={isBettingDisabled}>
      <div className="flex flex-col gap-4">
        <div className="bg-casino-card rounded-2xl p-5 border border-white/5 shadow-2xl relative overflow-hidden mb-2">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500/10 text-orange-500 p-1 rounded-md text-[10px] font-bold border border-orange-500/20 flex items-center gap-1">
                  <Info size={12} />
                  How to play
                </div>
                <div className="bg-emerald-500/10 text-emerald-300 p-1 rounded-md text-[10px] font-bold border border-emerald-400/20">
                  Live Backend
                </div>
              </div>

              <div className="flex flex-col">
                <h1 data-testid="wingo-title" className="text-sm font-bold text-gray-400 uppercase tracking-wider">WinGo 30s</h1>
                <div className="flex gap-1.5 mt-2">
                  {gameHistory.slice(0, 5).map((historyEntry) => (
                    <div
                      key={historyEntry.roundId}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg ${getColorClass(historyEntry.color)}`}
                    >
                      {historyEntry.number}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Time Remaining</div>
              <div aria-live="polite" className="sr-only" data-testid="wingo-timer-text">
                {`00:${String(timeLeft).padStart(2, '0')}`}
              </div>
              <div className="flex items-center gap-1">
                {[0, 0].map((digit, index) => (
                  <div key={index} className="bg-[#f0f0f0] text-[#333] w-7 h-10 flex items-center justify-center rounded-lg font-black text-xl shadow-inner">
                    {digit}
                  </div>
                ))}
                <span className="text-white font-black text-2xl mx-0.5">:</span>
                {[Math.floor(timeLeft / 10), timeLeft % 10].map((digit, index) => (
                  <div key={index} className="bg-[#f0f0f0] text-[#333] w-7 h-10 flex items-center justify-center rounded-lg font-black text-xl shadow-inner">
                    {digit}
                  </div>
                ))}
              </div>
              <div data-testid="wingo-period" className="mt-3 text-white font-mono text-sm font-black tracking-tight">{period}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e254a] rounded-2xl p-4 border border-white/5 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
              <Wallet size={20} />
            </div>
            <div>
              <div className="text-gray-400 text-[10px] font-bold uppercase">Quick Deposit</div>
              <div data-testid="wingo-balance-panel" className="text-lg font-black text-white">{formatINR(balance)}</div>
            </div>
          </div>
          <button className="bg-casino-accent px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg active:scale-95">
            Deposit
          </button>
        </div>

        {statusMessage && (
          <div className="bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-300 shadow-lg">
            {statusMessage}
          </div>
        )}

        <div className={`space-y-4 transition-opacity ${isBettingDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-casino-card rounded-2xl p-4 border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Color Betting</div>
            <ColorBoard selectedBet={selectedBet} onSelectBet={setSelectedBet} disabled={isBettingDisabled} />
          </div>

          <div className="bg-casino-card rounded-2xl p-4 border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Size Betting</div>
            <SizeBoard selectedBet={selectedBet} onSelectBet={setSelectedBet} disabled={isBettingDisabled} />
          </div>

          <div className="bg-casino-card rounded-2xl p-4 border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Number Betting</div>
            <NumberBoard selectedBet={selectedBet} onSelectBet={setSelectedBet} disabled={isBettingDisabled} />
          </div>
        </div>

        <HistoryTable gameHistory={gameHistory} />

        <AnimatePresence>
          {timeLeft <= 5 && timeLeft > 0 && round?.roundId && !isResultRevealing && (
            <Motion.div
              data-testid="wingo-countdown-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none"
            >
              <div className="flex gap-4">
                {[0, timeLeft].map((digit, index) => (
                  <Motion.div
                    key={`${index}-${digit}`}
                    initial={{ y: 50, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="w-32 h-48 bg-[#f0f0f0] rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-8 border-gray-300"
                  >
                    <span className="text-[120px] font-black text-[#c09a75] leading-none">
                      {digit}
                    </span>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBetSuccess && (
            <Motion.div
              data-testid="wingo-bet-success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            >
              <div className="bg-green-600 px-10 py-5 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.5)] border border-green-400 font-black text-white uppercase tracking-widest flex items-center gap-3">
                <CheckCircle2 size={24} />
                Bet placed successfully
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isResultRevealing && (
            <Motion.div
              data-testid="wingo-result-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <div className="w-full max-w-sm flex flex-col items-center">
                <Motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-casino-accent text-xs font-black uppercase tracking-[0.3em] mb-12"
                >
                  Winning Number
                </Motion.div>

                <div className="flex gap-4 mb-12">
                  {[0, 1].map((index) => (
                    <Motion.div
                      key={index}
                      animate={{
                        rotateY: currentRoundResult ? 0 : [0, 180, 360, 540, 720],
                      }}
                      transition={{
                        duration: 2,
                        repeat: currentRoundResult ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-24 h-36 bg-[#141A3C] rounded-2xl border-2 border-white/10 flex items-center justify-center shadow-2xl"
                    >
                      <div className="text-6xl font-black italic text-white">
                        {currentRoundResult ? (index === 0 ? '0' : currentRoundResult.number) : '?'}
                      </div>
                    </Motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {currentRoundResult && (
                    <Motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`text-7xl font-black italic mb-6 ${getColorClass(currentRoundResult.color).replace('bg-', 'text-')}`}>
                        {currentRoundResult.number}
                      </div>

                      <div className="flex gap-3 mb-8">
                        <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase text-white ${getColorClass(currentRoundResult.color)}`}>
                          {currentRoundResult.color}
                        </span>
                        <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase text-white ${getColorClass(currentRoundResult.size)}`}>
                          {currentRoundResult.size}
                        </span>
                      </div>

                      {totalWinAmount > 0 ? (
                        <Motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-center"
                        >
                          <div className="text-green-400 font-black text-3xl uppercase italic drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">YOU WIN!</div>
                          <div className="text-white text-4xl font-black mt-2">
                            +{formatINR(totalWinAmount)}
                          </div>
                          <div className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                            From {resolvedBetCount} active bets
                          </div>
                        </Motion.div>
                      ) : resolvedBetCount > 0 ? (
                        <div className="text-red-500 font-black text-xl uppercase opacity-50 italic">Better Luck Next Time</div>
                      ) : null}
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
};

export default ColorPrediction;

import React, { useState, useEffect } from 'react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../context/WalletContext';

const Aviator = () => {
  const { placeBet, addWin } = useWallet();
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState('waiting'); // waiting, flying, crashed
  const [betAmount, setBetAmount] = useState(0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);

  useEffect(() => {
    let interval;
    if (gameState === 'flying') {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const next = prev + 0.01 * (prev < 2 ? 1 : prev < 5 ? 2 : 5);
          if (next >= crashPoint) {
            setGameState('crashed');
            clearInterval(interval);
            return crashPoint;
          }
          return parseFloat(next.toFixed(2));
        });
      }, 100);
    }

    if (gameState === 'waiting') {
      const waitTimer = setTimeout(() => {
        setCrashPoint(parseFloat((1 + Math.random() * 10).toFixed(2)));
        setGameState('flying');
        setMultiplier(1.0);
        setHasCashedOut(false);
      }, 5000);
      return () => clearTimeout(waitTimer);
    }

    if (gameState === 'crashed') {
      const resetTimer = setTimeout(() => {
        setGameState('waiting');
        setBetAmount(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    return () => clearInterval(interval);
  }, [gameState, crashPoint]);

  const handlePlaceBet = (amount) => {
    if (gameState !== 'waiting') return;
    if (placeBet(amount)) {
      setBetAmount(amount);
    }
  };

  const handleCashout = () => {
    if (gameState === 'flying' && betAmount > 0 && !hasCashedOut) {
      addWin(betAmount * multiplier);
      setHasCashedOut(true);
    }
  };

  return (
    <GameLayout 
      title="Aviator" 
      onPlaceBet={handlePlaceBet}
      betDisabled={gameState !== 'waiting' || betAmount > 0}
    >
      <div className="w-full max-w-lg mx-auto h-[350px] relative bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center justify-center">
        {/* Background Animation Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:200%_100%] animate-gradient-x"></div>
        </div>

        {/* Multiplier Display */}
        <div className="relative z-10 text-center">
          {gameState === 'waiting' ? (
            <div className="animate-pulse">
              <div className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Waiting for next round</div>
              <div className="text-4xl font-black text-white italic">STARTING...</div>
            </div>
          ) : (
            <div className={`transition-all duration-300 ${gameState === 'crashed' ? 'scale-110' : 'scale-100'}`}>
              <div className={`text-7xl font-black italic tracking-tighter ${gameState === 'crashed' ? 'text-red-600' : 'text-white'}`}>
                {multiplier.toFixed(2)}x
              </div>
              {gameState === 'crashed' && (
                <div className="text-red-600 font-black uppercase text-xl mt-2 animate-bounce">Flew Away!</div>
              )}
            </div>
          )}
        </div>

        {/* Plane Animation Simulation */}
        {gameState === 'flying' && (
          <div 
            className="absolute bottom-10 left-10 text-4xl transition-all duration-1000 ease-linear"
            style={{ 
              transform: `translate(${Math.min(multiplier * 20, 300)}px, -${Math.min(multiplier * 15, 200)}px) rotate(-15deg)` 
            }}
          >
            ✈️
          </div>
        )}

        {/* Cashout Overlay */}
        {hasCashedOut && (
          <div className="absolute inset-0 z-20 bg-green-900/40 backdrop-blur-sm flex items-center justify-center animate-in zoom-in">
            <div className="text-center">
              <div className="text-green-400 font-black text-3xl mb-1 uppercase italic">Cashed Out!</div>
              <div className="text-white font-black text-4xl tracking-tighter">₹{(betAmount * multiplier).toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Cashout Button */}
        {gameState === 'flying' && betAmount > 0 && !hasCashedOut && (
          <button
            onClick={handleCashout}
            className="absolute bottom-6 w-3/4 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black text-xl rounded-2xl shadow-[0_4px_0_rgb(154,52,18)] active:translate-y-1 active:shadow-none transition-all"
          >
            CASHOUT (₹{(betAmount * multiplier).toFixed(2)})
          </button>
        )}
      </div>

      {/* History simulation */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar w-full px-2">
        {[1.24, 5.32, 1.05, 2.11, 15.42, 1.88].map((h, i) => (
          <span key={i} className={`px-2 py-1 rounded-full text-[10px] font-bold ${h > 2 ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
            {h}x
          </span>
        ))}
      </div>
    </GameLayout>
  );
};

export default Aviator;

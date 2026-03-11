import React, { useState } from 'react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../context/WalletContext';

const SpinWheel = () => {
  const { placeBet, addWin } = useWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const segments = [
    { mult: 0, color: 'bg-gray-700' },
    { mult: 2, color: 'bg-indigo-600' },
    { mult: 0, color: 'bg-gray-700' },
    { mult: 5, color: 'bg-purple-600' },
    { mult: 0, color: 'bg-gray-700' },
    { mult: 1.5, color: 'bg-blue-600' },
    { mult: 0, color: 'bg-gray-700' },
    { mult: 10, color: 'bg-yellow-500' },
  ];

  const spin = (amount) => {
    if (isSpinning) return;

    if (placeBet(amount)) {
      setIsSpinning(true);
      setResult(null);

      const extraRounds = 5 + Math.floor(Math.random() * 5);
      const segmentIndex = Math.floor(Math.random() * segments.length);
      const newRotation = rotation + (extraRounds * 360) + (segmentIndex * (360 / segments.length));
      
      setRotation(newRotation);

      setTimeout(() => {
        setIsSpinning(false);
        const winMult = segments[(segments.length - segmentIndex) % segments.length].mult;
        setResult(winMult);
        if (winMult > 0) {
          addWin(amount * winMult);
        }
      }, 4000);
    }
  };

  return (
    <GameLayout title="Spin Wheel" onPlaceBet={spin} betDisabled={isSpinning}>
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Pointer */}
        <div className="relative flex justify-center z-10 -mb-4">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white drop-shadow-lg"></div>
        </div>

        {/* Wheel Container */}
        <div className="relative aspect-square mb-8 p-4 bg-casino-card rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-gray-800 overflow-hidden">
          <div 
            className="w-full h-full rounded-full relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {segments.map((s, i) => (
              <div
                key={i}
                className={`absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-center justify-end pr-8 ${s.color} border-l border-gray-900/20`}
                style={{ transform: `rotate(${i * (360 / segments.length)}deg) skewY(-45deg)` }}
              >
                <div 
                  className="transform skewY(45deg) font-black text-white text-lg drop-shadow-md"
                  style={{ transform: `rotate(22.5deg)` }}
                >
                  {s.mult}x
                </div>
              </div>
            ))}
          </div>
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900 rounded-full border-4 border-gray-800 z-10 flex items-center justify-center shadow-xl">
            <div className="w-2 h-2 bg-casino-accent rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Result Message */}
        <div className="h-12">
          {result !== null && (
            <div className="animate-in zoom-in duration-300">
              {result > 0 ? (
                <div className="text-2xl font-black text-green-500 italic uppercase tracking-tighter">
                  Won {result}x!
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-500 uppercase tracking-widest">
                  Try Again
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
};

export default SpinWheel;

import React, { useState } from 'react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../context/WalletContext';

const Plinko = () => {
  const { placeBet, addWin } = useWallet();
  const [balls, setBalls] = useState([]);

  const multipliers = [8.9, 2.1, 1.1, 0.5, 0.2, 0.5, 1.1, 2.1, 8.9];
  const rows = 8;

  const dropBall = (amount) => {
    if (placeBet(amount)) {
      const id = Date.now();
      const newBall = { id, amount, pos: 50, row: 0, path: [] };
      
      // Calculate path
      let currentPos = 4; // Start in middle of 9 slots
      const path = [];
      for (let i = 0; i < rows; i++) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        currentPos = Math.max(0, Math.min(multipliers.length - 1, currentPos + (direction * 0.5)));
        path.push(currentPos);
      }
      newBall.finalSlot = Math.round(currentPos);
      
      setBalls(prev => [...prev, newBall]);
      
      // Animation end
      setTimeout(() => {
        const winMult = multipliers[newBall.finalSlot];
        addWin(amount * winMult);
        setBalls(prev => prev.filter(b => b.id !== id));
      }, 3000);
    }
  };

  return (
    <GameLayout title="Plinko" onPlaceBet={dropBall}>
      <div className="w-full max-w-md mx-auto relative h-[400px] flex flex-col justify-between">
        {/* Pegs Grid */}
        <div className="flex-1 px-8 pt-4">
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-6 mb-6">
              {[...Array(rowIndex + 3)].map((_, pegIndex) => (
                <div key={pegIndex} className="w-1.5 h-1.5 bg-gray-600 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Multiplier Slots */}
        <div className="flex gap-1 px-2 mb-4">
          {multipliers.map((m, i) => (
            <div 
              key={i} 
              className={`flex-1 py-2 rounded-lg text-[10px] font-black text-center shadow-lg border border-white/5 transition-transform ${
                m >= 2 ? 'bg-red-600 text-white' : m >= 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {m}x
            </div>
          ))}
        </div>

        {/* Animated Balls */}
        {balls.map((ball) => (
          <div 
            key={ball.id}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-casino-accent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] border border-white/20 animate-plinko-fall"
            style={{ '--final-x': `${(ball.finalSlot - 4) * 40}px` }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes plinko-fall {
          0% { transform: translate(-50%, 0); }
          25% { transform: translate(calc(-50% + 20px), 100px); }
          50% { transform: translate(calc(-50% - 15px), 200px); }
          75% { transform: translate(calc(-50% + 10px), 300px); }
          100% { transform: translate(calc(-50% + var(--final-x)), 370px); opacity: 0; }
        }
        .animate-plinko-fall {
          animation: plinko-fall 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
        }
      `}</style>
    </GameLayout>
  );
};

export default Plinko;

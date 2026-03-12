import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, History, Info, RotateCw } from 'lucide-react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../hooks/useWallet';
import { useBets } from '../../hooks/useBets';
import { formatINR } from '../../utils/formatCurrency';
import WheelCanvas from './WheelCanvas';
import WheelControls from './WheelControls';

const SpinWheel = () => {
  const { balance, placeBet, addWin } = useWallet();
  const { addBet, clearBets } = useBets();

  const [risk, setRisk] = useState('medium');
  const [betAmount, setBetAmount] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  // Multiplier segments configuration
  const allSegments = useMemo(() => {
    const imgValues = [2000, 1500, 3000, 8000, 5000, 1000, 3000, 1500, 7000, 4000, 10000, 3000, 2500, 5000, 1000];
    const imgColors = [
      '#22c55e', // 2000 Green
      '#ef4444', // 1500 Red
      '#a855f7', // 3000 Purple
      '#eab308', // 8000 Yellow
      '#3b82f6', // 5000 Blue
      '#ef4444', // 1000 Red
      '#a855f7', // 3000 Purple
      '#eab308', // 1500 Yellow
      '#22c55e', // 7000 Green
      '#a855f7', // 4000 Purple
      '#eab308', // 10000 Yellow
      '#3b82f6', // 3000 Blue
      '#ef4444', // 2500 Red
      '#a855f7', // 5000 Purple
      '#eab308'  // 1000 Yellow
    ];
    
    const imageSegments = imgValues.map((val, i) => ({
      mult: val / 100, // 2000 becomes 20x. Bet 100 * 20 = 2000 win.
      label: val.toLocaleString(),
      color: imgColors[i]
    }));

    return {
      low: [
        { mult: 1.5, label: '1.5x', color: '#4f46e5' }, { mult: 1.2, label: '1.2x', color: '#312e81' }, 
        { mult: 1, label: '1.0x', color: '#1e1b4b' }, { mult: 1.2, label: '1.2x', color: '#312e81' },
        { mult: 1.5, label: '1.5x', color: '#4f46e5' }, { mult: 2, label: '2.0x', color: '#6366f1' },
        { mult: 1, label: '1.0x', color: '#1e1b4b' }, { mult: 5, label: '5.0x', color: '#fbbf24' }
      ],
      medium: imageSegments,
      high: [
        { mult: 0, label: '0x', color: '#0f172a' }, { mult: 5, label: '5x', color: '#4f46e5' },
        { mult: 0, label: '0x', color: '#0f172a' }, { mult: 20, label: '20x', color: '#fbbf24' },
        { mult: 0, label: '0x', color: '#0f172a' }, { mult: 10, label: '10x', color: '#6366f1' },
        { mult: 0.2, label: '0.2x', color: '#312e81' }, { mult: 50, label: '50x', color: '#facc15' }
      ]
    };
  }, []);

  const segments = allSegments[risk];

  /**
   * Structure result fetching so it can be replaced by an API response
   */
  const fetchSpinResult = useCallback(async () => {
    // This is where you'd call your API: 
    // const response = await fetch('/api/spin');
    // const data = await response.json();
    // return data.segmentIndex;

    return Math.floor(Math.random() * segments.length);
  }, [segments.length]);

  const handleSpin = useCallback(async (amount) => {
    if (amount <= 0 || amount > balance || isSpinning) return;

    if (placeBet(amount)) {
      setIsSpinning(true);
      setLastResult(null);

      // 1. Fetch result (Mocking API call)
      const segmentIndex = await fetchSpinResult();
      const segmentAngle = 360 / segments.length;
      
      // 2. Calculate new rotation
      // Add extra rotations for effect
      const extraRotations = 5; 
      // Stop on the segment. In SVG/CSS rotation, we rotate the wheel. 
      // Pointer is at the top (0deg). 
      // To align segment i with the top: rotation = -i * segmentAngle
      const targetRotation = 360 * extraRotations + (360 - (segmentIndex * segmentAngle));
      const finalRotation = rotation + targetRotation;

      setRotation(finalRotation);

      // 3. Record the bet
      addBet({
        type: 'spin_wheel',
        amount,
        risk
      });

      // 4. Wait for animation
      setTimeout(() => {
        setIsSpinning(false);
        const winMult = segments[segmentIndex].mult;
        const winAmount = amount * winMult;

        if (winAmount > 0) {
          addWin(winAmount);
          setLastResult({ mult: winMult, amount: winAmount });
        } else {
          setLastResult({ mult: winMult, amount: 0 });
        }

        // Add to history
        setGameHistory(prev => [{
          id: Date.now(),
          risk,
          multiplier: winMult,
          outcome: winMult >= 1 ? 'Win' : 'Loss',
          profit: winAmount - amount
        }, ...prev].slice(0, 10));

        setTimeout(() => {
          clearBets();
          setLastResult(null);
        }, 3000);
      }, 4000); // 4s duration (matching CSS/Framer transition)
    }
  }, [balance, isSpinning, placeBet, segments, rotation, fetchSpinResult, addBet, addWin, clearBets, risk]);

  return (
    <GameLayout title="SPIN WHEEL" isWide={true}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
        
        {/* Balance Section */}
        <div className="bg-[#141A3C]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 shadow-inner">
              <Wallet size={32} />
            </div>
            <div>
              <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Your Balance</div>
              <div className="text-3xl font-black text-white">{formatINR(balance)}</div>
            </div>
          </div>
          <button className="bg-indigo-600 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
            Deposit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
          {/* Wheel Board Side */}
          <div className="order-2 lg:order-1 flex flex-col items-center">
            <WheelCanvas 
              segments={segments} 
              rotation={rotation} 
              onSpin={() => handleSpin(betAmount)} 
              isSpinning={isSpinning} 
            />
          </div>

          {/* Controls Side */}
          <div className="order-1 lg:order-2 h-full flex flex-col justify-center">
            <WheelControls 
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              balance={balance}
              onSpin={handleSpin}
              isSpinning={isSpinning}
              risk={risk}
              setRisk={setRisk}
            />
          </div>
        </div>

        {/* Win Notification Overlay */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <div className={`px-12 py-6 rounded-3xl border-2 text-center shadow-2xl
                ${lastResult.amount > 0 ? 'bg-green-600 border-green-400' : 'bg-red-900/80 border-red-500'}
              `}>
                <div className="text-white text-sm font-black uppercase tracking-widest mb-1">
                  {lastResult.amount > 0 ? 'Mega Win!' : 'Bad Luck'}
                </div>
                <div className="text-4xl font-black text-white italic tracking-tighter">
                   {lastResult.mult}x
                </div>
                {lastResult.amount > 0 && (
                  <div className="text-white/80 font-bold mt-1">{formatINR(lastResult.amount)}</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Table */}
        <div className="bg-[#141A3C] rounded-2xl border border-white/5 shadow-xl overflow-hidden mt-4">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <History size={16} className="text-casino-accent" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">Game History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/20">
                  <th className="px-5 py-3">Risk</th>
                  <th className="px-5 py-3">Multiplier</th>
                  <th className="px-5 py-3">Outcome</th>
                  <th className="px-5 py-3 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gameHistory.length > 0 ? (
                  gameHistory.map((h) => (
                    <tr key={h.id} className="text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase ${
                          h.risk === 'high' ? 'bg-red-500/10 text-red-500' : 
                          h.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {h.risk}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-black ${h.multiplier >= 1 ? 'text-green-500' : 'text-gray-500'}`}>
                          {h.multiplier}x
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={h.outcome === 'Win' ? 'text-green-500' : 'text-red-500'}>
                          {h.outcome}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-right font-black ${h.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {h.profit >= 0 ? '+' : ''}{h.profit.toFixed(0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-gray-600 italic">
                      Start spinning to see your history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </GameLayout>
  );
};

export default SpinWheel;

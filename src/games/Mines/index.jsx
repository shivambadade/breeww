import React, { useState } from 'react';
import GameLayout from '../GameLayout';
import { useWallet } from '../../context/WalletContext';

const Mines = () => {
  const { placeBet, addWin } = useWallet();
  const [mineCount, setMineCount] = useState(3);
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [mines, setMines] = useState([]);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, over
  const [betAmount, setBetAmount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);

  const startGame = (amount) => {
    if (placeBet(amount)) {
      const newMines = [];
      while (newMines.length < mineCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!newMines.includes(pos)) newMines.push(pos);
      }
      setMines(newMines);
      setGrid(Array(25).fill(null));
      setGameStatus('playing');
      setBetAmount(amount);
      setRevealedCount(0);
    }
  };

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing' || grid[index] !== null) return;

    if (mines.includes(index)) {
      const newGrid = [...grid];
      mines.forEach(m => newGrid[m] = 'mine');
      setGrid(newGrid);
      setGameStatus('over');
    } else {
      const newGrid = [...grid];
      newGrid[index] = 'safe';
      setGrid(newGrid);
      setRevealedCount(prev => prev + 1);
    }
  };

  const calculateMultiplier = () => {
    if (revealedCount === 0) return 1;
    // Simple multiplier logic: (Total tiles / Remaining safe tiles)
    let mult = 1;
    for (let i = 0; i < revealedCount; i++) {
      mult *= (25 - i) / (25 - i - mineCount);
    }
    return mult.toFixed(2);
  };

  const cashOut = () => {
    if (gameStatus !== 'playing' || revealedCount === 0) return;
    const win = betAmount * calculateMultiplier();
    addWin(win);
    setGameStatus('over');
    // Show all mines
    const newGrid = [...grid];
    mines.forEach(m => {
      if (newGrid[m] === null) newGrid[m] = 'mine-hidden';
    });
    setGrid(newGrid);
  };

  return (
    <GameLayout 
      title="Mines" 
      onPlaceBet={startGame} 
      betDisabled={gameStatus === 'playing'}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Multiplier Display */}
        <div className="text-center mb-6">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Multiplier</div>
          <div className="text-4xl font-black text-casino-accent tracking-tighter">
            {calculateMultiplier()}x
          </div>
        </div>

        {/* Mines Grid */}
        <div className="grid grid-cols-5 gap-2 mb-8 aspect-square">
          {grid.map((tile, i) => (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              disabled={gameStatus !== 'playing' || tile !== null}
              className={`rounded-xl transition-all duration-300 transform active:scale-90 flex items-center justify-center text-2xl shadow-lg border border-white/5 ${
                tile === 'safe' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]' :
                tile === 'mine' ? 'bg-red-600 animate-shake' :
                tile === 'mine-hidden' ? 'bg-red-900/40 opacity-50' :
                'bg-casino-card hover:bg-gray-800'
              }`}
            >
              {tile === 'safe' ? '💎' : tile === 'mine' || tile === 'mine-hidden' ? '💣' : ''}
            </button>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex flex-col gap-4">
          {gameStatus === 'playing' ? (
            <button
              onClick={cashOut}
              disabled={revealedCount === 0}
              className={`w-full py-4 rounded-2xl font-black text-lg uppercase transition-all shadow-xl ${
                revealedCount === 0 ? 'bg-gray-800 text-gray-600' : 'bg-yellow-500 hover:bg-yellow-400 text-black animate-pulse'
              }`}
            >
              Cash Out (₹{(betAmount * calculateMultiplier()).toFixed(0)})
            </button>
          ) : (
            <div className="flex items-center justify-between bg-casino-card p-4 rounded-2xl border border-gray-800">
              <span className="text-sm font-bold text-gray-400">MINES:</span>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setMineCount(n)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      mineCount === n ? 'bg-casino-accent text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {gameStatus === 'over' && (
            <div className={`text-center font-black uppercase italic tracking-tighter text-xl animate-in zoom-in ${revealedCount > 0 && !grid.includes('mine') ? 'text-green-500' : 'text-red-500'}`}>
              {revealedCount > 0 && !grid.includes('mine') ? 'Success!' : 'Game Over!'}
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
};

export default Mines;

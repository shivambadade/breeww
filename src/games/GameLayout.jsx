import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Settings } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/formatCurrency';
import BetPanel from '../components/betting/BetPanel';

const GameLayout = ({ title, children, onPlaceBet, betDisabled, isWide = false }) => {
  const navigate = useNavigate();
  const { balance } = useWallet();

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-center overflow-hidden">
      <div className={`w-full ${isWide ? 'max-w-md lg:max-w-6xl' : 'max-w-md'} bg-casino-dark flex flex-col h-full relative shadow-2xl border-x border-gray-800/50`}>
        {/* Game Header */}
        <header className="h-14 bg-casino-card border-b border-gray-800 flex items-center justify-between px-4 shrink-0 shadow-lg relative z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="font-bold tracking-tight text-white uppercase">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 px-3 py-1.5 rounded-full font-mono font-bold text-green-400 text-sm border border-white/5 shadow-inner">
              Wallet: {formatINR(balance)}
            </div>
            <button className="text-gray-500 hover:text-white p-1">
              <Info size={18} />
            </button>
          </div>
        </header>

        {/* Main Game Content Area */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden pl-4 pr-3 pt-4 pb-12 custom-scrollbar scroll-smooth">
          <div className="flex flex-col gap-4 pr-1">
            {children}
          </div>
        </main>

        {/* Reusable Bet Panel */}
        <footer className="shrink-0 bg-casino-card border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20">
          <div className={`${isWide ? 'max-w-6xl mx-auto w-full' : ''}`}>
            <BetPanel onPlaceBet={onPlaceBet} disabled={betDisabled} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GameLayout;

import React from 'react';
import { Wallet, Settings, Bell, MessageSquare } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatINR } from '../../utils/formatCurrency';

const Header = () => {
  const { balance } = useWallet();

  return (
    <header className="h-14 bg-casino-card border-b border-white/5 flex items-center justify-between px-4 shrink-0 shadow-lg relative z-[50]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-casino-accent rounded-lg flex items-center justify-center shadow-lg shadow-casino-accent/20">
          <span className="text-white font-black text-xs italic">B</span>
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase italic">Breeww</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-black/30 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5 shadow-inner">
          <Wallet size={14} className="text-green-400" />
          <span className="text-sm font-black text-white font-mono">{formatINR(balance)}</span>
        </div>
        
        <div className="flex gap-1">
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

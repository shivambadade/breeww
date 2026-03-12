import React, { useState } from 'react';
import { HelpCircle, Info, Timer } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const AviatorSidebar = ({ allBets }) => {
  const [activeTab, setActiveTab] = useState('all'); // all, my, top

  return (
    <div className="bg-[#141A3C]/50 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden max-h-[800px]">
      {/* Tabs */}
      <div className="flex bg-[#0B0F2A] rounded-xl p-1 mb-4 border border-white/5 relative z-10">
        {['All Bets', 'My Bets', 'Top'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
            className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.toLowerCase().split(' ')[0] ? 'bg-[#2a325d] text-white shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header Labels */}
      <div className="flex text-[8px] font-black text-gray-500 uppercase tracking-widest px-2 mb-2">
        <div className="flex-1">User</div>
        <div className="flex-1 text-center">Bet INR</div>
        <div className="flex-1 text-center">X</div>
        <div className="flex-1 text-right">Cash Out</div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth space-y-1 pr-1 custom-scrollbar">
        {allBets.map((bet, i) => (
          <div key={bet.id || i} className={`flex items-center text-[10px] font-bold p-1.5 rounded-lg border border-white/5 transition-all hover:scale-[1.02] hover:bg-white/5 active:scale-95 ${
            bet.hasCashedOut ? 'bg-green-900/10 border-green-500/10' : 'bg-black/20 border-white/5'
          }`}>
            <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-black text-white shrink-0">
                {bet.user[0].toUpperCase()}
              </div>
              <span className="text-gray-400 truncate tracking-tight">{bet.user}</span>
            </div>
            <div className="flex-1 text-center text-gray-300 font-black tracking-tighter tabular-nums">
              {bet.amount.toLocaleString()}
            </div>
            <div className="flex-1 text-center font-black tabular-nums">
              {bet.hasCashedOut ? (
                <span className="bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded-full text-[8px] border border-purple-500/10">
                  {bet.cashoutMult.toFixed(2)}x
                </span>
              ) : (
                <span className="text-gray-600">-</span>
              )}
            </div>
            <div className={`flex-1 text-right font-black tabular-nums tracking-tighter ${
              bet.hasCashedOut ? 'text-green-400' : 'text-gray-700'
            }`}>
              {bet.hasCashedOut ? (bet.amount * bet.cashoutMult).toLocaleString() : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Stats */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
         <div className="flex items-center gap-1.5 bg-[#0B0F2A] px-3 py-1.5 rounded-lg border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>{allBets.length} Playing</span>
         </div>
         <div className="flex items-center gap-1.5">
            <HelpCircle size={14} className="hover:text-white cursor-pointer transition-colors" />
            <Info size={14} className="hover:text-white cursor-pointer transition-colors" />
         </div>
      </div>
    </div>
  );
};

export default AviatorSidebar;

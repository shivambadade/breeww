import React from 'react';
import { History, ChevronDown } from 'lucide-react';

const AviatorHistory = ({ history }) => {
  return (
    <div className="bg-[#0B0F2A]/80 backdrop-blur-md rounded-xl p-2 border border-white/5 flex items-center justify-between mb-2 shadow-2xl relative z-30">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth w-full px-1">
        {history.length > 0 ? (
          history.map((h, i) => (
            <div
              key={h.id || i}
              className={`px-3 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-105 active:scale-95 ${
                h.multiplier > 10 ? 'bg-pink-600/20 text-pink-400 border border-pink-500/20 shadow-pink-900/40' :
                h.multiplier > 2 ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20 shadow-purple-900/40' :
                'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-blue-900/40'
              }`}
            >
              {h.multiplier.toFixed(2)}x
            </div>
          ))
        ) : (
          <div className="text-gray-600 font-bold uppercase text-[10px] tracking-widest px-2">No history yet</div>
        )}
      </div>
      
      <button className="p-2 ml-2 bg-[#141A3C] rounded-lg border border-white/5 text-gray-400 hover:text-white transition-colors group">
        <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default AviatorHistory;

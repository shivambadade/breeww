import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlatformRecommendation = ({ games }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 mb-10">
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-base font-black text-white uppercase tracking-tighter">Popular Games</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-xs font-bold text-[#5D87E6] hover:text-[#4A6DBC] transition-colors"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {games.map((game) => (
          <div 
            key={game.id} 
            onClick={() => navigate(game.path)}
            className="relative aspect-[0.75/1] rounded-xl overflow-hidden shadow-xl border border-white/5 cursor-pointer group active:scale-95 transition-transform"
          >
            <img 
              src={game.image} 
              alt={game.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
              <span className="text-white text-[10px] font-bold leading-tight">{game.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformRecommendation;

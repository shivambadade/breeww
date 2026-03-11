import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const GameCard = ({ game }) => {
  return (
    <Link 
      to={game.path} 
      className="group relative bg-casino-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-casino-accent"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-casino-dark via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{game.category}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <div className="bg-casino-accent p-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)]">
            <Play fill="white" size={24} className="ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-casino-card">
        <h3 className="text-sm font-bold truncate group-hover:text-casino-accent transition-colors tracking-tight">{game.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-500 font-medium">Live Now</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

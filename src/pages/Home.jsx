import React from 'react';
import Banner from '../components/layout/Banner';
import GameCard from '../components/common/Card';
import { GAMES } from '../constants/games';

const Home = () => {
  return (
    <div>
      <Banner />
      

      <div className="mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide">Popular Games</h2>
          <button className="text-xs font-semibold text-casino-accent hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

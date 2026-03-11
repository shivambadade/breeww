import React from 'react';
import Tile from './Tile';

const MineGrid = ({ tiles, onTileClick, gameStatus, mines }) => {
  // tiles: array of 25 strings ('hidden', 'safe', 'mine', 'mine-revealed')

  return (
    <div className="w-full max-w-[650px] mx-auto mb-8 p-6 md:p-8 bg-black/20 rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-sm">
      <div className="grid grid-cols-5 gap-3 md:gap-5">
        {tiles.map((status, index) => (
          <Tile
            key={index}
            index={index}
            status={status}
            onClick={onTileClick}
            disabled={gameStatus !== 'playing'}
          />
        ))}
      </div>
    </div>
  );
};

export default MineGrid;

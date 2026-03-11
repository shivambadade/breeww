import React from 'react';

const Banner = () => {
  return (
    <div className="relative h-40 md:h-64 rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center px-8 shadow-lg">
      <div className="z-10 max-w-xs md:max-w-md">
        <h2 className="text-xl md:text-3xl font-bold mb-2">Welcome to Breeww</h2>
        <p className="text-sm md:text-base text-gray-300 mb-4">Get up to 100% bonus on your first deposit. Play now!</p>
        <button className="bg-casino-accent px-6 py-2 rounded-lg font-bold hover:brightness-110 transition-all shadow-md">
          Deposit Now
        </button>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        {/* Placeholder for banner image/illustration */}
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-casino-accent/50 to-transparent blur-2xl"></div>
      </div>
    </div>
  );
};

export default Banner;

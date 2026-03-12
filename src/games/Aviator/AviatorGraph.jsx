import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AviatorGraph = ({ multiplier, gameState }) => {
  // SVG size constants
  const width = 800;
  const height = 400;
  const paddingX = 20;
  const paddingY = 20;

  // Calculate coordinates based on current multiplier
  // The curve should grow as the multiplier increases
  const progress = Math.min((multiplier - 1) / 5, 1); 
  
  // Curved path: Starting from bottom-left (startX=0, startY=height)
  const startX = 0;
  const startY = height;
  const endX = (width * 0.9) * progress + paddingX;
  const endY = height - (height * 0.8) * progress - paddingY;
  
  // Control point for curve (makes it curve upwards from bottom left)
  const cpX = endX * 0.8;
  const cpY = height;

  const pathData = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-[#000000] rounded-xl overflow-hidden shadow-inner border border-white/5">
      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#991b1b44_0%,_transparent_60%)]" />

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Curve Path */}
        {gameState === 'running' && (
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1 }}
            filter="url(#glow)"
          />
        )}

        {/* Fill under the curve */}
        {gameState === 'running' && (
          <path
            d={`${pathData} L ${endX} ${startY} L ${startX} ${startY} Z`}
            fill="url(#curveGradient)"
            opacity="0.2"
          />
        )}

        {/* The Airplane Icon */}
        <AnimatePresence>
          {gameState === 'running' && (
            <motion.g
              initial={{ x: startX, y: startY, rotate: -15, opacity: 0 }}
              animate={{ x: endX, y: endY, rotate: -20, opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]"
            >
              {/* Refined Red Aviator Airplane Body */}
              <path 
                d="M-25,0 L15,0 L35,-10 L45,0 L35,10 L15,0 Z M8,0 L-12,-22 L8,-22 L18,0 Z M8,0 L-12,22 L8,22 L18,0 Z" 
                fill="#ff0000" 
                stroke="#fff" 
                strokeWidth="1.5"
              />
              {/* Tail Fin */}
              <path d="M-25,-2 L-32,-15 L-20,-15 L-12,-2 Z" fill="#ff0000" stroke="#fff" strokeWidth="1" />
              <path d="M-25,2 L-32,15 L-20,15 L-12,2 Z" fill="#ff0000" stroke="#fff" strokeWidth="1" />
              
              {/* High Speed Propeller Animation */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.05, repeat: Infinity, ease: "linear" }}
                style={{ originX: "47px", originY: "0px" }}
              >
                <circle cx="47" cy="0" r="12" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4,8" opacity="0.6" />
                <path d="M47,-12 L47,12" stroke="white" strokeWidth="2" opacity="0.4" />
                <path d="M35,0 L59,0" stroke="white" strokeWidth="2" opacity="0.4" />
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Central Multiplier Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {gameState === 'waiting' ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">Waiting for next round</div>
            </motion.div>
          ) : gameState === 'crashed' ? (
            <motion.div
              key="crashed"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-red-600 font-black italic text-5xl md:text-7xl tracking-tighter drop-shadow-lg">
                FLEW AWAY!
              </div>
              <div className="text-white font-black text-4xl md:text-6xl mt-2 drop-shadow-md">
                {multiplier.toFixed(2)}x
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-white font-black italic text-6xl md:text-8xl tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] tabular-nums">
                {multiplier.toFixed(2)}x
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600/50 via-red-600 to-red-600/50" />
    </div>
  );
};

export default AviatorGraph;

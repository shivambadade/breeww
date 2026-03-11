import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tile = ({ status, index, onClick, disabled }) => {
  // status: 'hidden', 'safe', 'mine', 'mine-revealed'

  const variants = {
    hidden: { scale: 1, rotateY: 0 },
    revealed: { scale: [1, 1.1, 1], rotateY: 180, transition: { duration: 0.4 } },
    explode: { 
      scale: [1, 1.2, 1], 
      backgroundColor: ['#141A3C', '#ef4444', '#141A3C'],
      transition: { duration: 0.5 } 
    }
  };

  return (
    <motion.button
      whileHover={!disabled && status === 'hidden' ? { scale: 1.05, backgroundColor: '#2a325d' } : {}}
      whileTap={!disabled && status === 'hidden' ? { scale: 0.95 } : {}}
      onClick={() => onClick(index)}
      disabled={disabled || status !== 'hidden'}
      className={`relative aspect-square rounded-full shadow-2xl border-2 transition-all duration-300 flex items-center justify-center text-4xl
        ${status === 'hidden' ? 'bg-[#141A3C] border-white/10 hover:border-indigo-500/30' : ''}
        ${status === 'safe' ? 'bg-indigo-600/20 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4)]' : ''}
        ${status === 'mine' ? 'bg-red-600 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)]' : ''}
        ${status === 'mine-revealed' ? 'bg-red-900/30 border-red-900/40 opacity-50 grayscale' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {status === 'safe' && (
          <motion.div
            key="safe"
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="text-indigo-400 drop-shadow-[0_0_12px_rgba(129,140,248,1)] text-5xl"
          >
            💎
          </motion.div>
        )}
        {status === 'mine' && (
          <motion.div
            key="mine"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.5, 1],
              rotate: [0, 10, -10, 0]
            }}
            className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)] text-5xl"
          >
            💣
          </motion.div>
        )}
        {status === 'mine-revealed' && (
          <motion.div
            key="mine-revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl"
          >
            💣
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shine effect for hidden tiles */}
      {status === 'hidden' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none" />
      )}
    </motion.button>
  );
};

export default Tile;

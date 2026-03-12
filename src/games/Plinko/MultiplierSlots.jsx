import React from 'react';
import { motion } from 'framer-motion';

const MultiplierSlots = ({ multipliers, slotWidth, activeSlotIndex }) => {
  return (
    <div className="flex justify-center gap-1 mt-4">
      {multipliers.map((multiplier, index) => (
        <motion.div
          key={index}
          className={`flex items-center justify-center h-10 rounded-lg text-xs font-black shadow-lg transition-all
            ${index === activeSlotIndex ? 'scale-110 shadow-indigo-600/50' : ''}
            ${multiplier >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}
          `}
          style={{ width: `${slotWidth}px` }}
          animate={{
            scale: index === activeSlotIndex ? 1.2 : 1,
            backgroundColor: index === activeSlotIndex ? '#4f46e5' : multiplier >= 2 ? '#4f46e5' : '#1f2937',
          }}
        >
          {multiplier}x
        </motion.div>
      ))}
    </div>
  );
};

export default MultiplierSlots;

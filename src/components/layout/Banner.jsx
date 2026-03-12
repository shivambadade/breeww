import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <div className="relative h-[280px] sm:h-72 md:h-80 rounded-[2.5rem] overflow-hidden mb-6 bg-[#0B0F2A] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group border border-white/5">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#141A3C] via-[#0B0F2A] to-[#1e254a]"></div>
        
        {/* Animated Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-10 -left-10 w-48 h-48 md:w-96 md:h-96 bg-indigo-600/30 rounded-full blur-[60px] md:blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-10 -right-10 w-48 h-48 md:w-96 md:h-96 bg-purple-600/30 rounded-full blur-[60px] md:blur-[100px]"
        />

        {/* Floating Particles/Dots */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, -80],
                x: [0, (Math.random() - 0.5) * 30]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-between px-6 sm:px-10 md:px-16">
        {/* Left Content */}
        <div className="flex flex-col items-start w-full sm:max-w-lg relative z-20">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-1"
          >
            <span className="text-2xl sm:text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              WELCOME
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-600/90 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl border border-white/10 shadow-[0_10px_20px_rgba(79,70,229,0.3)] mb-4 sm:mb-6 transform -rotate-1"
          >
            <span className="text-lg sm:text-2xl md:text-4xl font-black text-white tracking-tight uppercase">
              BREEWW.COM
            </span>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-1 mb-5 sm:mb-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 sm:w-8 h-[2px] bg-yellow-500"></div>
              <span className="text-yellow-500 font-black uppercase tracking-widest text-[9px] sm:text-xs md:text-sm">
                INDIA'S NO.1 TRUSTED PLATFORM
              </span>
            </div>
            <p className="text-gray-300 text-[10px] sm:text-sm font-bold ml-7 sm:ml-10 max-w-[180px] sm:max-w-none leading-tight">
              Join the most secure gaming community.
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-[#0B0F2A] px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase tracking-widest text-[10px] sm:text-sm shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-orange-300/20"
          >
            Deposit Now
          </motion.button>
        </div>

        {/* Right Content - Mascot (Adjusted for mobile) */}
        <div className="absolute -right-4 bottom-0 sm:relative flex items-end h-full pt-10 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="relative z-10 translate-x-4 sm:translate-x-0"
          >
            <img 
              src="https://www.freeiconspng.com/uploads/cartoon-female-character-png-2.png" 
              alt="Mascot"
              className="h-48 sm:h-72 md:h-[450px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-40 sm:opacity-100"
            />
            {/* Mascot Glow */}
            <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] sm:blur-[100px] -z-10 rounded-full"></div>
          </motion.div>

          {/* Premium Floating Coins */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, opacity: 0, scale: 0 }}
                animate={{ 
                  y: [-20, 20, -20],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360],
                  scale: [0.5, 1, 0.5],
                  x: [(i - 5) * 5, (i - 5) * -5, (i - 5) * 5]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 6, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute text-xl sm:text-2xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                style={{ 
                  left: `${10 + Math.random() * 80}%`,
                  top: `${15 + Math.random() * 70}%`
                }}
              >
                🪙
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Banner;

import React from 'react';
import { motion } from 'framer-motion';

const WheelCanvas = ({ segments, rotation, onSpin, isSpinning }) => {
  const segmentAngle = 360 / segments.length;

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      
      {/* Deep Background Glow & Atmosphere */}
      <div className="absolute inset-[-100px] pointer-events-none overflow-hidden rounded-full">
        {/* Dynamic Stars/Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 600 - 300, 
              y: Math.random() * 600 - 300,
              scale: Math.random() * 0.4,
              opacity: Math.random() * 0.4
            }}
            animate={{ 
              opacity: [0.1, 0.7, 0.1],
              scale: [0.4, 0.8, 0.4],
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_#7dd3fc,0_0_20px_#ffffff]"
          />
        ))}
      </div>

      {/* Main Backlight Glow */}
      <div className="absolute inset-[-60px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute inset-[-30px] rounded-full bg-purple-500/10 blur-[60px] pointer-events-none" />

      {/* Pointer (The Bulb Indicator) at the top center */}
      <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center scale-90">
        {/* The Bulb */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#8b5cf6] rounded-full shadow-[0_0_25px_rgba(139,92,246,0.8),inset_0_0_8px_rgba(255,255,255,0.5)] border-2 border-white/30" />
          <div className="w-4 h-4 bg-white/20 rounded-full blur-[2px]" />
          {/* Stem/Base of pointer */}
          <div className="absolute bottom-[-8px] w-5 h-5 bg-[#6d28d9] rounded-sm transform rotate-45 border border-white/20 shadow-lg" />
        </div>
      </div>

      {/* Heavy Metallic Outer Ring */}
      <div className="absolute inset-0 rounded-full border-[22px] border-[#4c1d95] shadow-[0_10px_40px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,0.6)] z-20 pointer-events-none bg-gradient-to-b from-[#6d28d9] via-[#4c1d95] to-[#2e1065]">
        {/* Inner shadow/ring */}
        <div className="absolute inset-[-2px] rounded-full border-[3px] border-black/30" />
        
        {/* Large Glowing Light Bulbs */}
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.5, 1, 0.5], 
              scale: [0.9, 1.05, 0.9],
              boxShadow: [
                "0 0 8px #7dd3fc, 0 0 15px #ffffff",
                "0 0 15px #7dd3fc, 0 0 30px #ffffff",
                "0 0 8px #7dd3fc, 0 0 15px #ffffff"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }}
            className="absolute w-2.5 h-2.5 bg-blue-100 rounded-full border border-white/50"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * (360 / 24)}deg) translateY(-200px)`,
            }}
          />
        ))}
      </div>

      {/* The Spinning Wheel Core */}
      <motion.div
        className="absolute inset-[22px] rounded-full overflow-hidden z-10 shadow-[0_0_40px_rgba(0,0,0,0.9)] border-[4px] border-[#2e1065]"
        animate={{ rotate: rotation }}
        transition={{ duration: 5, ease: [0.15, 0, 0.1, 1] }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <defs>
            <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
              <feFlood floodColor="black" floodOpacity="0.8" result="offsetColor" />
              <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {segments.map((s, i) => {
            const startAngle = (i * segmentAngle) * (Math.PI / 180);
            const endAngle = ((i + 1) * segmentAngle) * (Math.PI / 180);
            
            const x1 = 50 + 50 * Math.cos(startAngle);
            const y1 = 50 + 50 * Math.sin(startAngle);
            const x2 = 50 + 50 * Math.cos(endAngle);
            const y2 = 50 + 50 * Math.sin(endAngle);
            
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <g key={i}>
                <path
                  d={pathData}
                  fill={s.color}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />
                <text
                  x="75"
                  y="50"
                  fill="white"
                  fontSize="5"
                  fontWeight="900"
                  textAnchor="middle"
                  filter="url(#textGlow)"
                  className="select-none pointer-events-none"
                  transform={`rotate(${i * segmentAngle + segmentAngle / 2}, 50, 50) rotate(90, 75, 50)`}
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.2px'
                  }}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
        {/* High-end glossy highlights */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none" />
      </motion.div>

      {/* 3D-Look Center "SPIN" Button */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 z-30 flex items-center justify-center transition-all ${isSpinning ? 'scale-95 cursor-not-allowed opacity-90' : 'cursor-pointer hover:scale-105 active:scale-90'}`}
        onClick={() => !isSpinning && onSpin()}
      >
        {/* Button Platform/Shadow */}
        <div className="absolute inset-0 rounded-full bg-black/60 shadow-[0_15px_40px_rgba(0,0,0,0.9)] blur-sm" />
        <div className="absolute inset-[-4px] rounded-full bg-gradient-to-b from-[#6d28d9] to-black shadow-2xl" />
        
        {/* Main Button Surface */}
        <div className="absolute inset-[6px] rounded-full bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#2e1065] border-[4px] border-[#a78bfa]/40 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <span className="text-white font-black text-2xl tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase italic">
            SPIN
          </span>
          {/* Glass Reflection */}
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-b from-white/20 to-transparent rounded-[100%] pointer-events-none" />
        </div>
        
        {/* Peripheral Glow when idle */}
        {!isSpinning && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-[-8px] rounded-full bg-[#8b5cf6]/30 blur-2xl z-[-1]"
          />
        )}
      </div>

    </div>
  );
};

export default WheelCanvas;

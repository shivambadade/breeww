import React from 'react';
import { motion as Motion } from 'framer-motion';

const chamberPositions = [
  'left-1/2 top-3 -translate-x-1/2',
  'right-[12%] top-[23%]',
  'right-[14%] bottom-[22%]',
  'left-1/2 bottom-3 -translate-x-1/2',
  'left-[14%] bottom-[22%]',
  'left-[12%] top-[23%]',
];

const chamberMotion = {
  idle: { scale: 1, boxShadow: '0 0 0 rgba(34,211,238,0)' },
  active: {
    scale: [1, 1.08, 1],
    boxShadow: [
      '0 0 0 rgba(59,130,246,0)',
      '0 0 35px rgba(59,130,246,0.4)',
      '0 0 16px rgba(59,130,246,0.18)',
    ],
    transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
  },
  safe: {
    scale: [1, 1.12, 1],
    boxShadow: [
      '0 0 0 rgba(16,185,129,0)',
      '0 0 45px rgba(16,185,129,0.55)',
      '0 0 22px rgba(16,185,129,0.22)',
    ],
    transition: { duration: 0.75, ease: 'easeOut' },
  },
  lose: {
    x: [0, -8, 8, -6, 6, 0],
    scale: [1, 1.08, 0.98, 1],
    boxShadow: [
      '0 0 0 rgba(244,63,94,0)',
      '0 0 48px rgba(244,63,94,0.6)',
      '0 0 24px rgba(244,63,94,0.22)',
    ],
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
};

const ChamberBoard = ({
  selectedChamber,
  revealedChamber,
  isAnimating,
  outcome,
  onSelectChamber,
  disabled,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,60,0.95),rgba(11,15,42,0.92))] p-4 shadow-[0_20px_80px_rgba(18,24,67,0.4)] sm:p-6">
      <div className="absolute inset-x-12 top-2 h-24 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-100/55">Chamber Board</div>
        <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Choose your next chamber</h2>
        <p className="mt-2 text-sm font-semibold text-white/55">Tap a chamber, then advance the round when you are ready.</p>
      </div>

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[420px] sm:max-w-[500px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),transparent_38%),linear-gradient(180deg,rgba(31,41,84,0.55),rgba(10,15,42,0.92))] shadow-[inset_0_0_60px_rgba(59,130,246,0.16),0_0_60px_rgba(76,29,149,0.15)]" />
        <div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.24),rgba(5,8,26,0.9)_75%)] shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[18%] rounded-full border border-dashed border-sky-300/15"
        />
        <Motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[28%] rounded-full border border-violet-300/10"
        />

        {chamberPositions.map((positionClass, index) => {
          const chamberNumber = index + 1;
          const isSelected = selectedChamber === chamberNumber;
          const isRevealed = revealedChamber === chamberNumber;
          const currentVariant = !isRevealed
            ? isSelected && isAnimating
              ? 'active'
              : 'idle'
            : outcome === 'lose'
              ? 'lose'
              : 'safe';

          return (
            <Motion.button
              key={chamberNumber}
              type="button"
              onClick={() => onSelectChamber(chamberNumber)}
              disabled={disabled}
              variants={chamberMotion}
              animate={currentVariant}
              whileHover={!disabled ? { scale: 1.06 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              className={`absolute ${positionClass} flex h-20 w-20 items-center justify-center rounded-full border text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#0B0F2A] sm:h-24 sm:w-24 ${
                isRevealed && outcome === 'lose'
                  ? 'border-rose-300/60 bg-[radial-gradient(circle_at_top,_rgba(251,113,133,0.48),rgba(136,19,55,0.9))]'
                  : isRevealed
                    ? 'border-emerald-300/60 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.45),rgba(6,78,59,0.88))]'
                    : isSelected
                      ? 'border-violet-300/55 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.4),rgba(30,41,59,0.92))] shadow-[0_0_30px_rgba(168,85,247,0.22)]'
                      : 'border-sky-300/25 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.3),rgba(30,41,59,0.88))] hover:border-sky-300/45'
              }`}
            >
              <div className="absolute inset-1 rounded-full border border-white/15" />
              <div className="relative text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">Slot</div>
                <div className="text-2xl font-black sm:text-3xl">{chamberNumber}</div>
              </div>
            </Motion.button>
          );
        })}

        <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.2),rgba(15,23,42,0.95))] shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          <div className="text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-sky-100/60">Core</div>
            <div className="mt-2 text-base font-black text-white sm:text-lg">Risk Engine</div>
            <div className="mt-1 text-xs font-semibold text-white/50">6 chambers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChamberBoard;

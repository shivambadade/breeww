import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { formatINR } from '../../utils/formatCurrency';

const statCardClass =
  'rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]';

const MultiplierDisplay = ({ betAmount, multiplier, potentialWin, statusLabel, round, progressPercent }) => {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,60,0.94),rgba(11,15,42,0.92))] p-4 text-white shadow-[0_18px_70px_rgba(43,78,255,0.18)] backdrop-blur-xl sm:p-5">
      <div className="absolute inset-x-8 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),transparent_68%)] blur-2xl" />
      <div className="absolute -right-10 top-1/2 h-36 w-36 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-100/60">Live Multiplier</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/70">
              Round {round}
            </div>
          </div>
          <AnimatePresence initial={false} mode="sync">
            <Motion.div
              key={multiplier}
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.08, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="mt-2 inline-flex rounded-[28px] border border-sky-300/20 bg-[radial-gradient(circle_at_top,_rgba(45,212,255,0.24),transparent_58%),linear-gradient(180deg,rgba(17,24,75,0.92),rgba(11,15,42,0.98))] px-5 py-4 shadow-[0_0_45px_rgba(59,130,246,0.18)]"
            >
              <span className="bg-gradient-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
                {multiplier.toFixed(2)}x
              </span>
            </Motion.div>
          </AnimatePresence>
          <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-white/75">
            {statusLabel}
          </div>
          <div className="mt-4 max-w-xl">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
              <span>Risk Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <Motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee_0%,#60a5fa_55%,#c084fc_100%)] shadow-[0_0_18px_rgba(96,165,250,0.4)]"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className={statCardClass}>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">Bet</div>
            <div className="mt-1 text-lg font-black">{formatINR(betAmount)}</div>
          </div>
          <div className={statCardClass}>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">Multiplier</div>
            <div className="mt-1 text-lg font-black">{multiplier.toFixed(2)}x</div>
          </div>
          <div className={statCardClass}>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-100/55">Potential Win</div>
            <div className="mt-1 text-lg font-black text-emerald-200">{formatINR(potentialWin)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplierDisplay;

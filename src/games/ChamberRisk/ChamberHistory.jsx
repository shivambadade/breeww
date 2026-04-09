import React from 'react';
import { motion as Motion } from 'framer-motion';

const ChamberHistory = ({ entries }) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,60,0.92),rgba(11,15,42,0.92))] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.36em] text-sky-100/55">Recent Rounds</div>
          <h3 className="mt-1 text-lg font-black">Chamber History</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/65">
          Last 10
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10">
        <div className="grid grid-cols-3 bg-white/8 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
          <span>Round</span>
          <span>Multiplier</span>
          <span className="text-right">Result</span>
        </div>
        <div className="divide-y divide-white/8">
          {entries.map((entry) => (
            <Motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 items-center px-3 py-3 text-sm"
            >
              <span className="font-semibold text-white/78">{entry.round}</span>
              <span className="font-black text-sky-200">{entry.multiplierLabel}</span>
              <span className={`text-right font-black ${entry.result === 'Safe' ? 'text-emerald-200' : 'text-rose-200'}`}>
                {entry.result}
              </span>
            </Motion.div>
          ))}
          {entries.length === 0 && (
            <div className="px-3 py-6 text-center text-sm font-semibold text-white/50">
              No rounds played yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChamberHistory;

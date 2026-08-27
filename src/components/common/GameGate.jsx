import React, { useEffect, useMemo, useState } from 'react';
import { fetchGamesCatalog } from '../../api/gameApi';
import { navigateTo } from '../../lib/navigation';

const isPlayable = (entry) => {
  if (!entry) return false;
  const enabled = entry.settings?.enabled !== false;
  const maintenance = Boolean(entry.settings?.maintenanceMode);
  return entry.status === 'active' && enabled && !maintenance;
};

const GameGate = ({ backendGameId, children }) => {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let active = true;
    fetchGamesCatalog().then((games) => {
      if (!active) return;
      setCatalog(Array.isArray(games) ? games : []);
    });
    return () => {
      active = false;
    };
  }, []);

  const entry = useMemo(() => {
    if (!Array.isArray(catalog)) return null;
    return catalog.find((g) => g.id === backendGameId) || null;
  }, [catalog, backendGameId]);

  if (catalog == null) {
    return (
      <div className="min-h-screen bg-[#0f1730] text-white flex items-center justify-center">
        <div className="text-sm font-bold text-white/70">Loading...</div>
      </div>
    );
  }

  if (!isPlayable(entry)) {
    const statusText = entry
      ? entry.status === 'maintenance' || entry.settings?.maintenanceMode
        ? 'Under maintenance'
        : 'Unavailable'
      : 'Unavailable';

    return (
      <div className="min-h-screen bg-[#0f1730] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/50">Game</div>
          <h1 className="mt-3 text-3xl font-black">{statusText}</h1>
          <p className="mt-2 text-sm text-white/65">
            This game is currently disabled by the admin.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="mt-6 inline-flex rounded-full border border-sky-300/20 bg-sky-400/10 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-sky-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default GameGate;


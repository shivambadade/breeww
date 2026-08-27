import React, { useEffect, useMemo, useState } from 'react';
import Banner from '../components/layout/Banner';
import Announcement from '../components/layout/Announcement';
import GameCategoryGrid from '../components/layout/GameCategoryGrid';
import PlatformRecommendation from '../components/layout/PlatformRecommendation';
import WinningInfo from '../components/layout/WinningInfo';
import EarningsChart from '../components/layout/EarningsChart';
import PlatformFooter from '../components/layout/PlatformFooter';
import { GAMES } from '../constants/games';
import { fetchGamesCatalog } from '../api/gameApi';

const Home = () => {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let active = true;
    fetchGamesCatalog().then((games) => {
      if (!active) return;
      setCatalog(Array.isArray(games) ? games : []);
    });
    return () => { active = false; };
  }, []);

  const visibleGames = useMemo(() => {
    const backendToFrontendId = {
      colour: 'color-prediction',
      wheel: 'spin-wheel',
    };

    const statusByFrontendId = new Map();
    for (const game of catalog) {
      const frontendId = backendToFrontendId[game.id] || game.id;
      statusByFrontendId.set(frontendId, game);
    }

    return GAMES
      .map((game) => {
        const live = statusByFrontendId.get(game.id);
        const enabled = live?.settings?.enabled !== false;
        const maintenance = Boolean(live?.settings?.maintenanceMode);
        const isActive = (live?.status || 'active') === 'active';
        const playable = Boolean(live) && enabled && isActive && !maintenance;

        return {
          ...game,
          playable,
          status: live?.status || null,
          maintenanceMode: maintenance,
        };
      })
      .filter((game) => game.playable);
  }, [catalog]);

  return (
    <div className="bg-[#1B233D] min-h-screen relative">
      <Banner />
      <Announcement />
      <GameCategoryGrid />
      <PlatformRecommendation games={visibleGames.slice(0, 9)} />
      <WinningInfo />
      <EarningsChart />
      <PlatformFooter />
    </div>
  );
};

export default Home;

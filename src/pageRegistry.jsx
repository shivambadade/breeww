import React, { useEffect, useState } from 'react';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Activity from './pages/Activity';
import Bonuses from './pages/Bonuses';
import Account from './pages/Account';
import InviteWheel from './pages/InviteWheel';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import Aviator from './games/Aviator';
import ColorPrediction from './games/ColorPrediction';
import Mines from './games/Mines';
import SpinWheel from './games/SpinWheel';
import Dice from './games/Dice';
import DragonTiger from './games/DragonTiger';
import Plinko from './games/Plinko';
import Poker from './games/Poker';
import ChamberRisk from './games/ChamberRisk';
import Roulette from './games/Roulette';
import GameGate from './components/common/GameGate';
import { normalizePath, pageHref } from './lib/navigation';
import { clearUserSession, getStoredUserToken, validateStoredUserSession } from './lib/auth';

const withLayout = (PageComponent) => (
  <Layout>
    {React.createElement(PageComponent)}
  </Layout>
);

const NotFound = () => (
  <Layout>
    <div className="px-6 py-10 text-center text-white">
      <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/50">404</div>
      <h1 className="mt-3 text-3xl font-black">Page Not Found</h1>
      <p className="mt-2 text-sm text-white/65">This page does not exist in the Breeww multi-page app.</p>
      <a
        href="/"
        className="mt-6 inline-flex rounded-full border border-sky-300/20 bg-sky-400/10 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-sky-200"
      >
        Go Home
      </a>
    </div>
  </Layout>
);

const pageRegistry = {
  '/': withLayout(Home),
  '/activity': withLayout(Activity),
  '/promotion': withLayout(Bonuses),
  '/wallet': withLayout(Account),
  '/account': withLayout(Account),
  '/invite-wheel': <InviteWheel />,
  '/notifications': <Notifications />,
  '/login': <Login />,
  '/register': <Register />,
  '/game/aviator': <GameGate backendGameId="aviator"><Aviator /></GameGate>,
  '/game/color-prediction': <GameGate backendGameId="colour"><ColorPrediction /></GameGate>,
  '/game/mines': <GameGate backendGameId="mines"><Mines /></GameGate>,
  '/game/spin-wheel': <GameGate backendGameId="wheel"><SpinWheel /></GameGate>,
  '/game/dice': <GameGate backendGameId="dice"><Dice /></GameGate>,
  '/game/dragon-tiger': <GameGate backendGameId="dragon-tiger"><DragonTiger /></GameGate>,
  '/game/plinko': <GameGate backendGameId="plinko"><Plinko /></GameGate>,
  '/game/poker': <GameGate backendGameId="poker"><Poker /></GameGate>,
  '/game/chamber-risk': <GameGate backendGameId="chamber-risk"><ChamberRisk /></GameGate>,
  '/game/roulette': <GameGate backendGameId="roulette"><Roulette /></GameGate>,
  '/game/Roulette': <GameGate backendGameId="roulette"><Roulette /></GameGate>,
};

const PUBLIC_PATHS = new Set(['/login', '/register']);

const GuardScreen = () => (
  <div className="min-h-screen bg-[#11172f] flex items-center justify-center text-white">
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold tracking-[0.12em] uppercase">
      Loading
    </div>
  </div>
);

const PageRoot = () => {
  const path = normalizePath(window.location.pathname);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const applyGuard = async () => {
      const token = getStoredUserToken();

      if (!token) {
        if (!PUBLIC_PATHS.has(path)) {
          clearUserSession({ redirectTo: '/login' });
          return;
        }

        if (!cancelled) {
          setIsAuthenticated(false);
          setIsReady(true);
        }
        return;
      }

      const isValid = await validateStoredUserSession();
      if (cancelled) return;

      if (!isValid) {
        if (!PUBLIC_PATHS.has(path)) {
          clearUserSession({ redirectTo: '/login' });
          return;
        }

        setIsAuthenticated(false);
        setIsReady(true);
        return;
      }

      if (PUBLIC_PATHS.has(path)) {
        window.location.replace(pageHref('/'));
        return;
      }

      setIsAuthenticated(true);
      setIsReady(true);
    };

    setIsReady(false);
    applyGuard();

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!isReady) {
    return <GuardScreen />;
  }

  if (!isAuthenticated && !PUBLIC_PATHS.has(path)) {
    return null;
  }

  return pageRegistry[path] ?? <NotFound />;
};

export default PageRoot;

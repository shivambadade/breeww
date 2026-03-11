import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Activity from './pages/Activity';
import Bonuses from './pages/Bonuses';
import Account from './pages/Account';

// Games
import Aviator from './games/Aviator';
import ColorPrediction from './games/ColorPrediction';
import Mines from './games/Mines';
import SpinWheel from './games/SpinWheel';
import Dice from './games/Dice';
import DragonTiger from './games/DragonTiger';
import Plinko from './games/Plinko';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="activity" element={<Activity />} />
          <Route path="bonuses" element={<Bonuses />} />
          <Route path="account" element={<Account />} />
        </Route>
        
        {/* Game Routes - Rendered without Layout for full-screen feel */}
        <Route path="/game/aviator" element={<Aviator />} />
        <Route path="/game/color-prediction" element={<ColorPrediction />} />
        <Route path="/game/mines" element={<Mines />} />
        <Route path="/game/spin-wheel" element={<SpinWheel />} />
        <Route path="/game/dice" element={<Dice />} />
        <Route path="/game/dragon-tiger" element={<DragonTiger />} />
        <Route path="/game/plinko" element={<Plinko />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

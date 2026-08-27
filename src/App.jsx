import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Activity from './pages/Activity';
import Bonuses from './pages/Bonuses';
import Account from './pages/Account';
import InviteWheel from './pages/InviteWheel';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';

// Games
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

// Auth Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="activity" element={<Activity />} />
          <Route path="promotion" element={<Bonuses />} />
          <Route path="wallet" element={<Account />} />
          <Route path="account" element={<Account />} />
        </Route>
        
        {/* Full-screen protected pages without Layout */}
        <Route path="/invite-wheel" element={<ProtectedRoute><InviteWheel /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        
        {/* Protected Game Routes */}
        <Route path="/game/aviator" element={<ProtectedRoute><Aviator /></ProtectedRoute>} />
        <Route path="/game/color-prediction" element={<ProtectedRoute><ColorPrediction /></ProtectedRoute>} />
        <Route path="/game/mines" element={<ProtectedRoute><Mines /></ProtectedRoute>} />
        <Route path="/game/spin-wheel" element={<ProtectedRoute><SpinWheel /></ProtectedRoute>} />
        <Route path="/game/dice" element={<ProtectedRoute><Dice /></ProtectedRoute>} />
        <Route path="/game/dragon-tiger" element={<ProtectedRoute><DragonTiger /></ProtectedRoute>} />
        <Route path="/game/plinko" element={<ProtectedRoute><Plinko /></ProtectedRoute>} />
        <Route path="/game/poker" element={<ProtectedRoute><Poker /></ProtectedRoute>} />
        <Route path="/game/chamber-risk" element={<ProtectedRoute><ChamberRisk /></ProtectedRoute>} />
        <Route path="/game/roulette" element={<ProtectedRoute><Roulette /></ProtectedRoute>} />
        <Route path="/game/Roulette" element={<ProtectedRoute><Roulette /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

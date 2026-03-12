import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNavbar from '../components/layout/BottomNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-casino-dark flex justify-center">
      <div className="w-full max-w-md bg-casino-dark text-white relative shadow-2xl border-x border-white/5 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 px-4 pt-16 pb-24 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Layout;

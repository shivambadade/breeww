import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNavbar from '../components/layout/BottomNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-casino-dark text-white pb-20">
      <Header />
      <main className="container mx-auto px-4 pt-4">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;

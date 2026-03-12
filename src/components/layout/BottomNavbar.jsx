import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Gift, User } from 'lucide-react';

const BottomNavbar = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Activity, label: 'Activity', path: '/activity' },
    { icon: Gift, label: 'Bonuses', path: '/bonuses' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-casino-card border-t border-x border-white/5 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-casino-accent' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;

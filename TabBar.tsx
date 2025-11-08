import React from 'react';
import { HomeIcon, UsersIcon, TagIcon, Bars3Icon } from './icons';

type Tab = 'dashboard' | 'customers' | 'products' | 'menu';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.FC<{className?: string}> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'customers', label: 'Customers', icon: UsersIcon },
  { id: 'products', label: 'Products', icon: TagIcon },
  { id: 'menu', label: 'Menu', icon: Bars3Icon },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-30 flex justify-around">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          aria-label={tab.label}
          className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors ${
            activeTab === tab.id ? 'text-olivist-green' : 'text-gray-500 hover:text-olivist-light-green'
          }`}
        >
          <tab.icon className="h-6 w-6 mb-1" />
          <span>{tab.label}</span>
        </button>
      ))}
    </footer>
  );
};

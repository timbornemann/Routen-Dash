import { Map, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: 'roulette' | 'settings';
  setActiveTab: (tab: 'roulette' | 'settings') => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border z-10">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveTab('roulette')}
          className={`flex flex-col items-center justify-center w-full h-full relative ${
            activeTab === 'roulette' ? 'text-brand-accent' : 'text-brand-dim'
          }`}
        >
          {activeTab === 'roulette' && (
            <motion.div
              layoutId="nav-pill"
              className="absolute top-0 w-12 h-1 bg-brand-accent rounded-b-full"
            />
          )}
          <Map size={24} className="mb-1" />
          <span className="text-xs font-medium">Roulette</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center w-full h-full relative ${
            activeTab === 'settings' ? 'text-brand-accent' : 'text-brand-dim'
          }`}
        >
          {activeTab === 'settings' && (
            <motion.div
              layoutId="nav-pill"
              className="absolute top-0 w-12 h-1 bg-brand-accent rounded-b-full"
            />
          )}
          <Settings size={24} className="mb-1" />
          <span className="text-xs font-medium">Routen</span>
        </button>
      </div>
    </div>
  );
}

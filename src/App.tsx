/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useRoutes } from './hooks/useRoutes';
import { RouletteView } from './views/RouletteView';
import { RoutesView } from './views/RoutesView';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const { routes, addRoute, deleteRoute, updateRoute } = useRoutes();
  const [activeTab, setActiveTab] = useState<'roulette' | 'settings'>('roulette');

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text flex flex-col">
      <main className="flex-1 overflow-hidden flex flex-col relative w-full h-full max-w-md mx-auto shadow-2xl bg-brand-surface border-x border-brand-border">
        
        {/* Top Header */}
        <header className="h-16 px-6 flex items-center border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2 text-brand-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 15a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/><path d="M5.5 15a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/><path d="M12 15V8l2.5-3"/><path d="m11 5 3-3 3 3"/><path d="M13.5 15l-1.5-7-2-2"/></svg>
            <span className="font-black text-[14px] tracking-[2px] uppercase text-brand-accent">Routen Dash</span>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'roulette' ? (
            <RouletteView routes={routes} />
          ) : (
            <RoutesView 
              routes={routes} 
              addRoute={addRoute} 
              deleteRoute={deleteRoute} 
              updateRoute={updateRoute}
            />
          )}
        </div>

        {/* Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}

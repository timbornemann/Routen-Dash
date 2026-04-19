import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BikeRoute } from '../types';
import { MapPin, Route, Mountain, Timer } from 'lucide-react';

interface RouletteViewProps {
  routes: BikeRoute[];
}

export function RouletteView({ routes }: RouletteViewProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BikeRoute | null>(null);
  const [displayRoute, setDisplayRoute] = useState<BikeRoute | null>(null);
  const [spinResultKey, setSpinResultKey] = useState(0);

  const spin = () => {
    if (routes.length === 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedRoute(null);
    setSpinResultKey(prev => prev + 1);

    const targetRoute = routes[Math.floor(Math.random() * routes.length)];
    
    // Animation logic: cycle through random routes 
    let duration = 50; // starts fast
    let currentTime = 0;
    const maxTime = 3000; // 3 seconds spin

    const tick = () => {
      currentTime += duration;
      
      // Update display with a random route during the spin
      const randomRoute = routes[Math.floor(Math.random() * routes.length)];
      setDisplayRoute(randomRoute);

      if (currentTime < maxTime) {
        // Slow down gradually
        duration = Math.min(duration * 1.1, 400);
        setTimeout(tick, duration);
      } else {
        setIsSpinning(false);
        setDisplayRoute(targetRoute);
        setSelectedRoute(targetRoute);
      }
    };

    tick();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full h-full pb-20">
      
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand-text mb-2">
            Wohin geht die Fahrt?
          </h1>
          <p className="text-brand-dim">
            {routes.length} Routen zur Auswahl
          </p>
        </div>

        <div 
          className="relative w-[280px] h-[280px] mx-auto rounded-full border-4 border-brand-light flex items-center justify-center mb-12"
          style={{ background: 'radial-gradient(circle, var(--color-brand-light) 0%, transparent 70%)' }}
        >
          {/* Wheel Indicator */}
          <div className="absolute -top-[10px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-brand-accent z-10" />
          
          <AnimatePresence mode="popLayout">
            {!displayRoute ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-brand-dim font-medium text-lg flex flex-col items-center"
              >
                <span className="text-6xl mb-2">🚲</span>
                Klicke auf Start!
              </motion.div>
            ) : (
              <motion.div
                key={isSpinning ? displayRoute.id + Math.random() : `result-${spinResultKey}`}
                initial={{ y: 50, opacity: 0, filter: isSpinning ? "blur(4px)" : "blur(0px)" }}
                animate={{ y: 0, opacity: 1, filter: isSpinning ? "blur(2px)" : "blur(0px)" }}
                exit={{ y: -50, opacity: 0, filter: isSpinning ? "blur(4px)" : "blur(0px)" }}
                transition={{ duration: isSpinning ? 0.05 : 0.5, type: isSpinning ? 'tween' : 'spring' }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="inline-block px-2.5 py-1 rounded-[20px] bg-brand-accent/10 text-brand-accent font-bold text-[10px] uppercase tracking-wider mb-2">
                  {displayRoute.type}
                </div>
                <h2 className="text-[28px] font-bold text-brand-text leading-tight mb-2">
                  {displayRoute.name}
                </h2>
                
                {displayRoute.distance && (
                  <div className="text-brand-dim text-[14px] flex items-center gap-1">
                    <Route size={14} /> 
                    {displayRoute.distance} km
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Winning highlight ring */}
          {!isSpinning && selectedRoute && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 border-[6px] border-brand-accent rounded-full pointer-events-none"
            />
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={spin}
          disabled={routes.length === 0 || isSpinning}
          className="w-full bg-brand-accent hover:opacity-90 disabled:bg-brand-surface disabled:text-brand-dim disabled:cursor-not-allowed text-black font-extrabold p-5 rounded-2xl uppercase tracking-wider transition-all text-lg border-none"
        >
          {isSpinning ? 'Mischt...' : 'Tour wählen'}
        </motion.button>
      </div>

    </div>
  );
}

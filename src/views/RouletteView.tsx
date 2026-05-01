import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BikeRoute } from '../types';
import { Route, Timer } from 'lucide-react';

type TimeFilter = 'egal' | '30-45' | '45-60' | '60-120' | '120-180' | '180+';
type DistanceFilter = 'egal' | '0-5' | '0-10' | '0-15' | '0-20' | '0-25' | '0-30' | '30+';

interface RouletteViewProps { routes: BikeRoute[]; }

export function RouletteView({ routes }: RouletteViewProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BikeRoute | null>(null);
  const [displayRoute, setDisplayRoute] = useState<BikeRoute | null>(null);
  const [spinResultKey, setSpinResultKey] = useState(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('egal');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('egal');

  const filteredRoutes = useMemo(() => routes.filter(route => {
    const byTime = timeFilter === 'egal' ||
      (timeFilter === '30-45' && route.duration >= 30 && route.duration <= 45) ||
      (timeFilter === '45-60' && route.duration > 45 && route.duration <= 60) ||
      (timeFilter === '60-120' && route.duration > 60 && route.duration <= 120) ||
      (timeFilter === '120-180' && route.duration > 120 && route.duration <= 180) ||
      (timeFilter === '180+' && route.duration > 180);

    const byDistance = distanceFilter === 'egal' ||
      (distanceFilter === '0-5' && route.distance <= 5) ||
      (distanceFilter === '0-10' && route.distance <= 10) ||
      (distanceFilter === '0-15' && route.distance <= 15) ||
      (distanceFilter === '0-20' && route.distance <= 20) ||
      (distanceFilter === '0-25' && route.distance <= 25) ||
      (distanceFilter === '0-30' && route.distance <= 30) ||
      (distanceFilter === '30+' && route.distance > 30);

    return byTime && byDistance;
  }), [routes, timeFilter, distanceFilter]);

  const spin = () => {
    if (filteredRoutes.length === 0 || isSpinning) return;
    setIsSpinning(true); setSelectedRoute(null); setSpinResultKey(prev => prev + 1);
    const targetRoute = filteredRoutes[Math.floor(Math.random() * filteredRoutes.length)];
    let duration = 50; let currentTime = 0; const maxTime = 3000;
    const tick = () => {
      currentTime += duration;
      setDisplayRoute(filteredRoutes[Math.floor(Math.random() * filteredRoutes.length)]);
      if (currentTime < maxTime) { duration = Math.min(duration * 1.1, 400); setTimeout(tick, duration); }
      else { setIsSpinning(false); setDisplayRoute(targetRoute); setSelectedRoute(targetRoute); }
    };
    tick();
  };

  return <div className="flex-1 flex flex-col items-center justify-start px-6 pt-4 pb-6 w-full h-full">
    <div className="w-full max-w-md mb-7 grid grid-cols-2 gap-3">
      <select value={timeFilter} onChange={(e)=>setTimeFilter(e.target.value as TimeFilter)} className="bg-brand-light border border-brand-border rounded-[10px] p-2 text-sm">
        <option value="egal">Zeit: egal</option><option value="30-45">30–45 min</option><option value="45-60">bis 1 Stunde</option><option value="60-120">bis 2 Stunden</option><option value="120-180">bis 3 Stunden</option><option value="180+">größer 3 Stunden</option>
      </select>
      <select value={distanceFilter} onChange={(e)=>setDistanceFilter(e.target.value as DistanceFilter)} className="bg-brand-light border border-brand-border rounded-[10px] p-2 text-sm">
        <option value="egal">Strecke: egal</option><option value="0-5">bis 5 km</option><option value="0-10">bis 10 km</option><option value="0-15">bis 15 km</option><option value="0-20">bis 20 km</option><option value="0-25">bis 25 km</option><option value="0-30">bis 30 km</option><option value="30+">größer 30 km</option>
      </select>
    </div>
    <div className="flex-1 w-full flex flex-col items-center justify-center"><div className="mb-8 text-center"><h1 className="text-3xl font-bold tracking-tight text-brand-text mb-2">Wohin geht die Fahrt?</h1><p className="text-brand-dim">{filteredRoutes.length} von {routes.length} Routen zur Auswahl</p></div>
      <div className="relative w-[280px] h-[280px] mx-auto rounded-full border-4 border-brand-light flex items-center justify-center mb-12" style={{ background: 'radial-gradient(circle, var(--color-brand-light) 0%, transparent 70%)' }}>
        <div className="absolute -top-[10px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-brand-accent z-10" />
        <AnimatePresence mode="popLayout">{!displayRoute ? <motion.div key="empty" className="text-brand-dim font-medium text-lg flex flex-col items-center"><span className="text-6xl mb-2">🚲</span>Klicke auf Start!</motion.div> : <motion.div key={isSpinning ? displayRoute.id + Math.random() : `result-${spinResultKey}`} className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"><div className="inline-block px-2.5 py-1 rounded-[20px] bg-brand-accent/10 text-brand-accent font-bold text-[10px] uppercase tracking-wider mb-2">{displayRoute.type}</div><h2 className="text-[28px] font-bold text-brand-text leading-tight mb-2">{displayRoute.name}</h2><div className="text-brand-dim text-[14px] flex flex-col items-center gap-1"><span className="flex items-center gap-1"><Route size={14} /> {displayRoute.distance} km</span><span className="flex items-center gap-1"><Timer size={14} /> {displayRoute.duration} min</span></div></motion.div>}</AnimatePresence>
        {!isSpinning && selectedRoute && <motion.div className="absolute inset-0 border-[6px] border-brand-accent rounded-full pointer-events-none" />}
      </div>
      <motion.button onClick={spin} disabled={filteredRoutes.length === 0 || isSpinning} className="w-full mb-4 bg-brand-accent disabled:bg-brand-surface disabled:text-brand-dim text-black font-extrabold p-5 rounded-2xl uppercase tracking-wider text-lg border-none">{isSpinning ? 'Mischt...' : 'Tour wählen'}</motion.button>
    </div></div>;
}

import { useState, useEffect } from 'react';
import { BikeRoute } from '../types';
import { INITIAL_ROUTES } from '../lib/constants';

const isValidRoute = (route: unknown): route is BikeRoute => {
  if (!route || typeof route !== 'object') return false;
  const candidate = route as Partial<BikeRoute>;
  return Boolean(
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.distance === 'number' &&
    Number.isFinite(candidate.distance) &&
    typeof candidate.duration === 'number' &&
    Number.isFinite(candidate.duration) &&
    typeof candidate.type === 'string' &&
    typeof candidate.difficulty === 'string'
  );
};

export function useRoutes() {
  const [routes, setRoutes] = useState<BikeRoute[]>(() => {
    try {
      const item = window.localStorage.getItem('bike-routes');
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          const normalized = parsed
            .map((route) => {
              if (!route || typeof route !== 'object') return null;
              const candidate = route as Partial<BikeRoute> & { duration?: number };
              const migrated = {
                ...candidate,
                duration: typeof candidate.duration === 'number' ? candidate.duration : 60
              };
              return isValidRoute(migrated) ? migrated : null;
            })
            .filter((route): route is BikeRoute => Boolean(route));

          if (normalized.length > 0) {
            return normalized;
          }
        }
      }
      window.localStorage.setItem('bike-routes', JSON.stringify(INITIAL_ROUTES));
      return INITIAL_ROUTES;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return INITIAL_ROUTES;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bike-routes', JSON.stringify(routes));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [routes]);

  const addRoute = (route: Omit<BikeRoute, 'id'>) => {
    const newRoute = { ...route, id: crypto.randomUUID() };
    setRoutes(prev => [...prev, newRoute]);
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  const updateRoute = (updatedRoute: BikeRoute) => {
    setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
  };

  const importRoutes = (importedRoutes: BikeRoute[]) => {
    setRoutes(importedRoutes);
  };

  return { routes, addRoute, deleteRoute, updateRoute, importRoutes };
}

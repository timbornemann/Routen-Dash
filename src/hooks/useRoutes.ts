import { useState, useEffect } from 'react';
import { BikeRoute } from '../types';
import { INITIAL_ROUTES } from '../lib/constants';

export function useRoutes() {
  const [routes, setRoutes] = useState<BikeRoute[]>(() => {
    try {
      const item = window.localStorage.getItem('bike-routes');
      if (item) {
        return JSON.parse(item);
      }
      // If empty on first load, save initial routes to give user a starting point
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

  return { routes, addRoute, deleteRoute, updateRoute };
}

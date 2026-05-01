import { BikeRoute } from '../types';

export const INITIAL_ROUTES: BikeRoute[] = [
  { id: '1', name: 'Feierabendrunde am See', distance: 25, duration: 60, type: 'Road', difficulty: 'Leicht' },
  { id: '2', name: 'Hügeltour durch den Wald', distance: 40, duration: 95, type: 'Gravel', difficulty: 'Mittel' },
  { id: '3', name: 'Epische Berg-Challenge', distance: 80, duration: 210, type: 'Road', difficulty: 'Schwer' },
  { id: '4', name: 'Gemütliche Flusstal-Tour', distance: 30, duration: 75, type: 'Touring', difficulty: 'Leicht' }
];

export const ROUTE_TYPES = ['Road', 'Gravel', 'MTB', 'Touring', 'City'] as const;
export const DIFFICULTIES = ['Leicht', 'Mittel', 'Schwer'] as const;

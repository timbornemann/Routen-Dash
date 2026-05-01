export interface BikeRoute {
  id: string;
  name: string;
  distance: number; // in km
  duration: number; // in minutes
  type: RouteType;
  difficulty: Difficulty;
}

export type RouteType = 'Gravel' | 'Road' | 'MTB' | 'Touring' | 'City';
export type Difficulty = 'Leicht' | 'Mittel' | 'Schwer';

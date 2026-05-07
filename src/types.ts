export type Sport = 'pickleball' | 'badminton' | 'both';
export type SessionSport = 'pickleball' | 'badminton';
export type CourtStatus = 'available' | 'in_use' | 'closed';
export type MatchStatus = 'pending' | 'playing' | 'done';

export interface Player {
  id: number;
  name: string;
  sport: Sport;
  skillLevel: number;
  active: boolean;
  createdAt?: string;
}

export interface Court {
  id: number;
  name: string;
  sport: Sport;
  status: CourtStatus;
  hourlyRate: number | string;
}

export interface Session {
  id: number;
  sessionDate: string;
  sport: SessionSport;
  hours: number | string;
  shuttleCost: number | string;
  miscCost: number | string;
}

export interface SessionDetail extends Session {
  courts: Court[];
  players: (Player & { gamesPlayed: number })[];
}

export interface Forecast {
  sessionId: number;
  hours: number;
  courtCost: number;
  shuttleCost: number;
  miscCost: number;
  total: number;
  playerCount: number;
  perPlayer: number;
}

export interface QueueMatch {
  id: number;
  sessionId: number;
  roundNo: number;
  courtId: number | null;
  courtName?: string | null;
  teamA: number[];
  teamB: number[];
  status: MatchStatus;
  createdAt?: string;
}

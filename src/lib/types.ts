export interface Driver {
  id: string;
  name: string;
  shortName: string;
  teamId: string;
  teamName: string;
  teamColour?: string;
  points: number;
}

export interface Constructor {
  id: string;
  name: string;
  points: number;
}

export interface FantasyTeam {
  id: string;
  ownerName: string;
  drivers: Driver[];
  constructors: Constructor[];
  totalPoints: number;
  pointsByRound: { round: number; points: number; cumulative: number }[];
}

export interface RoundSummary {
  round: number;
  roundName: string;
  date: string;
  espnRaceId: string;
}

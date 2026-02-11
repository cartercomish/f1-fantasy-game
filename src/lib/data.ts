import type { Driver, Constructor, FantasyTeam, RoundSummary } from "./types";

// 2026 season – first race March 7 (Australia)
const SEASON_YEAR = 2026;

// ESPN race IDs for 2026 season (from espn.com/f1/race/_/id/{id})
const ROUNDS: RoundSummary[] = [
  { round: 1, roundName: "Australia", date: "2026-03-07", espnRaceId: "600057427" },
  { round: 2, roundName: "China", date: "2026-03-15", espnRaceId: "600057428" },
  { round: 3, roundName: "Japan", date: "2026-03-29", espnRaceId: "600057429" },
  { round: 4, roundName: "Bahrain", date: "2026-04-12", espnRaceId: "600057430" },
  { round: 5, roundName: "Saudi Arabia", date: "2026-04-19", espnRaceId: "600057431" },
  { round: 6, roundName: "Miami", date: "2026-05-03", espnRaceId: "600057432" },
  { round: 7, roundName: "Canada", date: "2026-05-24", espnRaceId: "600057433" },
  { round: 8, roundName: "Monaco", date: "2026-06-07", espnRaceId: "600057434" },
  { round: 9, roundName: "Barcelona-Catalunya", date: "2026-06-14", espnRaceId: "600057435" },
  { round: 10, roundName: "Austria", date: "2026-06-28", espnRaceId: "600057436" },
  { round: 11, roundName: "British", date: "2026-07-05", espnRaceId: "600057437" },
  { round: 12, roundName: "Belgian", date: "2026-07-19", espnRaceId: "600057439" },
  { round: 13, roundName: "Hungarian", date: "2026-07-26", espnRaceId: "600057440" },
  { round: 14, roundName: "Dutch", date: "2026-08-23", espnRaceId: "600057441" },
  { round: 15, roundName: "Italian", date: "2026-09-06", espnRaceId: "600057442" },
  { round: 16, roundName: "Spanish", date: "2026-09-13", espnRaceId: "600057443" },
  { round: 17, roundName: "Azerbaijan", date: "2026-09-26", espnRaceId: "600057444" },
  { round: 18, roundName: "Singapore", date: "2026-10-11", espnRaceId: "600057445" },
  { round: 19, roundName: "United States", date: "2026-10-25", espnRaceId: "600057446" },
  { round: 20, roundName: "Mexico City", date: "2026-11-01", espnRaceId: "600057447" },
  { round: 21, roundName: "São Paulo", date: "2026-11-08", espnRaceId: "600057448" },
  { round: 22, roundName: "Las Vegas", date: "2026-11-21", espnRaceId: "600057449" },
  { round: 23, roundName: "Qatar", date: "2026-11-29", espnRaceId: "600057450" },
  { round: 24, roundName: "Abu Dhabi", date: "2026-12-06", espnRaceId: "600057451" },
];

// 2026 driver grid (11 teams, 22 drivers) – season not started, all points = 0
const DRIVER_POINTS_BY_ROUND: Record<string, number[]> = {
  norris: ROUNDS.map(() => 0),
  piastri: ROUNDS.map(() => 0),
  russell: ROUNDS.map(() => 0),
  antonelli: ROUNDS.map(() => 0),
  max_verstappen: ROUNDS.map(() => 0),
  hadjar: ROUNDS.map(() => 0),
  leclerc: ROUNDS.map(() => 0),
  hamilton: ROUNDS.map(() => 0),
  sainz: ROUNDS.map(() => 0),
  albon: ROUNDS.map(() => 0),
  lawson: ROUNDS.map(() => 0),
  lindblad: ROUNDS.map(() => 0),
  alonso: ROUNDS.map(() => 0),
  stroll: ROUNDS.map(() => 0),
  ocon: ROUNDS.map(() => 0),
  bearman: ROUNDS.map(() => 0),
  hulkenberg: ROUNDS.map(() => 0),
  bortoleto: ROUNDS.map(() => 0),
  gasly: ROUNDS.map(() => 0),
  colapinto: ROUNDS.map(() => 0),
  perez: ROUNDS.map(() => 0),
  bottas: ROUNDS.map(() => 0),
};

// 2026 constructors (11 teams)
const CONSTRUCTOR_POINTS_BY_ROUND: Record<string, number[]> = {
  mclaren: ROUNDS.map(() => 0),
  mercedes: ROUNDS.map(() => 0),
  red_bull: ROUNDS.map(() => 0),
  ferrari: ROUNDS.map(() => 0),
  williams: ROUNDS.map(() => 0),
  racing_bulls: ROUNDS.map(() => 0),
  aston_martin: ROUNDS.map(() => 0),
  haas: ROUNDS.map(() => 0),
  audi: ROUNDS.map(() => 0),
  alpine: ROUNDS.map(() => 0),
  cadillac: ROUNDS.map(() => 0),
};

const DRIVER_META: Record<string, { name: string; shortName: string; teamId: string; teamName: string; teamColour?: string }> = {
  norris: { name: "Lando Norris", shortName: "NOR", teamId: "mclaren", teamName: "McLaren", teamColour: "#F58020" },
  piastri: { name: "Oscar Piastri", shortName: "PIA", teamId: "mclaren", teamName: "McLaren", teamColour: "#F58020" },
  russell: { name: "George Russell", shortName: "RUS", teamId: "mercedes", teamName: "Mercedes", teamColour: "#03DAC6" },
  antonelli: { name: "Kimi Antonelli", shortName: "ANT", teamId: "mercedes", teamName: "Mercedes", teamColour: "#03DAC6" },
  max_verstappen: { name: "Max Verstappen", shortName: "VER", teamId: "red_bull", teamName: "Red Bull Racing", teamColour: "#3671C6" },
  hadjar: { name: "Isack Hadjar", shortName: "HAD", teamId: "red_bull", teamName: "Red Bull Racing", teamColour: "#3671C6" },
  leclerc: { name: "Charles Leclerc", shortName: "LEC", teamId: "ferrari", teamName: "Ferrari", teamColour: "#E8002D" },
  hamilton: { name: "Lewis Hamilton", shortName: "HAM", teamId: "ferrari", teamName: "Ferrari", teamColour: "#E8002D" },
  sainz: { name: "Carlos Sainz", shortName: "SAI", teamId: "williams", teamName: "Williams", teamColour: "#37BEDD" },
  albon: { name: "Alex Albon", shortName: "ALB", teamId: "williams", teamName: "Williams", teamColour: "#37BEDD" },
  lawson: { name: "Liam Lawson", shortName: "LAW", teamId: "racing_bulls", teamName: "Racing Bulls", teamColour: "#6692FF" },
  lindblad: { name: "Arvid Lindblad", shortName: "LIN", teamId: "racing_bulls", teamName: "Racing Bulls", teamColour: "#6692FF" },
  alonso: { name: "Fernando Alonso", shortName: "ALO", teamId: "aston_martin", teamName: "Aston Martin", teamColour: "#006F62" },
  stroll: { name: "Lance Stroll", shortName: "STR", teamId: "aston_martin", teamName: "Aston Martin", teamColour: "#006F62" },
  ocon: { name: "Esteban Ocon", shortName: "OCO", teamId: "haas", teamName: "Haas", teamColour: "#FFFFFF" },
  bearman: { name: "Oliver Bearman", shortName: "BEA", teamId: "haas", teamName: "Haas", teamColour: "#FFFFFF" },
  hulkenberg: { name: "Nico Hülkenberg", shortName: "HUL", teamId: "audi", teamName: "Audi", teamColour: "#BB0A30" },
  bortoleto: { name: "Gabriel Bortoleto", shortName: "BOR", teamId: "audi", teamName: "Audi", teamColour: "#BB0A30" },
  gasly: { name: "Pierre Gasly", shortName: "GAS", teamId: "alpine", teamName: "Alpine", teamColour: "#FE8002" },
  colapinto: { name: "Franco Colapinto", shortName: "COL", teamId: "alpine", teamName: "Alpine", teamColour: "#FE8002" },
  perez: { name: "Sergio Pérez", shortName: "PER", teamId: "cadillac", teamName: "Cadillac", teamColour: "#1A1A1A" },
  bottas: { name: "Valtteri Bottas", shortName: "BOT", teamId: "cadillac", teamName: "Cadillac", teamColour: "#1A1A1A" },
};

const CONSTRUCTOR_META: Record<string, string> = {
  mclaren: "McLaren",
  mercedes: "Mercedes",
  red_bull: "Red Bull Racing",
  ferrari: "Ferrari",
  williams: "Williams",
  racing_bulls: "Racing Bulls",
  aston_martin: "Aston Martin",
  haas: "Haas",
  audi: "Audi",
  alpine: "Alpine",
  cadillac: "Cadillac",
};

// Fantasy team rosters (3 teams, 7 drivers + 3 constructors each) – sample for 2026
const TEAM_ROSTERS = [
  {
    id: "team-1",
    ownerName: "Team Alpha",
    driverIds: ["max_verstappen", "norris", "leclerc", "alonso", "lawson", "albon", "gasly"],
    constructorIds: ["red_bull", "mclaren", "aston_martin"],
  },
  {
    id: "team-2",
    ownerName: "Team Beta",
    driverIds: ["piastri", "russell", "sainz", "hamilton", "stroll", "ocon", "hulkenberg"],
    constructorIds: ["ferrari", "mercedes", "racing_bulls"],
  },
  {
    id: "team-3",
    ownerName: "Team Gamma",
    driverIds: ["hadjar", "antonelli", "bortoleto", "bearman", "lindblad", "colapinto"],
    constructorIds: ["williams", "haas", "audi"],
  },
];

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function getDriverPoints(driverId: string): number {
  const pts = DRIVER_POINTS_BY_ROUND[driverId];
  return pts ? sum(pts) : 0;
}

function getConstructorPoints(constructorId: string): number {
  const pts = CONSTRUCTOR_POINTS_BY_ROUND[constructorId];
  return pts ? sum(pts) : 0;
}

function getDriverPointsByRound(driverId: string): number[] {
  return DRIVER_POINTS_BY_ROUND[driverId] ?? [];
}

function getConstructorPointsByRound(constructorId: string): number[] {
  return CONSTRUCTOR_POINTS_BY_ROUND[constructorId] ?? [];
}

export function getSeasonYear(): number {
  return SEASON_YEAR;
}

export function getTeams(): FantasyTeam[] {
  return TEAM_ROSTERS.map((roster) => {
    const drivers: Driver[] = roster.driverIds.map((id) => {
      const meta = DRIVER_META[id];
      const points = getDriverPoints(id);
      return {
        id,
        name: meta?.name ?? id,
        shortName: meta?.shortName ?? id.slice(0, 3).toUpperCase(),
        teamId: meta?.teamId ?? "",
        teamName: meta?.teamName ?? "",
        teamColour: meta?.teamColour,
        points,
      };
    });
    const constructors: Constructor[] = roster.constructorIds.map((id) => ({
      id,
      name: CONSTRUCTOR_META[id] ?? id,
      points: getConstructorPoints(id),
    }));
    const totalPoints = drivers.reduce((a, d) => a + d.points, 0) + constructors.reduce((a, c) => a + c.points, 0);

    let cumulative = 0;
    const pointsByRound = ROUNDS.map((r, i) => {
      const driverRoundPts = roster.driverIds.reduce((acc, did) => {
        const arr = getDriverPointsByRound(did);
        return acc + (arr[i] ?? 0);
      }, 0);
      const constructorRoundPts = roster.constructorIds.reduce((acc, cid) => {
        const arr = getConstructorPointsByRound(cid);
        return acc + (arr[i] ?? 0);
      }, 0);
      const roundPoints = driverRoundPts + constructorRoundPts;
      cumulative += roundPoints;
      return { round: r.round, points: roundPoints, cumulative };
    });

    return {
      id: roster.id,
      ownerName: roster.ownerName,
      drivers,
      constructors,
      totalPoints,
      pointsByRound,
    };
  });
}

export function getTeamById(id: string): FantasyTeam | undefined {
  return getTeams().find((t) => t.id === id);
}

export function getRounds(): RoundSummary[] {
  return ROUNDS;
}

// All drafted drivers (across all teams)
export function getAllDraftedDrivers(): Driver[] {
  const seen = new Set<string>();
  const drivers: Driver[] = [];
  for (const team of getTeams()) {
    for (const d of team.drivers) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        drivers.push(d);
      }
    }
  }
  return drivers;
}

// Top 3 and bottom 3 drafted drivers
export function getTopAndBottomDrivers(): { top: Driver[]; bottom: Driver[] } {
  const drafted = getAllDraftedDrivers().sort((a, b) => b.points - a.points);
  return {
    top: drafted.slice(0, 3),
    bottom: drafted.slice(-3),
  };
}

// All drafted constructors
export function getAllDraftedConstructors(): Constructor[] {
  const seen = new Set<string>();
  const constructors: Constructor[] = [];
  for (const team of getTeams()) {
    for (const c of team.constructors) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        constructors.push(c);
      }
    }
  }
  return constructors;
}

export function getTopAndBottomConstructors(): { top: Constructor[]; bottom: Constructor[] } {
  const drafted = getAllDraftedConstructors().sort((a, b) => b.points - a.points);
  return {
    top: drafted.slice(0, 3),
    bottom: drafted.slice(-3),
  };
}

import { cache } from "react";
import type { Driver, Constructor, FantasyTeam, RoundSummary } from "./types";
import { fetchAllRoundsPoints } from "./espn";

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

// 2026 driver grid (11 teams, 22 drivers)
const DRIVER_IDS = [
  "norris", "piastri", "russell", "antonelli", "max_verstappen", "hadjar",
  "leclerc", "hamilton", "sainz", "albon", "lawson", "lindblad",
  "alonso", "stroll", "ocon", "bearman", "hulkenberg", "bortoleto",
  "gasly", "colapinto", "perez", "bottas",
] as const;

function buildDriverPointsByRound(cache: Record<string, Record<string, number>>): Record<string, number[]> {
  const base = Object.fromEntries(DRIVER_IDS.map((id) => [id, ROUNDS.map(() => 0)]));
  const rounds = cache ?? {};
  for (const [roundKey, driverPts] of Object.entries(rounds)) {
    const roundIdx = parseInt(roundKey, 10) - 1;
    if (roundIdx >= 0 && roundIdx < ROUNDS.length) {
      for (const [driverId, pts] of Object.entries(driverPts)) {
        if (base[driverId]) {
          base[driverId][roundIdx] = pts;
        }
      }
    }
  }
  return base;
}

// 2026 constructors (11 teams) – points = (driver1 + driver2) / 2 per round
const CONSTRUCTOR_IDS = [
  "mclaren", "mercedes", "red_bull", "ferrari", "williams", "racing_bulls",
  "aston_martin", "haas", "audi", "alpine", "cadillac",
] as const;

/** Each F1 constructor's two drivers – used for constructor points = avg of their driver points */
const CONSTRUCTOR_DRIVERS: Record<string, [string, string]> = {
  mclaren: ["norris", "piastri"],
  mercedes: ["russell", "antonelli"],
  red_bull: ["max_verstappen", "hadjar"],
  ferrari: ["leclerc", "hamilton"],
  williams: ["sainz", "albon"],
  racing_bulls: ["lawson", "lindblad"],
  aston_martin: ["alonso", "stroll"],
  haas: ["ocon", "bearman"],
  audi: ["hulkenberg", "bortoleto"],
  alpine: ["gasly", "colapinto"],
  cadillac: ["perez", "bottas"],
};

function buildConstructorPointsByRound(driverPointsByRound: Record<string, number[]>): Record<string, number[]> {
  const base = Object.fromEntries(CONSTRUCTOR_IDS.map((id) => [id, ROUNDS.map(() => 0)]));
  const drivers = CONSTRUCTOR_DRIVERS;
  for (const [constructorId, [d1, d2]] of Object.entries(drivers)) {
    if (!base[constructorId]) continue;
    const p1 = driverPointsByRound[d1] ?? [];
    const p2 = driverPointsByRound[d2] ?? [];
    for (let i = 0; i < ROUNDS.length; i++) {
      const sum = (p1[i] ?? 0) + (p2[i] ?? 0);
      base[constructorId][i] = Math.round((sum / 2) * 10) / 10; // avg, 1 decimal
    }
  }
  return base;
}

const DRIVER_META: Record<string, { name: string; shortName: string; teamId: string; teamName: string }> = {
  norris: { name: "Lando Norris", shortName: "NOR", teamId: "mclaren", teamName: "McLaren" },
  piastri: { name: "Oscar Piastri", shortName: "PIA", teamId: "mclaren", teamName: "McLaren" },
  russell: { name: "George Russell", shortName: "RUS", teamId: "mercedes", teamName: "Mercedes" },
  antonelli: { name: "Kimi Antonelli", shortName: "ANT", teamId: "mercedes", teamName: "Mercedes" },
  max_verstappen: { name: "Max Verstappen", shortName: "VER", teamId: "red_bull", teamName: "Red Bull Racing" },
  hadjar: { name: "Isack Hadjar", shortName: "HAD", teamId: "red_bull", teamName: "Red Bull Racing" },
  leclerc: { name: "Charles Leclerc", shortName: "LEC", teamId: "ferrari", teamName: "Ferrari" },
  hamilton: { name: "Lewis Hamilton", shortName: "HAM", teamId: "ferrari", teamName: "Ferrari" },
  sainz: { name: "Carlos Sainz", shortName: "SAI", teamId: "williams", teamName: "Williams" },
  albon: { name: "Alex Albon", shortName: "ALB", teamId: "williams", teamName: "Williams" },
  lawson: { name: "Liam Lawson", shortName: "LAW", teamId: "racing_bulls", teamName: "Racing Bulls" },
  lindblad: { name: "Arvid Lindblad", shortName: "LIN", teamId: "racing_bulls", teamName: "Racing Bulls" },
  alonso: { name: "Fernando Alonso", shortName: "ALO", teamId: "aston_martin", teamName: "Aston Martin" },
  stroll: { name: "Lance Stroll", shortName: "STR", teamId: "aston_martin", teamName: "Aston Martin" },
  ocon: { name: "Esteban Ocon", shortName: "OCO", teamId: "haas", teamName: "Haas" },
  bearman: { name: "Oliver Bearman", shortName: "BEA", teamId: "haas", teamName: "Haas" },
  hulkenberg: { name: "Nico Hülkenberg", shortName: "HUL", teamId: "audi", teamName: "Audi" },
  bortoleto: { name: "Gabriel Bortoleto", shortName: "BOR", teamId: "audi", teamName: "Audi" },
  gasly: { name: "Pierre Gasly", shortName: "GAS", teamId: "alpine", teamName: "Alpine" },
  colapinto: { name: "Franco Colapinto", shortName: "COL", teamId: "alpine", teamName: "Alpine" },
  perez: { name: "Sergio Pérez", shortName: "PER", teamId: "cadillac", teamName: "Cadillac" },
  bottas: { name: "Valtteri Bottas", shortName: "BOT", teamId: "cadillac", teamName: "Cadillac" },
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

const CONSTRUCTOR_COLOURS: Record<string, string> = {
  mclaren: "#F58020",
  mercedes: "#03DAC6",
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  williams: "#005AFF",
  racing_bulls: "#6692FF",
  aston_martin: "#006F62",
  haas: "#FFFFFF",
  audi: "#BB0A30",
  alpine: "#005CA9",
  cadillac: "#1A1A1A",
};

// Redraft occurs between round 13 (Hungary, July 24-26) and round 14 (Netherlands, Aug 21-23).
// Period 1: rounds 1-13 (first half). Period 2: rounds 14-24 (second half, after redraft).
const REDRAFT_AFTER_ROUND = 13;

// Which roster to show on team pages. Change to 2 after the mid-season redraft.
const DISPLAY_PERIOD: 1 | 2 = 1;

interface TeamRoster {
  id: string;
  ownerName: string;
  logoUrl: string;
  driverIds: string[];
  constructorIds: string[];
}

// Period 1: Initial draft (rounds 1-13)
const ROSTERS_PERIOD_1: TeamRoster[] = [
  {
    id: "team-1",
    ownerName: "Logic Gate Racing",
    logoUrl: "/logic-gate-racing.png",
    driverIds: ["leclerc", "hamilton", "alonso", "sainz", "bottas", "perez", "stroll"],
    constructorIds: ["mercedes", "audi", "cadillac"],
  },
  {
    id: "team-2",
    ownerName: "Louie's Lead Foot",
    logoUrl: "/louies-lead-foot.png",
    driverIds: ["max_verstappen", "piastri", "norris", "gasly", "albon", "bortoleto", "ocon"],
    constructorIds: ["mclaren", "red_bull", "alpine"],
  },
  {
    id: "team-3",
    ownerName: "Wildfire Laps",
    logoUrl: "/wildfire-laps.png",
    driverIds: ["russell", "antonelli", "hadjar", "hulkenberg", "lawson", "bearman", "lindblad"],
    constructorIds: ["ferrari", "aston_martin", "williams"],
  },
];

// Period 2: After redraft (rounds 14-24). Update this block after the mid-season redraft.
const ROSTERS_PERIOD_2: TeamRoster[] = [
  {
    id: "team-1",
    ownerName: "Logic Gate Racing",
    logoUrl: "/logic-gate-racing.png",
    driverIds: ["leclerc", "hamilton", "alonso", "sainz", "bottas", "perez", "stroll"],
    constructorIds: ["mercedes", "audi", "cadillac"],
  },
  {
    id: "team-2",
    ownerName: "Louie's Lead Foot",
    logoUrl: "/louies-lead-foot.png",
    driverIds: ["max_verstappen", "piastri", "norris", "gasly", "albon", "bortoleto", "ocon"],
    constructorIds: ["mclaren", "red_bull", "alpine"],
  },
  {
    id: "team-3",
    ownerName: "Wildfire Laps",
    logoUrl: "/wildfire-laps.png",
    driverIds: ["russell", "antonelli", "hadjar", "hulkenberg", "lawson", "bearman", "lindblad"],
    constructorIds: ["ferrari", "aston_martin", "williams"],
  },
];

function getRosterForRound(round: number): TeamRoster[] {
  return round <= REDRAFT_AFTER_ROUND ? ROSTERS_PERIOD_1 : ROSTERS_PERIOD_2;
}

const getPointsCache = cache(async () => {
  const rounds = await fetchAllRoundsPoints(ROUNDS);
  return rounds;
});

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function getSeasonYear(): number {
  return SEASON_YEAR;
}

export function getRounds(): RoundSummary[] {
  return ROUNDS;
}

export async function getTeamsAsync(): Promise<FantasyTeam[]> {
  const pointsCache = await getPointsCache();
  const driverPointsByRound = buildDriverPointsByRound(pointsCache);
  const constructorPointsByRound = buildConstructorPointsByRound(driverPointsByRound);

  const getDriverPoints = (driverId: string) => {
    const pts = driverPointsByRound[driverId];
    return pts ? sum(pts) : 0;
  };
  const getConstructorPoints = (constructorId: string) => {
    const pts = constructorPointsByRound[constructorId];
    return pts ? sum(pts) : 0;
  };
  const getDriverPointsByRound = (driverId: string) => driverPointsByRound[driverId] ?? [];
  const getConstructorPointsByRound = (constructorId: string) => constructorPointsByRound[constructorId] ?? [];

  const displayRosters = DISPLAY_PERIOD === 1 ? ROSTERS_PERIOD_1 : ROSTERS_PERIOD_2;

  return displayRosters.map((roster) => {
    const drivers: Driver[] = roster.driverIds.map((id) => {
      const meta = DRIVER_META[id];
      const teamId = meta?.teamId ?? "";
      // Points = sum of rounds where this driver was on this team
      const points = ROUNDS.reduce((acc, r, i) => {
        const rosterForRound = getRosterForRound(r.round).find((ro) => ro.id === roster.id);
        if (rosterForRound?.driverIds.includes(id)) {
          const arr = getDriverPointsByRound(id);
          return acc + (arr[i] ?? 0);
        }
        return acc;
      }, 0);
      return {
        id,
        name: meta?.name ?? id,
        shortName: meta?.shortName ?? id.slice(0, 3).toUpperCase(),
        teamId,
        teamName: meta?.teamName ?? "",
        teamColour: teamId ? CONSTRUCTOR_COLOURS[teamId] : undefined,
        points,
      };
    });
    const constructors: Constructor[] = roster.constructorIds.map((id) => {
      const points = ROUNDS.reduce((acc, r, i) => {
        const rosterForRound = getRosterForRound(r.round).find((ro) => ro.id === roster.id);
        if (rosterForRound?.constructorIds.includes(id)) {
          const arr = getConstructorPointsByRound(id);
          return acc + (arr[i] ?? 0);
        }
        return acc;
      }, 0);
      return {
        id,
        name: CONSTRUCTOR_META[id] ?? id,
        points,
        teamColour: CONSTRUCTOR_COLOURS[id],
      };
    });

    // Points by round: use the roster active for each round (period 1 for rounds 1-13, period 2 for 14-24)
    let totalPoints = 0;
    let cumulative = 0;
    const pointsByRound = ROUNDS.map((r, i) => {
      const roundNum = r.round;
      const rosterForRound = getRosterForRound(roundNum).find((ro) => ro.id === roster.id)!;
      const driverRoundPts = rosterForRound.driverIds.reduce((acc, did) => {
        const arr = getDriverPointsByRound(did);
        return acc + (arr[i] ?? 0);
      }, 0);
      const constructorRoundPts = rosterForRound.constructorIds.reduce((acc, cid) => {
        const arr = getConstructorPointsByRound(cid);
        return acc + (arr[i] ?? 0);
      }, 0);
      const roundPoints = driverRoundPts + constructorRoundPts;
      cumulative += roundPoints;
      totalPoints += roundPoints;
      return { round: r.round, points: roundPoints, cumulative };
    });

    return {
      id: roster.id,
      ownerName: roster.ownerName,
      logoUrl: roster.logoUrl,
      drivers,
      constructors,
      totalPoints,
      pointsByRound,
    };
  });
}

export async function getTeamByIdAsync(id: string): Promise<FantasyTeam | undefined> {
  const teams = await getTeamsAsync();
  return teams.find((t) => t.id === id);
}

export async function getTopAndBottomDriversAsync(): Promise<{ top: Driver[]; bottom: Driver[] }> {
  const teams = await getTeamsAsync();
  const seen = new Set<string>();
  const drivers: Driver[] = [];
  for (const team of teams) {
    for (const d of team.drivers) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        drivers.push(d);
      }
    }
  }
  const drafted = drivers.sort((a, b) => b.points - a.points);
  return {
    top: drafted.slice(0, 3),
    bottom: drafted.slice(-3),
  };
}

export async function getTopAndBottomConstructorsAsync(): Promise<{ top: Constructor[]; bottom: Constructor[] }> {
  const teams = await getTeamsAsync();
  const seen = new Set<string>();
  const constructors: Constructor[] = [];
  for (const team of teams) {
    for (const c of team.constructors) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        constructors.push(c);
      }
    }
  }
  const drafted = constructors.sort((a, b) => b.points - a.points);
  return {
    top: drafted.slice(0, 3),
    bottom: drafted.slice(-3),
  };
}

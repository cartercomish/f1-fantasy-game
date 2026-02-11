/**
 * ESPN API client and driver ID mapping for F1 race results.
 * Maps ESPN athlete IDs to our internal driver IDs.
 */

import type { RoundSummary } from "./types";
import { positionToPoints } from "./scoring";

const ESPN_BASE = "https://sports.core.api.espn.com/v2/sports/racing/leagues/f1";

/** ESPN athlete ID → our driver ID (2026 grid) */
export const ESPN_ATHLETE_TO_DRIVER: Record<string, string> = {
  "5579": "norris",
  "5752": "piastri",
  "5503": "russell",
  "5829": "antonelli",
  "4665": "max_verstappen",
  "5790": "hadjar",
  "5498": "leclerc",
  "868": "hamilton",
  "4686": "sainz",
  "5592": "albon",
  "5741": "lawson",
  "5855": "lindblad",
  "348": "alonso",
  "4775": "stroll",
  "4678": "ocon",
  "5789": "bearman",
  "4396": "hulkenberg",
  "5835": "bortoleto",
  "5501": "gasly",
  "5823": "colapinto",
  "4472": "perez",
  "4520": "bottas",
};

export interface RaceResult {
  driverId: string;
  position: number;
  points: number;
  espnAthleteId: string;
}

export interface EspnCompetitor {
  id: string;
  order: number;
  athlete?: { $ref?: string };
  vehicle?: { manufacturer?: string };
}

export interface EspnCompetition {
  id: string;
  type?: { text?: string; abbreviation?: string };
  competitors?: EspnCompetitor[];
}

export interface EspnEvent {
  id: string;
  name?: string;
  competitions?: EspnCompetition[];
}

/**
 * Fetch race results from ESPN for a given event ID.
 * Returns driver standings for the Race competition only.
 */
export async function fetchRaceResults(espnRaceId: string): Promise<RaceResult[]> {
  const url = `${ESPN_BASE}/events/${espnRaceId}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
  }
  const event: EspnEvent = await res.json();

  const raceCompetition = event.competitions?.find(
    (c) =>
      c.type?.text === "Race" ||
      c.type?.abbreviation === "Race"
  );

  if (!raceCompetition?.competitors) {
    return [];
  }

  const results: RaceResult[] = [];

  for (const comp of raceCompetition.competitors) {
    const athleteId = comp.id;
    const driverId = ESPN_ATHLETE_TO_DRIVER[athleteId];
    if (!driverId) continue; // skip unmapped drivers (e.g. perez, bottas until we have IDs)

    const position = comp.order;
    const points = positionToPoints(position);

    results.push({
      driverId,
      position,
      points,
      espnAthleteId: athleteId,
    });
  }

  return results.sort((a, b) => a.position - b.position);
}

/**
 * Fetch race results for a given round (1-based) using the provided rounds config.
 */
export async function fetchRaceResultsForRound(
  round: number,
  rounds: RoundSummary[]
): Promise<{
  round: number;
  espnRaceId: string;
  results: RaceResult[];
  driverPoints: Record<string, number>;
}> {
  const roundInfo = rounds.find((r) => r.round === round);
  if (!roundInfo) {
    throw new Error(`Round ${round} not found`);
  }

  const results = await fetchRaceResults(roundInfo.espnRaceId);
  const driverPoints: Record<string, number> = {};
  for (const r of results) {
    driverPoints[r.driverId] = r.points;
  }

  return {
    round,
    espnRaceId: roundInfo.espnRaceId,
    results,
    driverPoints,
  };
}

/**
 * Fetch race results for all rounds in parallel and return driver points by round.
 * Failed rounds (e.g. future races) return empty object.
 */
export async function fetchAllRoundsPoints(
  rounds: RoundSummary[]
): Promise<Record<string, Record<string, number>>> {
  const results = await Promise.all(
    rounds.map(async (r) => {
      try {
        const res = await fetchRaceResults(r.espnRaceId);
        const driverPoints: Record<string, number> = {};
        for (const x of res) driverPoints[x.driverId] = x.points;
        const count = Object.keys(driverPoints).length;
        console.log(`[ESPN] Round ${r.round} (${r.roundName}): OK – ${count} drivers`);
        return { round: r.round, driverPoints };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`[ESPN] Round ${r.round} (${r.roundName}): skip – ${msg}`);
        return { round: r.round, driverPoints: {} };
      }
    })
  );
  const roundsData: Record<string, Record<string, number>> = {};
  for (const { round, driverPoints } of results) {
    if (Object.keys(driverPoints).length > 0) roundsData[String(round)] = driverPoints;
  }
  return roundsData;
}

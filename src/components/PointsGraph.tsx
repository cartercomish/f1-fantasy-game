"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import type { FantasyTeam, RoundSummary } from "@/lib/types";

const TEAM_COLORS: Record<string, string> = {
  "team-1": "#FF1E00",
  "team-2": "#03DAC6",
  "team-3": "#F58020",
  stuart: "#03DAC6",
  brian: "#F58020",
};
const FALLBACK_COLORS = ["#FF1E00", "#03DAC6", "#F58020"];

function weeklyPointsSum(teams: FantasyTeam[], roundIndex: number): number {
  return teams.reduce((acc, t) => acc + (t.pointsByRound[roundIndex]?.points ?? 0), 0);
}

function PointsTooltip({
  active,
  label,
  payload,
  teams,
}: {
  active?: boolean;
  label?: string | number;
  payload?: readonly { payload?: Record<string, string | number> }[];
  teams: FantasyTeam[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload ?? {};
  return (
    <div className="rounded border border-white/10 bg-[#1E1E28] px-3 py-2 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-white">{label != null ? String(label) : ""}</p>
      <p className="mb-2 text-xs text-[#8F8F9D]">Points scored this race</p>
      <ul className="space-y-1">
        {teams.map((t) => {
          const week = Number(row[`__weekly__${t.id}`] ?? 0);
          return (
            <li key={t.id} className="flex justify-between gap-6">
              <span className="text-white">{t.ownerName}</span>
              <span className="font-semibold text-[#FF1E00]">{week} pts</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PointsGraph({
  teams,
  rounds,
  leagueId,
}: {
  teams: FantasyTeam[];
  rounds: RoundSummary[];
  leagueId?: string;
}) {
  const data = useMemo(() => {
    return rounds
      .map((r, i) => ({ r, i }))
      .filter(({ i }) => weeklyPointsSum(teams, i) > 0)
      .map(({ r, i }) => {
        const point: Record<string, string | number> = {
          round: r.roundName,
          name: r.roundName,
        };
        teams.forEach((t) => {
          const pr = t.pointsByRound[i];
          point[t.ownerName] = pr?.cumulative ?? 0;
          point[`__weekly__${t.id}`] = pr?.points ?? 0;
        });
        return point;
      });
  }, [teams, rounds]);

  return (
    <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">2026 Season Points Totals</h2>
      <p className="mb-4 text-sm text-[#8F8F9D]">
        Lines show cumulative season score. Hover a race for points scored that week.
      </p>
      <div className="w-full min-w-0" style={{ height: 320, minHeight: 320 }}>
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="round" stroke="#8F8F9D" fontSize={12} />
            <YAxis stroke="#8F8F9D" fontSize={12} width={32} tick={{ fontSize: 11 }} />
            <Tooltip
              content={(props) => (
                <PointsTooltip
                  active={props.active}
                  label={props.label}
                  payload={props.payload}
                  teams={teams}
                />
              )}
              cursor={{ stroke: "rgba(255,255,255,0.15)" }}
            />
            <Legend />
            {teams.map((t, i) => {
              const color = TEAM_COLORS[t.id] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
              return (
                <Line
                  key={t.id}
                  type="monotone"
                  dataKey={t.ownerName}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
    return rounds.map((r, i) => {
      const point: Record<string, string | number> = {
        round: r.roundName,
        name: r.roundName,
      };
      teams.forEach((t) => {
        point[t.ownerName] = t.pointsByRound[i]?.cumulative ?? 0;
      });
      return point;
    });
  }, [teams, rounds]);

  return (
    <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">2026 Season Points Totals</h2>
      <div className="w-full min-w-0" style={{ height: 320, minHeight: 320 }}>
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="round" stroke="#8F8F9D" fontSize={12} />
            <YAxis stroke="#8F8F9D" fontSize={12} width={32} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1E1E28", border: "1px solid rgba(255,255,255,0.1)" }}
              labelStyle={{ color: "#fff" }}
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

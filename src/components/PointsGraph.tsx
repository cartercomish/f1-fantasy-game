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

const TEAM_COLORS = ["#FF1E00", "#03DAC6", "#F58020"];

export function PointsGraph({ teams, rounds }: { teams: FantasyTeam[]; rounds: RoundSummary[] }) {
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
            {teams.map((t, i) => (
              <Line
                key={t.id}
                type="monotone"
                dataKey={t.ownerName}
                stroke={TEAM_COLORS[i % TEAM_COLORS.length]}
                strokeWidth={2}
                dot={{ fill: TEAM_COLORS[i % TEAM_COLORS.length], r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

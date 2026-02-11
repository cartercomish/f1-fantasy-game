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
import { getTeams, getRounds } from "@/lib/data";
import { useMemo } from "react";

const TEAM_COLORS = ["#FF1E00", "#03DAC6", "#F58020"];

export function PointsGraph() {
  const data = useMemo(() => {
    const rounds = getRounds();
    const teams = getTeams();
    return rounds.map((r, i) => {
      const point: Record<string, string | number> = {
        round: r.roundName,
        name: r.roundName,
      };
      teams.forEach((t, j) => {
        point[t.ownerName] = t.pointsByRound[i]?.cumulative ?? 0;
      });
      return point;
    });
  }, []);

  const teams = getTeams();

  return (
    <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Points Over Time</h2>
      <div className="w-full" style={{ height: 320, minHeight: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="round" stroke="#8F8F9D" fontSize={12} />
            <YAxis stroke="#8F8F9D" fontSize={12} />
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

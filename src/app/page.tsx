import { PointsGraph } from "@/components/PointsGraph";
import { DriverConstructorLists } from "@/components/DriverConstructorLists";
import { PodiumStandings } from "@/components/PodiumStandings";
import { getSeasonYear } from "@/lib/data";

export default function DashboardPage() {
  const seasonYear = getSeasonYear();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <span className="text-[#8F8F9D] text-sm">F1 {seasonYear} – Season starts March 7</span>
      </div>

      <PodiumStandings />

      <PointsGraph />

      <DriverConstructorLists />
    </div>
  );
}

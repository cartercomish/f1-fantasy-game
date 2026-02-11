import { PointsGraph } from "@/components/PointsGraph";
import { DriverConstructorLists } from "@/components/DriverConstructorLists";
import { PodiumStandings } from "@/components/PodiumStandings";
import { getTeamsAsync, getTopAndBottomDriversAsync, getTopAndBottomConstructorsAsync, getRounds } from "@/lib/data";

export default async function DashboardPage() {
  const [teams, { top: topDrivers, bottom: bottomDrivers }, { top: topConstructors, bottom: bottomConstructors }] =
    await Promise.all([
      getTeamsAsync(),
      getTopAndBottomDriversAsync(),
      getTopAndBottomConstructorsAsync(),
    ]);
  const rounds = getRounds();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      <PodiumStandings teams={teams} />

      <PointsGraph teams={teams} rounds={rounds} />

      <DriverConstructorLists
        topDrivers={topDrivers}
        bottomDrivers={bottomDrivers}
        topConstructors={topConstructors}
        bottomConstructors={bottomConstructors}
      />
    </div>
  );
}

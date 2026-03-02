import Link from "next/link";
import { redirect } from "next/navigation";
import { PointsGraph } from "@/components/PointsGraph";
import { DriverConstructorLists } from "@/components/DriverConstructorLists";
import { PodiumStandings } from "@/components/PodiumStandings";
import {
  getTeamsAsync,
  getTopAndBottomDriversAsync,
  getTopAndBottomConstructorsAsync,
  getRounds,
  LEAGUES,
  type LeagueId,
} from "@/lib/data";

export default async function LeagueDashboardPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  if (!LEAGUES.some((l) => l.id === leagueId)) {
    redirect("/");
  }

  const [teams, { top: topDrivers, bottom: bottomDrivers }, { top: topConstructors, bottom: bottomConstructors }] =
    await Promise.all([
      getTeamsAsync(leagueId as LeagueId),
      getTopAndBottomDriversAsync(leagueId as LeagueId),
      getTopAndBottomConstructorsAsync(leagueId as LeagueId),
    ]);
  const rounds = getRounds();
  const leagueName = LEAGUES.find((l) => l.id === leagueId)?.name ?? leagueId;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-[#8F8F9D] hover:text-white transition-colors text-sm">
          ← All leagues
        </Link>
        <h1 className="text-3xl font-bold text-white">{leagueName}</h1>
      </div>

      <PodiumStandings teams={teams} leagueId={leagueId as LeagueId} />

      <PointsGraph teams={teams} rounds={rounds} leagueId={leagueId as LeagueId} />

      <DriverConstructorLists
        topDrivers={topDrivers}
        bottomDrivers={bottomDrivers}
        topConstructors={topConstructors}
        bottomConstructors={bottomConstructors}
      />
    </div>
  );
}

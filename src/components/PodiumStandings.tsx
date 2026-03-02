import Link from "next/link";
import Image from "next/image";
import type { FantasyTeam } from "@/lib/types";
import type { LeagueId } from "@/lib/data";

const TEAM_COLORS: Record<string, string> = {
  "team-1": "#FF1E00",
  "team-2": "#03DAC6",
  "team-3": "#F58020",
  stuart: "#03DAC6",
  brian: "#F58020",
};

export function PodiumStandings({ teams, leagueId }: { teams: FantasyTeam[]; leagueId?: LeagueId }) {
  const teamHref = (teamId: string) =>
    leagueId ? `/league/${leagueId}/team/${teamId}` : `/team/${teamId}`;
  const sorted = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  const [first, second, third] = sorted;
  const isTwoTeam = teams.length === 2 && leagueId === "sb";

  // 2-team layout (SB league): 1st and 2nd spaced evenly, no podium tiers
  if (isTwoTeam) {
    return (
      <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-8">
        <h2 className="text-lg font-semibold mb-6 text-white">Standings</h2>
        <div className="flex items-center justify-center gap-12 min-h-[200px]">
          {/* 1st place */}
          <div
            className="flex flex-col items-center flex-1 max-w-[200px] rounded-lg border-l-4"
            style={{ borderLeftColor: first ? TEAM_COLORS[first.id] ?? "#8F8F9D" : "#8F8F9D" }}
          >
            <Link
              href={teamHref(first?.id ?? "")}
              className="h-28 w-28 bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2 overflow-hidden shrink-0 relative block hover:border-white/25 hover:opacity-90 transition-all"
            >
              <span className="text-5xl font-bold text-[#8F8F9D]">
                {first?.id?.charAt(0).toUpperCase() ?? "S"}
              </span>
              <span className="absolute top-1 left-1 w-8 h-8 rounded flex items-center justify-center text-base font-bold shiny-badge-gold text-gray-900">1</span>
            </Link>
            <Link
              href={teamHref(first?.id ?? "")}
              className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
            >
              {first?.ownerName ?? "—"}
            </Link>
            <span className="text-[#FF1E00] font-bold mt-1">{first?.totalPoints ?? 0} PTS</span>
          </div>
          {/* 2nd place */}
          <div
            className="flex flex-col items-center flex-1 max-w-[200px] rounded-lg border-l-4"
            style={{ borderLeftColor: second ? TEAM_COLORS[second.id] ?? "#8F8F9D" : "#8F8F9D" }}
          >
            <Link
              href={teamHref(second?.id ?? "")}
              className="h-28 w-28 bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2 overflow-hidden shrink-0 relative block hover:border-white/25 hover:opacity-90 transition-all"
            >
              <span className="text-5xl font-bold text-[#8F8F9D]">
                {second?.id?.charAt(0).toUpperCase() ?? "B"}
              </span>
              <span className="absolute top-1 left-1 w-7 h-7 rounded flex items-center justify-center text-sm font-bold shiny-badge-silver text-gray-900">2</span>
            </Link>
            <Link
              href={teamHref(second?.id ?? "")}
              className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
            >
              {second?.ownerName ?? "—"}
            </Link>
            <span className="text-[#FF1E00] font-bold mt-1">{second?.totalPoints ?? 0} PTS</span>
          </div>
        </div>
        <p className="text-center text-[#8F8F9D] text-sm mt-4">Click team badge or name to view lineup</p>
      </div>
    );
  }

  // 3-team podium layout (CTS league)
  return (
    <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-8">
      <h2 className="text-lg font-semibold mb-6 text-white">Standings</h2>
      <div className="flex items-end justify-center gap-4 min-h-[200px]">
        {/* 2nd place - left, middle height */}
        <div
          className="flex flex-col items-center flex-1 max-w-[180px] rounded-lg border-l-4"
          style={{ borderLeftColor: second ? TEAM_COLORS[second.id] ?? "#8F8F9D" : "#8F8F9D" }}
        >
          <Link
            href={teamHref(second?.id ?? "")}
            className="h-24 w-24 bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2 overflow-hidden shrink-0 relative block hover:border-white/25 hover:opacity-90 transition-all"
          >
            {second?.logoUrl ? (
              <>
                <div className="w-full h-full relative">
                  <Image src={second.logoUrl} alt={second.ownerName} fill className="object-cover object-center" sizes="96px" />
                </div>
                <span className="absolute top-1 left-1 w-7 h-7 rounded flex items-center justify-center text-sm font-bold shiny-badge-silver text-gray-900">2</span>
              </>
            ) : (
              <span className="text-4xl font-bold shiny-badge-silver px-2 py-1 rounded text-gray-900">2</span>
            )}
          </Link>
          <Link
            href={teamHref(second?.id ?? "")}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {second?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{second?.totalPoints ?? 0} PTS</span>
        </div>

        {/* 1st place - center, tallest */}
        <div
          className="flex flex-col items-center flex-1 max-w-[180px] rounded-lg border-l-4"
          style={{ borderLeftColor: first ? TEAM_COLORS[first.id] ?? "#FF1E00" : "#FF1E00" }}
        >
          <Link
            href={teamHref(first?.id ?? "")}
            className="h-32 w-32 bg-gradient-to-b from-[#FF1E00]/30 to-[#1E1E28] border border-[#FF1E00]/50 rounded-t-lg flex items-center justify-center mb-2 overflow-hidden shrink-0 relative block hover:border-[#FF1E00]/80 hover:opacity-90 transition-all"
          >
            {first?.logoUrl ? (
              <>
                <div className="w-full h-full relative">
                  <Image src={first.logoUrl} alt={first.ownerName} fill className="object-cover object-center" sizes="128px" />
                </div>
                <span className="absolute top-1 left-1 w-8 h-8 rounded flex items-center justify-center text-base font-bold shiny-badge-gold text-gray-900">1</span>
              </>
            ) : (
              <span className="text-5xl font-bold shiny-badge-gold px-3 py-1 rounded text-gray-900">1</span>
            )}
          </Link>
          <Link
            href={teamHref(first?.id ?? "")}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {first?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{first?.totalPoints ?? 0} PTS</span>
        </div>

        {/* 3rd place - right, shortest */}
        <div
          className="flex flex-col items-center flex-1 max-w-[180px] rounded-lg border-l-4"
          style={{ borderLeftColor: third ? TEAM_COLORS[third.id] ?? "#8F8F9D" : "#8F8F9D" }}
        >
          <Link
            href={teamHref(third?.id ?? "")}
            className="h-16 w-16 bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2 overflow-hidden shrink-0 relative block hover:border-white/25 hover:opacity-90 transition-all"
          >
            {third?.logoUrl ? (
              <>
                <div className="w-full h-full relative">
                  <Image src={third.logoUrl} alt={third.ownerName} fill className="object-cover object-center" sizes="64px" />
                </div>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shiny-badge-bronze text-white">3</span>
              </>
            ) : (
              <span className="text-3xl font-bold shiny-badge-bronze px-2 py-1 rounded text-white">3</span>
            )}
          </Link>
          <Link
            href={teamHref(third?.id ?? "")}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {third?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{third?.totalPoints ?? 0} PTS</span>
        </div>
      </div>
      <p className="text-center text-[#8F8F9D] text-sm mt-4">Click team badge or name to view lineup</p>
    </div>
  );
}

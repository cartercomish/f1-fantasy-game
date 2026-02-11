import Link from "next/link";
import { getTeams } from "@/lib/data";

export function PodiumStandings() {
  const teams = getTeams().sort((a, b) => b.totalPoints - a.totalPoints);
  const [first, second, third] = teams;

  return (
    <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-8">
      <h2 className="text-lg font-semibold mb-6 text-white">Standings</h2>
      <div className="flex items-end justify-center gap-4 min-h-[200px]">
        {/* 2nd place - left, middle height */}
        <div className="flex flex-col items-center flex-1 max-w-[180px]">
          <div className="h-24 w-full bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2">
            <span className="text-4xl font-bold text-[#8F8F9D]">2</span>
          </div>
          <Link
            href={`/team/${second?.id}`}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {second?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{second?.totalPoints ?? 0} PTS</span>
        </div>

        {/* 1st place - center, tallest */}
        <div className="flex flex-col items-center flex-1 max-w-[180px]">
          <div className="h-32 w-full bg-gradient-to-b from-[#FF1E00]/30 to-[#1E1E28] border border-[#FF1E00]/50 rounded-t-lg flex items-center justify-center mb-2">
            <span className="text-5xl font-bold text-[#FF1E00]">1</span>
          </div>
          <Link
            href={`/team/${first?.id}`}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {first?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{first?.totalPoints ?? 0} PTS</span>
        </div>

        {/* 3rd place - right, shortest */}
        <div className="flex flex-col items-center flex-1 max-w-[180px]">
          <div className="h-16 w-full bg-[#1E1E28] border border-white/10 rounded-t-lg flex items-center justify-center mb-2">
            <span className="text-3xl font-bold text-[#8F8F9D]">3</span>
          </div>
          <Link
            href={`/team/${third?.id}`}
            className="w-full py-3 px-4 bg-[#2A2A35] rounded-b-lg hover:bg-[#353540] transition-colors text-center font-semibold"
          >
            {third?.ownerName ?? "—"}
          </Link>
          <span className="text-[#FF1E00] font-bold mt-1">{third?.totalPoints ?? 0} PTS</span>
        </div>
      </div>
      <p className="text-center text-[#8F8F9D] text-sm mt-4">Click team name to view lineup</p>
    </div>
  );
}

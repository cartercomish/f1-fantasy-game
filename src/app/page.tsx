import Link from "next/link";
import { LEAGUES } from "@/lib/data";

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">F1 Fantasy 2026</h1>
      <p className="text-[#8F8F9D]">Choose your league</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {LEAGUES.map((league) => (
          <Link
            key={league.id}
            href={`/league/${league.id}`}
            className="block p-6 bg-[#1E1E28] rounded-lg border border-white/10 hover:border-[#FF1E00]/50 hover:bg-[#2A2A35] transition-colors"
          >
            <h2 className="text-xl font-semibold text-white">{league.name}</h2>
            <p className="text-[#8F8F9D] text-sm mt-1">View standings and lineup</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

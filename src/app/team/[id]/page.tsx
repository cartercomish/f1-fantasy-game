import Link from "next/link";
import { getTeamByIdAsync } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeamByIdAsync(id);
  if (!team) notFound();

  return (
    <div className="space-y-8">
      <Link href="/" className="text-[#8F8F9D] hover:text-white transition-colors text-sm">
        ← Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">{team.ownerName}</h1>
        <p className="text-[#8F8F9D] mt-1">Total: <span className="text-[#FF1E00] font-bold">{team.totalPoints} PTS</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Drivers</h2>
          <div className="space-y-3">
            {team.drivers.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.teamColour ?? "#8F8F9D" }}
                  />
                  <span className="font-medium">{d.name}</span>
                  <span className="text-[#8F8F9D] text-sm">({d.shortName})</span>
                </div>
                <span className="font-bold text-[#FF1E00]">{d.points} PTS</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Constructors</h2>
          <div className="space-y-3">
            {team.constructors.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="font-medium">{c.name}</span>
                <span className="font-bold text-[#FF1E00]">{c.points} PTS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

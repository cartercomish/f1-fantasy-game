import { getTopAndBottomDrivers, getTopAndBottomConstructors } from "@/lib/data";

function DriverRow({ name, shortName, points, teamColour, rank }: { name: string; shortName: string; points: number; teamColour?: string; rank: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-[#FF1E00]/20 text-[#FF1E00]">
          {rank}
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: teamColour ?? "#8F8F9D" }}
        />
        <span className="font-medium">{name}</span>
        <span className="text-[#8F8F9D] text-sm">({shortName})</span>
      </div>
      <span className="font-bold text-[#FF1E00]">{points} PTS</span>
    </div>
  );
}

function ConstructorRow({ name, points, rank }: { name: string; points: number; rank: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-[#FF1E00]/20 text-[#FF1E00]">
          {rank}
        </span>
        <span className="font-medium">{name}</span>
      </div>
      <span className="font-bold text-[#FF1E00]">{points} PTS</span>
    </div>
  );
}

export function DriverConstructorLists() {
  const { top: topDrivers, bottom: bottomDrivers } = getTopAndBottomDrivers();
  const { top: topConstructors, bottom: bottomConstructors } = getTopAndBottomConstructors();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-[#8F8F9D] uppercase tracking-wider mb-3">Top 3 Drivers</h3>
        {topDrivers.map((d, i) => (
          <DriverRow key={d.id} name={d.name} shortName={d.shortName} points={d.points} teamColour={d.teamColour} rank={i + 1} />
        ))}
      </div>
      <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-[#8F8F9D] uppercase tracking-wider mb-3">Bottom 3 Drivers</h3>
        {bottomDrivers.map((d, i) => (
          <DriverRow key={d.id} name={d.name} shortName={d.shortName} points={d.points} teamColour={d.teamColour} rank={i + 1} />
        ))}
      </div>
      <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-[#8F8F9D] uppercase tracking-wider mb-3">Top 3 Constructors</h3>
        {topConstructors.map((c, i) => (
          <ConstructorRow key={c.id} name={c.name} points={c.points} rank={i + 1} />
        ))}
      </div>
      <div className="bg-[#1E1E28] rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-[#8F8F9D] uppercase tracking-wider mb-3">Bottom 3 Constructors</h3>
        {bottomConstructors.map((c, i) => (
          <ConstructorRow key={c.id} name={c.name} points={c.points} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

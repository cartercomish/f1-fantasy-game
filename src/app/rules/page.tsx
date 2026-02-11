import { POSITION_POINTS } from "@/lib/scoring";

export default function RulesPage() {

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Rules</h1>

      <section className="bg-[#1E1E28] rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Scoring Summary</h2>
        <p className="text-[#8F8F9D] mb-6">
          Points are awarded based on finishing position in each race. Each fantasy team has 7 drivers and 3 constructors.
          Your team score is the sum of all your drivers&apos; points plus all your constructors&apos; points.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-[#8F8F9D] font-medium">Position</th>
                <th className="py-3 px-4 text-[#8F8F9D] font-medium">Points</th>
                <th className="py-3 px-4 text-[#8F8F9D] font-medium">Position</th>
                <th className="py-3 px-4 text-[#8F8F9D] font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, row) => (
                <tr key={row} className="border-b border-white/5">
                  <td className="py-2 px-4 font-medium">{row + 1}</td>
                  <td className="py-2 px-4 text-[#FF1E00] font-bold">{POSITION_POINTS[row + 1]}</td>
                  <td className="py-2 px-4 font-medium">{row + 12}</td>
                  <td className="py-2 px-4 text-[#FF1E00] font-bold">{POSITION_POINTS[row + 12]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[#8F8F9D] text-sm mt-4">
          DNF, DNS, or DSQ = 0 points. Race and sprint (if applicable) points are both counted.
        </p>
      </section>

      <section className="bg-[#1E1E28] rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Team Structure</h2>
        <ul className="text-[#8F8F9D] space-y-2 list-disc list-inside">
          <li>7 drivers per team</li>
          <li>3 constructors per team</li>
          <li>Constructor points = sum of both drivers&apos; points for that team in each race</li>
        </ul>
      </section>
    </div>
  );
}

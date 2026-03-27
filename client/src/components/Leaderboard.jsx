import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filtered = leaderboard.filter(m => {
    if (filter === "high") return m.highPriorityInsights >= 3;
    if (filter === "improving") return m.reductionProgress >= 5;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] text-white p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
          Mine Leaderboard
        </h1>
        <p className="text-emerald-100 mt-2">
          Ranked by emission reduction progress
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-5xl mx-auto flex gap-3 mb-8">
        {[
          { key: "all", label: "All" },
          { key: "improving", label: "≥5%" },
          { key: "high", label: "High Priority" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl border transition ${
              filter === tab.key
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-white/10 border-white/20 text-emerald-200 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-20">
          <div className="animate-spin w-10 h-10 border-4 border-white/20 border-t-emerald-400 rounded-full mx-auto"></div>
          <p className="mt-4 text-emerald-200">Loading leaderboard...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-xl text-emerald-200">No data yet</p>
        </div>
      )}

      {/* LIST */}
      <div className="max-w-5xl mx-auto space-y-4">
        {filtered.map((mine, index) => (
          <div
            key={mine.id}
            className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition"
          >
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-emerald-300">
                  #{index + 1}
                </span>
                <h2 className="text-lg font-bold">{mine.name}</h2>
              </div>

              <div className="text-sm text-emerald-200 mt-1 flex gap-4">
                <span>📍 {mine.location}</span>
                <span>🏢 {mine.subsidiary}</span>
              </div>

              {/* Progress */}
              <div className="w-full bg-white/20 h-2 rounded-full mt-3">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: `${mine.reductionProgress}%` }}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-2xl font-extrabold text-emerald-300">
                {mine.reductionProgress?.toFixed(1)}%
              </p>
              <p className="text-sm text-emerald-200">
                {mine.totalEmissions ?? "—"} t CO₂
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
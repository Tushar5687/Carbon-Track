// components/Leaderboard.jsx
import React from 'react';
import { useUserProfile } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const Leaderboard = () => {
  const { mines } = useUserProfile();
  const navigate = useNavigate();

  // Calculate mine score based on performance
  const calculateMineScore = (mine) => {
    if (!mine.dashboard) return 0;
    
    const reductionScore = mine.dashboard.reductionProgress * 2; // 40%
    const analysisScore = mine.hasAnalysis ? 20 : 0; // 20%
    const actionScore = Math.min(mine.dashboard.quickWins?.length * 3, 15); // 15%
    const creditScore = Math.min((mine.dashboard.totalEmissions * mine.dashboard.reductionProgress / 100) * 0.01, 25); // 25%
    
    return Math.round(reductionScore + analysisScore + actionScore + creditScore);
  };

  // Calculate potential carbon credit revenue
  const calculateRevenue = (mine) => {
    if (!mine.dashboard) return 0;
    const credits = mine.dashboard.totalEmissions * (mine.dashboard.reductionProgress / 100);
    return Math.round(credits * 18.5); // $18.5 per credit
  };

  // Get performance badge based on score
  const getPerformanceBadge = (score) => {
    if (score >= 90) return { label: '🌟 Excellent', color: 'text-yellow-300' };
    if (score >= 80) return { label: '✅ Great', color: 'text-green-300' };
    if (score >= 70) return { label: '⚠️ Good', color: 'text-blue-300' };
    return { label: '📈 Needs Improvement', color: 'text-orange-300' };
  };

  // Sort mines by score
  const scoredMines = mines.map(mine => ({
    ...mine,
    score: calculateMineScore(mine),
    revenue: calculateRevenue(mine)
  })).sort((a, b) => b.score - a.score)
     .map((mine, index) => ({ ...mine, rank: index + 1 }));

  // Calculate subsidiary averages
  const subsidiaryStats = mines.reduce((acc, mine) => {
    if (!acc[mine.subsidiary]) {
      acc[mine.subsidiary] = { totalScore: 0, mineCount: 0, totalRevenue: 0 };
    }
    acc[mine.subsidiary].totalScore += calculateMineScore(mine);
    acc[mine.subsidiary].mineCount += 1;
    acc[mine.subsidiary].totalRevenue += calculateRevenue(mine);
    return acc;
  }, {});

  const subsidiaryRankings = Object.entries(subsidiaryStats)
    .map(([name, stats]) => ({
      name,
      averageScore: Math.round(stats.totalScore / stats.mineCount),
      mineCount: stats.mineCount,
      totalRevenue: stats.totalRevenue
    }))
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#013220]/90 backdrop-blur-sm border-b border-emerald-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/profile')}
                className="text-emerald-200 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
              >
                ← Back to Mines
              </button>
              <div className="text-white h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                🏆
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Carbon Track
              </h2>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/')}
                className="text-emerald-200 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="text-emerald-200 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Mines
              </button>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="text-white bg-emerald-600 font-medium px-4 py-2 rounded-lg transition-all duration-300"
              >
                Leaderboard
              </button>
            </nav>
            
            <div className="flex items-center gap-3">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
            Mine Performance Leaderboard
          </h1>
          <p className="text-emerald-200 text-xl max-w-2xl mx-auto">
            Track and compare performance across all your mines. Compete for the top spot!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-emerald-200">Total Mines</p>
            <p className="text-3xl font-bold text-white mt-2">{mines.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-blue-200">Average Score</p>
            <p className="text-3xl font-bold text-white mt-2">
              {scoredMines.length > 0 ? Math.round(scoredMines.reduce((sum, mine) => sum + mine.score, 0) / scoredMines.length) : 0}/100
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-purple-200">Total Revenue Potential</p>
            <p className="text-3xl font-bold text-white mt-2">
              ${scoredMines.reduce((sum, mine) => sum + mine.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-6 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-yellow-200">Top Performer</p>
            <p className="text-xl font-bold text-white mt-2 truncate">
              {scoredMines[0]?.name || 'No mines'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-emerald-500/30 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-emerald-500/30">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  🏆 Mine Rankings
                  <span className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-full">LIVE</span>
                </h2>
              </div>
              
              <div className="p-6">
                {scoredMines.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏭</div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Mines Added Yet</h3>
                    <p className="text-emerald-200 mb-6">Add mines to start tracking performance</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                    >
                      Add Your First Mine
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scoredMines.map((mine) => (
                      <div
                        key={mine.id}
                        onClick={() => navigate('/dashboard', { state: { mineId: mine.id } })}
                        className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                          mine.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 hover:border-yellow-400/50' :
                          mine.rank === 2 ? 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 hover:border-gray-400/50' :
                          mine.rank === 3 ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400/50' :
                          'bg-white/10 border-white/20 hover:border-emerald-400/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank Badge */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                            mine.rank === 1 ? 'bg-yellow-500' :
                            mine.rank === 2 ? 'bg-gray-400' :
                            mine.rank === 3 ? 'bg-amber-600' : 'bg-emerald-600'
                          }`}>
                            {mine.rank}
                          </div>
                          
                          {/* Mine Info */}
                          <div>
                            <h4 className="text-white font-bold text-lg">{mine.name}</h4>
                            <p className="text-emerald-200 text-sm">
                              {mine.location} • {mine.subsidiary}
                            </p>
                            <p className={`text-sm font-medium ${getPerformanceBadge(mine.score).color}`}>
                              {getPerformanceBadge(mine.score).label}
                            </p>
                          </div>
                        </div>
                        
                        {/* Score & Metrics */}
                        <div className="text-right">
                          <p className="text-white font-bold text-2xl">{mine.score} pts</p>
                          <div className="flex gap-4 text-sm text-emerald-200 mt-1">
                            <span>📈 {mine.dashboard?.reductionProgress || 0}%</span>
                            <span>💰 ${mine.revenue.toLocaleString()}</span>
                            <span>⚡ {mine.dashboard?.quickWins?.length || 0} wins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Subsidiary Rankings */}
          <div className="space-y-6">
            {/* Subsidiary Rankings */}
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🏢 Subsidiary Rankings
              </h3>
              <div className="space-y-3">
                {subsidiaryRankings.map((subsidiary, index) => (
                  <div key={subsidiary.name} className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{subsidiary.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{subsidiary.averageScore} pts</p>
                      <p className="text-purple-200 text-xs">{subsidiary.mineCount} mines</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Tips */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💡 Improve Your Score
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✅</span>
                  <p className="text-blue-100">Analyze documents to unlock detailed insights</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✅</span>
                  <p className="text-blue-100">Implement quick wins for immediate points</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✅</span>
                  <p className="text-blue-100">Focus on high-impact emission sources first</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✅</span>
                  <p className="text-blue-100">Complete all recommended actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
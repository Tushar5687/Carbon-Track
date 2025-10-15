// components/DashboardPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../context/UserContext';
import { UserButton, SignOutButton } from '@clerk/clerk-react';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mines } = useUserProfile();
  
  const mineId = location.state?.mineId;
  const mine = mines.find(m => m.id === mineId);

  if (!mine || !mine.dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-12 max-w-md border border-emerald-500/30 backdrop-blur-sm shadow-2xl">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Dashboard Not Available
            </h2>
            <p className="text-emerald-200 mb-8 text-lg">
              No dashboard data found for this mine.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              Back to Mines
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { dashboard } = mine;

  // Calculate chart coordinates for quarterly trend
  const calculateTrendCoordinates = () => {
    const maxEmission = Math.max(...dashboard.quarterlyTrend.map(q => q.emissions));
    const minEmission = Math.min(...dashboard.quarterlyTrend.map(q => q.emissions));
    const range = maxEmission - minEmission;
    
    return dashboard.quarterlyTrend.map((point, index) => {
      const x = 40 + (index * 80);
      const normalizedY = ((point.emissions - minEmission) / range) * 80 + 20;
      const y = 120 - normalizedY;
      return { x, y, ...point };
    });
  };

  const trendPoints = calculateTrendCoordinates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] text-white">
      {/* Updated Header */}
      <header className="sticky top-0 z-50 bg-[#013220]/90 backdrop-blur-sm border-b border-emerald-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/profile')}
                className="text-emerald-200 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
              >
                ← My Mines
              </button>
              <div className="text-white h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
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
            </nav>
            
            <div className="flex items-center gap-3">
              <UserButton />
            
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 inline-block backdrop-blur-sm">
            <p className="text-blue-300 font-semibold flex items-center justify-center gap-2 text-lg">
              <span className="text-2xl">🏭</span>
              Dashboard for: <span className="text-white font-bold">{mine.name}</span>
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
            Carbon Emission Dashboard
          </h1>
          <p className="text-emerald-200 text-xl max-w-2xl mx-auto">
            Comprehensive analysis and insights for <span className="text-white font-semibold">{mine.name}</span> emissions
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <p className="text-sm font-medium text-emerald-200">Total Emissions</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {dashboard.totalEmissions.toLocaleString()} tons
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <p className="text-sm font-medium text-emerald-200">Largest Source</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2 truncate">
              {dashboard.largestSource}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <p className="text-sm font-medium text-emerald-200">Reduction Progress</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-400 mt-2">
              {dashboard.reductionProgress}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <p className="text-sm font-medium text-emerald-200">Mobile Equipment Share</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {dashboard.mobileEquipmentShare}%
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emission Sources Breakdown */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Emission Sources Breakdown</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pie Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle className="stroke-current text-gray-700/50" cx="18" cy="18" fill="none" r="15.91549430918954" strokeWidth="3.8"></circle>
                  <circle className="stroke-current text-red-500" cx="18" cy="18" fill="none" r="15.91549430918954" strokeDasharray="50, 100" strokeDashoffset="0" strokeWidth="3.8"></circle>
                  <circle className="stroke-current text-orange-500" cx="18" cy="18" fill="none" r="15.91549430918954" strokeDasharray="12, 100" strokeDashoffset="-50" strokeWidth="3.8"></circle>
                  <circle className="stroke-current text-green-500" cx="18" cy="18" fill="none" r="15.91549430918954" strokeDasharray="38, 100" strokeDashoffset="-62" strokeWidth="3.8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-500">50%</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-bold text-orange-500">12%</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-bold text-green-500">38%</span>
                  </div>
                  <div className="text-3xl font-bold text-white mt-1">
                    {(dashboard.totalEmissions / 1000).toFixed(1)}k
                  </div>
                  <div className="text-sm text-emerald-200">tons CO2e</div>
                </div>
              </div>

              {/* Sources List */}
              <div className="w-full">
                <ul className="space-y-3 text-sm max-h-64 overflow-y-auto">
                  {dashboard.sources.map((source, index) => (
                    <li key={index} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="flex items-center gap-3">
                        <span 
                          className={`w-4 h-4 rounded-full ${
                            source.priority === 'high' ? 'bg-red-500' : 
                            source.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                        ></span>
                        <span className="truncate max-w-[120px] text-white font-medium">{source.name}</span>
                      </span>
                      <span className="font-semibold text-emerald-300 whitespace-nowrap">
                        {source.percentage}% 
                        <span className="text-emerald-200 font-normal ml-1">
                          ({source.tons.toLocaleString()} t)
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Scope Classification and Quarterly Trend */}
          <div className="space-y-8">
            {/* Scope Classification */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">Scope Classification</h3>
              <div className="space-y-6">
                {dashboard.scopeBreakdown.map((scope, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-base font-semibold text-emerald-200">{scope.name}</p>
                      <p className="text-base font-bold text-white">
                        {scope.percentage}% 
                        <span className="text-emerald-200 font-normal ml-2">
                          ({scope.tons.toLocaleString()} t)
                        </span>
                      </p>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          scope.color === 'primary' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                          scope.color === 'orange' ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 
                          'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        }`}
                        style={{ width: `${scope.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly Trend */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">Quarterly Trend</h3>
              <div className="h-48">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 120">
                  {/* Grid line */}
                  <path 
                    d="M 20 20 L 300 40" 
                    stroke="#4b5563" 
                    strokeDasharray="4 4" 
                    strokeWidth="1"
                  ></path>
                  
                  {/* Trend line */}
                  <path 
                    d={`M ${trendPoints[0].x} ${trendPoints[0].y} 
                       C ${trendPoints[1].x - 20} ${trendPoints[1].y}, 
                          ${trendPoints[1].x + 20} ${trendPoints[2].y}, 
                          ${trendPoints[2].x} ${trendPoints[2].y} 
                       L ${trendPoints[3].x} ${trendPoints[3].y}`}
                    fill="none" 
                    stroke="url(#trendGradient)" 
                    strokeWidth="3"
                  ></path>
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  
                  {/* Data points */}
                  {trendPoints.map((point, index) => (
                    <g key={index} className="group cursor-pointer">
                      <circle 
                        cx={point.x} 
                        cy={point.y} 
                        fill="#10b981" 
                        r="4"
                        className="group-hover:r-6 transition-all duration-300 group-hover:fill-emerald-300"
                      ></circle>
                      <text 
                        className="text-xs fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        x={point.x} 
                        y={point.y - 12}
                        textAnchor="middle"
                      >
                        {point.quarter}: {point.emissions.toLocaleString()}t
                      </text>
                    </g>
                  ))}
                  
                  {/* Reduction label */}
                  <text 
                    className="text-sm fill-red-400 font-semibold" 
                    dominantBaseline="middle" 
                    textAnchor="end" 
                    x="300" 
                    y="30"
                  >
                    {dashboard.reductionProgress}% Reduction
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Insights and Quick Wins */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actionable Insights */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Actionable Insights</h3>
            <ul className="space-y-4">
              {/* High Priority */}
              <li className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 hover:scale-105 transition-all duration-300">
                <div>
                  <p className="font-bold text-red-400 text-lg">HIGH PRIORITY</p>
                  <p className="text-sm text-emerald-200 mt-1">
                    {dashboard.sources
                      .filter(s => s.priority === 'high')
                      .map(s => `${s.name} (${s.percentage}%)`)
                      .join(' & ')}
                  </p>
                </div>
                <button className="text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                  View Details
                </button>
              </li>
              
              {/* Medium Priority */}
              <li className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 hover:scale-105 transition-all duration-300">
                <div>
                  <p className="font-bold text-orange-400 text-lg">MEDIUM PRIORITY</p>
                  <p className="text-sm text-emerald-200 mt-1">
                    {dashboard.sources
                      .filter(s => s.priority === 'medium')
                      .map(s => `${s.name} (${s.percentage}%)`)
                      .join(' & ')}
                  </p>
                </div>
                <button className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                  View Details
                </button>
              </li>
              
              {/* Low Priority */}
              <li className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:scale-105 transition-all duration-300">
                <div>
                  <p className="font-bold text-green-400 text-lg">LOW PRIORITY</p>
                  <p className="text-sm text-emerald-200 mt-1">
                    Other sources (
                    {dashboard.sources
                      .filter(s => s.priority === 'low')
                      .reduce((sum, s) => sum + s.percentage, 0)}%)
                  </p>
                </div>
                <button className="text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                  View Details
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Wins */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Wins</h3>
            <div className="space-y-4">
              {dashboard.quickWins.map((win, index) => (
                <div key={index} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30 hover:scale-105 transition-all duration-300">
                  <p className="font-bold text-green-400 text-lg">{win.title}</p>
                  <p className="text-sm text-emerald-200 mt-2">
                    Potential Reduction: <span className="font-bold text-white">{win.reduction.toLocaleString()} tons</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-emerald-200">
            Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
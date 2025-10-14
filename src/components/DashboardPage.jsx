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
      <div className="min-h-screen bg-[#013220] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="bg-white/10 rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Dashboard Not Available</h2>
            <p className="text-gray-300 mb-6">
              No dashboard data found for this mine.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
    <div className="min-h-screen bg-[#013220] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#013220]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-gray-300/20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/profile')}
                className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                ← My Mines
              </button>
              <div className="text-white h-8 w-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865/L43.1065 32.8675/L43.1101 32.8739/L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889/L4.94662 32.777/L4.95178 32.7688ZM35.9868 29.004/L24 9.77997/L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Carbon Neutrality</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/profile')}
                className="px-4 py-2 text-sm font-bold bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                My Mines
              </button>
              <UserButton />
              <SignOutButton>
                <button className="px-4 py-2 text-sm font-bold bg-white text-[#013220] rounded-lg hover:bg-gray-100 transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 inline-block">
            <p className="text-blue-300 font-semibold flex items-center justify-center gap-2">
              <span className="text-xl">🏭</span>
              Dashboard for: <span className="text-white">{mine.name}</span>
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Carbon Emission Dashboard</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive analysis and insights for {mine.name} emissions
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <p className="text-sm font-medium text-gray-300">Total Emissions</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {dashboard.totalEmissions.toLocaleString()} tons
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <p className="text-sm font-medium text-gray-300">Largest Source</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1 truncate">
              {dashboard.largestSource}
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <p className="text-sm font-medium text-gray-300">Reduction Progress</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-500 mt-1">
              {dashboard.reductionProgress}%
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <p className="text-sm font-medium text-gray-300">Mobile Equipment Share</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {dashboard.mobileEquipmentShare}%
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Emission Sources Breakdown */}
          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Emission Sources Breakdown</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
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
                  <div className="text-sm text-gray-400">tons CO2e</div>
                </div>
              </div>

              {/* Sources List */}
              <div className="w-full">
                <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
                  {dashboard.sources.map((source, index) => (
                    <li key={index} className="flex justify-between items-center py-1">
                      <span className="flex items-center gap-2">
                        <span 
                          className={`w-3 h-3 rounded-full ${
                            source.priority === 'high' ? 'bg-red-500' : 
                            source.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                        ></span>
                        <span className="truncate max-w-[120px]">{source.name}</span>
                      </span>
                      <span className="font-medium text-gray-300 whitespace-nowrap">
                        {source.percentage}% 
                        <span className="text-gray-400 font-normal ml-1">
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
          <div className="space-y-6">
            {/* Scope Classification */}
            <div className="bg-white/10 p-6 rounded-lg border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Scope Classification</h3>
              <div className="space-y-4">
                {dashboard.scopeBreakdown.map((scope, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-300">{scope.name}</p>
                      <p className="text-sm font-semibold text-white">
                        {scope.percentage}% 
                        <span className="text-gray-400 font-normal ml-1">
                          ({scope.tons.toLocaleString()} t)
                        </span>
                      </p>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          scope.color === 'primary' ? 'bg-green-500' :
                          scope.color === 'orange' ? 'bg-orange-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${scope.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly Trend */}
            <div className="bg-white/10 p-6 rounded-lg border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quarterly Trend</h3>
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
                    stroke="#1dc962" 
                    strokeWidth="2"
                  ></path>
                  
                  {/* Data points */}
                  {trendPoints.map((point, index) => (
                    <g key={index} className="group cursor-pointer">
                      <circle 
                        cx={point.x} 
                        cy={point.y} 
                        fill="#1dc962" 
                        r="4"
                        className="group-hover:r-6 transition-all"
                      ></circle>
                      <text 
                        className="text-xs fill-white opacity-0 group-hover:opacity-100 transition-opacity" 
                        x={point.x} 
                        y={point.y - 8}
                        textAnchor="middle"
                      >
                        {point.quarter}: {point.emissions.toLocaleString()}t
                      </text>
                    </g>
                  ))}
                  
                  {/* Reduction label */}
                  <text 
                    className="text-xs fill-red-400" 
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actionable Insights */}
          <div className="lg:col-span-2 bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Actionable Insights</h3>
            <ul className="space-y-3">
              {/* High Priority */}
              <li className="flex items-center justify-between p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <div>
                  <p className="font-semibold text-red-400">HIGH PRIORITY</p>
                  <p className="text-sm text-gray-300">
                    {dashboard.sources
                      .filter(s => s.priority === 'high')
                      .map(s => `${s.name} (${s.percentage}%)`)
                      .join(' & ')}
                  </p>
                </div>
                <button className="text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 px-3 py-1 rounded transition-colors">
                  View Details
                </button>
              </li>
              
              {/* Medium Priority */}
              <li className="flex items-center justify-between p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                <div>
                  <p className="font-semibold text-orange-400">MEDIUM PRIORITY</p>
                  <p className="text-sm text-gray-300">
                    {dashboard.sources
                      .filter(s => s.priority === 'medium')
                      .map(s => `${s.name} (${s.percentage}%)`)
                      .join(' & ')}
                  </p>
                </div>
                <button className="text-sm font-semibold text-white bg-orange-500/80 hover:bg-orange-500 px-3 py-1 rounded transition-colors">
                  View Details
                </button>
              </li>
              
              {/* Low Priority */}
              <li className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <div>
                  <p className="font-semibold text-green-400">LOW PRIORITY</p>
                  <p className="text-sm text-gray-300">
                    Other sources (
                    {dashboard.sources
                      .filter(s => s.priority === 'low')
                      .reduce((sum, s) => sum + s.percentage, 0)}%)
                  </p>
                </div>
                <button className="text-sm font-semibold text-white bg-green-500/80 hover:bg-green-500 px-3 py-1 rounded transition-colors">
                  View Details
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Wins */}
          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Wins</h3>
            <div className="space-y-4">
              {dashboard.quickWins.map((win, index) => (
                <div key={index} className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <p className="font-semibold text-green-400">{win.title}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    Potential Reduction: <span className="font-bold text-white">{win.reduction.toLocaleString()} tons</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
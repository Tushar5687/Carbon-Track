// components/InsightsPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../context/UserContext';
import { UserButton, SignOutButton } from '@clerk/clerk-react';

const InsightsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mines } = useUserProfile();
  
  const mineId = location.state?.mineId;
  const mine = mines.find(m => m.id === mineId);
  const [selectedInsight, setSelectedInsight] = useState(null);

  if (!mine || !mine.insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-12 max-w-md border border-emerald-500/30 backdrop-blur-sm shadow-2xl">
            <div className="text-8xl mb-6">💡</div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Insights Not Available
            </h2>
            <p className="text-emerald-200 mb-8 text-lg">
              No insights data found for this mine.
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

  const { insights } = mine;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'medium': return 'from-orange-500/20 to-amber-500/20 border-orange-500/30';
      case 'low': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
  };

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

      {/* Insights Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl border border-purple-500/30 inline-block backdrop-blur-sm">
            <p className="text-purple-300 font-semibold flex items-center justify-center gap-2 text-lg">
              <span className="text-2xl">💡</span>
              AI Insights for: <span className="text-white font-bold">{mine.name}</span>
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
            Actionable Insights
          </h1>
          <p className="text-emerald-200 text-xl max-w-2xl mx-auto">
            AI-powered recommendations and implementation steps for <span className="text-white font-semibold">{mine.name}</span>
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.insights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => setSelectedInsight(insight)}
              className={`bg-gradient-to-br ${getPriorityGradient(insight.priority)} p-8 rounded-2xl border backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-4 h-4 rounded-full mt-1 ${getPriorityColor(insight.priority)}`}></div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                  insight.priority === 'high' ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                  insight.priority === 'medium' ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50' :
                  'bg-green-500/30 text-green-400 border border-green-500/50'
                }`}>
                  {getPriorityText(insight.priority)}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{insight.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-base">
                  <span className="text-emerald-200">Category:</span>
                  <span className="text-white font-semibold">{insight.category}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-emerald-200">Impact:</span>
                  <span className="text-white font-semibold">{insight.impact}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-emerald-200">Timeline:</span>
                  <span className="text-white font-semibold">{insight.timeline}</span>
                </div>
              </div>
              
              <div className="text-center">
                <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105">
                  View Steps →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Insight Modal */}
        {selectedInsight && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#013220] to-[#004d00] border border-emerald-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-8 border-b border-emerald-500/30">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedInsight.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                      selectedInsight.priority === 'high' ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                      selectedInsight.priority === 'medium' ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50' :
                      'bg-green-500/30 text-green-400 border border-green-500/50'
                    }`}>
                      {getPriorityText(selectedInsight.priority)}
                    </span>
                    <span className="text-lg text-emerald-200">Category: {selectedInsight.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-emerald-200 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 text-center backdrop-blur-sm">
                    <p className="text-lg text-emerald-200 mb-2">Impact Level</p>
                    <p className="text-2xl font-bold text-white">{selectedInsight.impact}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 text-center backdrop-blur-sm">
                    <p className="text-lg text-emerald-200 mb-2">Estimated Timeline</p>
                    <p className="text-2xl font-bold text-white">{selectedInsight.timeline}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 text-center backdrop-blur-sm">
                    <p className="text-lg text-emerald-200 mb-2">Implementation Steps</p>
                    <p className="text-2xl font-bold text-white">{selectedInsight.steps.length}</p>
                  </div>
                </div>

                {/* Implementation Steps */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                    Implementation Steps
                  </h3>
                  <div className="space-y-4">
                    {selectedInsight.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                      >
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 mt-0.5 shadow-lg">
                          {index + 1}
                        </div>
                        <p className="text-emerald-100 text-lg leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                {selectedInsight.additionalInfo && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Additional Information</h3>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                      <p className="text-blue-100 text-lg leading-relaxed">{selectedInsight.additionalInfo}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105">
                    Start Implementation
                  </button>
                  <button className="flex-1 bg-gradient-to-br from-white/10 to-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 transform hover:scale-105">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-8 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Need More Guidance?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-lg font-bold text-white mb-2">View Dashboard</h4>
              <p className="text-emerald-200 mb-4">See detailed emission analytics</p>
              <button
                onClick={() => navigate('/dashboard', { state: { mineId } })}
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300"
              >
                Open Dashboard
              </button>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📄</div>
              <h4 className="text-lg font-bold text-white mb-2">Download Report</h4>
              <p className="text-emerald-200 mb-4">Get comprehensive analysis PDF</p>
              <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300">
                Download PDF
              </button>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🔍</div>
              <h4 className="text-lg font-bold text-white mb-2">Analyze Documents</h4>
              <p className="text-emerald-200 mb-4">Upload more operational data</p>
              <button
                onClick={() => navigate('/documents', { state: { mineId, mineName: mine.name } })}
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300"
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center">
          <p className="text-lg text-emerald-200">
            Insights generated: {new Date(insights.generatedAt).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
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
      <div className="min-h-screen bg-[#013220] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="bg-white/10 rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Insights Not Available</h2>
            <p className="text-gray-300 mb-6">
              No insights data found for this mine.
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

  const { insights } = mine;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

      {/* Insights Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-4 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30 inline-block">
            <p className="text-purple-300 font-semibold flex items-center justify-center gap-2">
              <span className="text-xl">💡</span>
              AI Insights for: <span className="text-white">{mine.name}</span>
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Actionable Insights</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI-powered recommendations and implementation steps for {mine.name}
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.insights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => setSelectedInsight(insight)}
              className="bg-white/10 p-6 rounded-2xl border border-white/20 cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(insight.priority)}`}></div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  insight.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {getPriorityText(insight.priority)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{insight.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white font-medium">{insight.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Impact:</span>
                  <span className="text-white font-medium">{insight.impact}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Timeline:</span>
                  <span className="text-white font-medium">{insight.timeline}</span>
                </div>
              </div>
              
              <div className="text-center">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  View Steps →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Insight Modal */}
        {selectedInsight && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#013220] border border-green-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-300/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedInsight.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                      selectedInsight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      selectedInsight.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {getPriorityText(selectedInsight.priority)}
                    </span>
                    <span className="text-sm text-gray-300">Category: {selectedInsight.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-300">Impact Level</p>
                    <p className="text-lg font-bold text-white">{selectedInsight.impact}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-300">Estimated Timeline</p>
                    <p className="text-lg font-bold text-white">{selectedInsight.timeline}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-300">Steps</p>
                    <p className="text-lg font-bold text-white">{selectedInsight.steps.length}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">Implementation Steps</h3>
                <div className="space-y-3">
                  {selectedInsight.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            Insights generated: {new Date(insights.generatedAt).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
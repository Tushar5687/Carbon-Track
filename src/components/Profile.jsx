// components/Profile.jsx
import React, { useState } from 'react';
import { useUserProfile } from '../context/UserContext';
import { UserButton, SignOutButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { generateReportPDF } from '../utils/reportGenerator';

const Profile = () => {
  const { mines, addMine } = useUserProfile();
  const navigate = useNavigate();
  const [showAddMine, setShowAddMine] = useState(false);
  const [selectedMine, setSelectedMine] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [newMine, setNewMine] = useState({ name: '', location: '', subsidiary: '' });

  const handleAddMine = (e) => {
    e.preventDefault();
    if (newMine.name && newMine.location && newMine.subsidiary) {
      addMine(newMine.name, newMine.location, newMine.subsidiary);
      setNewMine({ name: '', location: '', subsidiary: '' });
      setShowAddMine(false);
    }
  };

  const handleMineClick = (mine) => {
    setSelectedMine(mine);
    setActiveTab('analysis');
  };

  const handleDownloadReport = () => {
    if (selectedMine && selectedMine.analysis) {
      generateReportPDF({
        mineName: selectedMine.name,
        analysis: selectedMine.analysis.analysis,
        suggestions: selectedMine.analysis.suggestions,
        mineId: selectedMine.id
      });
    }
  };

  const generateQuickReport = () => {
    if (selectedMine) {
      const reportData = {
        mineName: selectedMine.name,
        location: selectedMine.location,
        subsidiary: selectedMine.subsidiary,
        hasAnalysis: selectedMine.hasAnalysis,
        lastUpdated: selectedMine.analysis?.updatedAt || 'Not analyzed yet',
        status: selectedMine.hasAnalysis ? 'Analyzed' : 'Pending Analysis'
      };
      
      // Create a simple text report
      const reportContent = `
CARBON NEUTRALITY - MINE STATUS REPORT
=======================================

Mine Information:
-----------------
Name: ${reportData.mineName}
Location: ${reportData.location}
Subsidiary: ${reportData.subsidiary}

Analysis Status:
----------------
Status: ${reportData.status}
Last Updated: ${reportData.lastUpdated}

${reportData.hasAnalysis ? `
The mine has been analyzed for carbon emissions. 
Full detailed report with emission sources and reduction 
recommendations is available for download.
` : `
This mine is pending document analysis. 
Please upload operational documents to generate 
emission analysis and reduction strategies.
`}

Generated on: ${new Date().toLocaleDateString()}
      `;

      // Download as text file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mine_Status_${selectedMine.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
                onClick={() => navigate('/')}
                className="text-emerald-200 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
              >
                ← Home
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
                className="text-white bg-emerald-600 font-medium px-4 py-2 rounded-lg transition-all duration-300"
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

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Updated Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Operational Mines
            </h1>
            <p className="text-emerald-200 mt-2">Manage and analyze your operational mines</p>
          </div>
          <button
            onClick={() => setShowAddMine(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transform"
          >
            + Add New Mine
          </button>
        </div>

        {/* Add Mine Modal - UPDATED STYLING */}
        {showAddMine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#013220] to-[#004d00] border border-emerald-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Add New Mine</h3>
              <form onSubmit={handleAddMine} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-3">
                    Mine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMine.name}
                    onChange={(e) => setNewMine(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-emerald-300/50 transition-all duration-300"
                    placeholder="Gevra Mine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-3">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMine.location}
                    onChange={(e) => setNewMine(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-emerald-300/50 transition-all duration-300"
                    placeholder="Korba, Chhattisgarh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-3">
                    Subsidiary *
                  </label>
                  <select
                    required
                    value={newMine.subsidiary}
                    onChange={(e) => setNewMine(prev => ({ ...prev, subsidiary: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-300"
                  >
                    <option value="" className="bg-[#013220]">Select Subsidiary</option>
                    <option value="SECL" className="bg-[#013220]">SECL</option>
                    <option value="WCL" className="bg-[#013220]">WCL</option>
                    <option value="ECL" className="bg-[#013220]">ECL</option>
                    <option value="CCL" className="bg-[#013220]">CCL</option>
                    <option value="MCL" className="bg-[#013220]">MCL</option>
                    <option value="NCL" className="bg-[#013220]">NCL</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                  >
                    Add Mine
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMine(false)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Analysis Modal - UPDATED STYLING */}
        {selectedMine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#013220] to-[#004d00] border border-emerald-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-8 border-b border-emerald-500/30">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                    {selectedMine.name} Analytics
                  </h2>
                  <p className="text-emerald-200 mt-2">Location: {selectedMine.location} | Subsidiary: {selectedMine.subsidiary}</p>
                </div>
                <button
                  onClick={() => setSelectedMine(null)}
                  className="text-emerald-200 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Navigation Tabs - UPDATED STYLING */}
              <div className="flex border-b border-emerald-500/30 bg-white/5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-shrink-0 px-8 py-4 font-medium border-b-2 transition-all duration-300 ${
                    activeTab === 'dashboard' 
                      ? 'border-emerald-400 text-emerald-300 bg-white/5' 
                      : 'border-transparent text-emerald-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-shrink-0 px-8 py-4 font-medium border-b-2 transition-all duration-300 ${
                    activeTab === 'analysis' 
                      ? 'border-emerald-400 text-emerald-300 bg-white/5' 
                      : 'border-transparent text-emerald-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📄 Document Analysis
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex-shrink-0 px-8 py-4 font-medium border-b-2 transition-all duration-300 ${
                    activeTab === 'insights' 
                      ? 'border-emerald-400 text-emerald-300 bg-white/5' 
                      : 'border-transparent text-emerald-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  💡 AI Insights
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex-shrink-0 px-8 py-4 font-medium border-b-2 transition-all duration-300 ${
                    activeTab === 'reports' 
                      ? 'border-emerald-400 text-emerald-300 bg-white/5' 
                      : 'border-transparent text-emerald-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📋 Reports
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {activeTab === 'dashboard' && selectedMine.dashboard && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Dashboard</h3>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-6 rounded-2xl border border-yellow-500/30">
                      <p className="text-yellow-300 text-center text-lg">
                        Dashboard is available! Click the button below to view the full dashboard.
                      </p>
                      <div className="text-center mt-6">
                        <button
                          onClick={() => navigate('/dashboard', { state: { mineId: selectedMine.id } })}
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105"
                        >
                          Open Full Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'dashboard' && !selectedMine.dashboard && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">📊</div>
                    <h3 className="text-3xl font-bold mb-4 text-white">No Dashboard Data</h3>
                    <p className="text-emerald-200 mb-8 text-lg">
                      No dashboard data available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {activeTab === 'analysis' && selectedMine.analysis && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {selectedMine.name} Emission Analysis 📊
                      </h3>
                      <div className="p-6 rounded-2xl bg-white/10 border border-emerald-500/30 backdrop-blur-sm">
                        <div className="text-white prose prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-base leading-relaxed">
                            {selectedMine.analysis.analysis}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {selectedMine.name} Emission Reduction Recommendations 🌱
                      </h3>
                      <div className="p-6 rounded-2xl bg-white/10 border border-emerald-500/30 backdrop-blur-sm">
                        <div className="text-white prose prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-base leading-relaxed">
                            {selectedMine.analysis.suggestions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analysis' && !selectedMine.analysis && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">📄</div>
                    <h3 className="text-3xl font-bold mb-4 text-white">No Analysis Data</h3>
                    <p className="text-emerald-200 mb-8 text-lg">
                      No document analysis available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {activeTab === 'insights' && selectedMine.insights && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">AI Insights</h3>
                    <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-8 rounded-2xl border border-purple-500/30">
                      <p className="text-purple-300 text-center text-lg mb-6">
                        Insights are available! Click the button below to view detailed AI recommendations.
                      </p>
                      <div className="text-center">
                        <button
                          onClick={() => navigate('/insights', { state: { mineId: selectedMine.id } })}
                          className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                        >
                          Open Insights Page
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && !selectedMine.insights && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">💡</div>
                    <h3 className="text-3xl font-bold mb-4 text-white">No Insights Data</h3>
                    <p className="text-emerald-200 mb-8 text-lg">
                      No AI insights available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {/* REPORTS TAB CONTENT - UPDATED STYLING */}
                {activeTab === 'reports' && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent mb-6">
                      Reports & Exports
                    </h3>
                    
                    {/* Quick Status Report */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                      <h4 className="text-xl font-bold text-white mb-4">📋 Quick Status Report</h4>
                      <p className="text-blue-300 mb-6 text-lg">
                        Generate a quick overview report of this mine's current status and analysis progress.
                      </p>
                      <button
                        onClick={generateQuickReport}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                      >
                        Download Status Report
                      </button>
                    </div>

                    {/* Detailed Analysis Report */}
                    {selectedMine.hasAnalysis && (
                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4">📊 Detailed Analysis Report</h4>
                        <p className="text-emerald-300 mb-6 text-lg">
                          Download a comprehensive PDF report with emission analysis, reduction recommendations, and actionable insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          <button
                            onClick={handleDownloadReport}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center gap-3"
                          >
                            📄 Download Full PDF Report
                          </button>
                          <span className="text-emerald-200 text-sm flex items-center">
                            Includes charts, tables, and executive summary
                          </span>
                        </div>
                      </div>
                    )}

                    {!selectedMine.hasAnalysis && (
                      <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 p-8 rounded-2xl border border-gray-500/30 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4">📊 Detailed Analysis Report</h4>
                        <p className="text-gray-300 mb-6 text-lg">
                          Detailed reports are available after document analysis. Please analyze documents first to generate comprehensive reports.
                        </p>
                        <button
                          onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                        >
                          Analyze Documents
                        </button>
                      </div>
                    )}

                    {/* Report History */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-8 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
                      <h4 className="text-xl font-bold text-white mb-6">📈 Report History</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                          <div>
                            <p className="text-white font-medium text-lg">Status Report</p>
                            <p className="text-emerald-200 text-sm">Basic mine information and analysis status</p>
                          </div>
                          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">Available</span>
                        </div>
                        
                        {selectedMine.hasAnalysis && (
                          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                            <div>
                              <p className="text-white font-medium text-lg">Comprehensive Analysis Report</p>
                              <p className="text-emerald-200 text-sm">Full emission analysis with recommendations</p>
                            </div>
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">Available</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                          <div>
                            <p className="text-white font-medium text-lg">Quarterly Progress Report</p>
                            <p className="text-emerald-200 text-sm">Emission reduction progress tracking</p>
                          </div>
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mines Grid - UPDATED STYLING */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mines.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-12 max-w-md mx-auto border border-emerald-500/30 backdrop-blur-sm">
                <div className="text-8xl mb-6">🏭</div>
                <h3 className="text-2xl font-bold mb-4 text-white">No Mines Added Yet</h3>
                <p className="text-emerald-200 mb-8 text-lg">Add your first mine to start analyzing emissions</p>
                <button
                  onClick={() => setShowAddMine(true)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                >
                  Add Your First Mine
                </button>
              </div>
            </div>
          ) : (
            mines.map((mine) => (
              <div
                key={mine.id}
                onClick={() => handleMineClick(mine)}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 backdrop-blur-sm ${
                  mine.hasAnalysis
                    ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30 hover:from-emerald-500/30 hover:to-green-500/30 hover:shadow-2xl hover:shadow-emerald-500/25'
                    : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:from-white/20 hover:to-white/10 hover:shadow-2xl hover:shadow-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl text-white">🏭 {mine.name}</h3>
                  {mine.hasAnalysis ? (
                    <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ✅ Analyzed
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-gray-500 to-slate-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      📝 Needs Analysis
                    </span>
                  )}
                </div>
                <div className="space-y-3 text-emerald-100">
                  <p><strong className="text-white">Location:</strong> {mine.location}</p>
                  <p><strong className="text-white">Subsidiary:</strong> {mine.subsidiary}</p>
                  {mine.hasAnalysis && mine.analysis && (
                    <p className="text-emerald-300 text-sm mt-4">
                      Last analyzed: {new Date(mine.analysis.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  {mine.hasAnalysis ? (
                    <p className="text-emerald-300 text-sm font-medium">Click to view analysis & reports</p>
                  ) : (
                    <p className="text-blue-300 text-sm font-medium">Click to analyze documents</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
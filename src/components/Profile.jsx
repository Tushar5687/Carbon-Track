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
    <div className="min-h-screen bg-[#013220] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#013220]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-gray-300/20">
            <div className="flex items-center gap-3">
              <div className="text-white h-8 w-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865/L43.1065 32.8675/L43.1101 32.8739/L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889/L4.94662 32.777/L4.95178 32.7688ZM35.9868 29.004/L24 9.77997/L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Carbon Neutrality</h2>
            </div>
            
            <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mine Portfolio Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mine Portfolio</h1>
            <p className="text-gray-300 mt-2">Manage and analyze your mines</p>
          </div>
          <button
            onClick={() => setShowAddMine(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            + Add New Mine
          </button>
        </div>

        {/* Add Mine Modal - DARK GREEN THEME */}
        {showAddMine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#013220] border border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">Add New Mine</h3>
              <form onSubmit={handleAddMine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMine.name}
                    onChange={(e) => setNewMine(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                    placeholder="Gevra Mine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMine.location}
                    onChange={(e) => setNewMine(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                    placeholder="Korba, Chhattisgarh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subsidiary *
                  </label>
                  <select
                    required
                    value={newMine.subsidiary}
                    onChange={(e) => setNewMine(prev => ({ ...prev, subsidiary: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Add Mine
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMine(false)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Analysis Modal */}
        {selectedMine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#013220] border border-green-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-300/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedMine.name} Analytics</h2>
                  <p className="text-gray-300">Location: {selectedMine.location} | Subsidiary: {selectedMine.subsidiary}</p>
                </div>
                <button
                  onClick={() => setSelectedMine(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-600">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-shrink-0 px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'border-green-500 text-green-400' 
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-shrink-0 px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'analysis' 
                      ? 'border-green-500 text-green-400' 
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  📄 Document Analysis
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex-shrink-0 px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'insights' 
                      ? 'border-green-500 text-green-400' 
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  💡 AI Insights
                </button>
                {/* ACTIVATED REPORTS TAB */}
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex-shrink-0 px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'reports' 
                      ? 'border-green-500 text-green-400' 
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  📋 Reports
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {activeTab === 'dashboard' && selectedMine.dashboard && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Dashboard</h3>
                    <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-300 text-center">
                        Dashboard is available! Click the button below to view the full dashboard.
                      </p>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => navigate('/dashboard', { state: { mineId: selectedMine.id } })}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Open Full Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'dashboard' && !selectedMine.dashboard && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold mb-2">No Dashboard Data</h3>
                    <p className="text-gray-300 mb-6">
                      No dashboard data available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {activeTab === 'analysis' && selectedMine.analysis && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {selectedMine.name} Emission Analysis 📊
                    </h3>
                    <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                      <div className="text-white prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedMine.analysis.analysis}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4">
                      {selectedMine.name} Emission Reduction Recommendations 🌱
                    </h3>
                    <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                      <div className="text-white prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedMine.analysis.suggestions}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analysis' && !selectedMine.analysis && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-2xl font-bold mb-2">No Analysis Data</h3>
                    <p className="text-gray-300 mb-6">
                      No document analysis available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {activeTab === 'insights' && selectedMine.insights && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">AI Insights</h3>
                    <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                      <p className="text-purple-300 text-center">
                        Insights are available! Click the button below to view detailed AI recommendations.
                      </p>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => navigate('/insights', { state: { mineId: selectedMine.id } })}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Open Insights Page
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && !selectedMine.insights && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💡</div>
                    <h3 className="text-2xl font-bold mb-2">No Insights Data</h3>
                    <p className="text-gray-300 mb-6">
                      No AI insights available for {selectedMine.name}. Please analyze documents first.
                    </p>
                    <button
                      onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Analyze Documents
                    </button>
                  </div>
                )}

                {/* REPORTS TAB CONTENT */}
                {activeTab === 'reports' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Reports & Exports</h3>
                    
                    {/* Quick Status Report */}
                    <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-500/30">
                      <h4 className="text-lg font-bold text-white mb-3">📋 Quick Status Report</h4>
                      <p className="text-blue-300 mb-4">
                        Generate a quick overview report of this mine's current status and analysis progress.
                      </p>
                      <button
                        onClick={generateQuickReport}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Download Status Report
                      </button>
                    </div>

                    {/* Detailed Analysis Report */}
                    {selectedMine.hasAnalysis && (
                      <div className="bg-green-500/20 p-6 rounded-lg border border-green-500/30">
                        <h4 className="text-lg font-bold text-white mb-3">📊 Detailed Analysis Report</h4>
                        <p className="text-green-300 mb-4">
                          Download a comprehensive PDF report with emission analysis, reduction recommendations, and actionable insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleDownloadReport}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            📄 Download Full PDF Report
                          </button>
                          <span className="text-green-200 text-sm flex items-center">
                            Includes charts, tables, and executive summary
                          </span>
                        </div>
                      </div>
                    )}

                    {!selectedMine.hasAnalysis && (
                      <div className="bg-gray-500/20 p-6 rounded-lg border border-gray-500/30">
                        <h4 className="text-lg font-bold text-white mb-3">📊 Detailed Analysis Report</h4>
                        <p className="text-gray-300 mb-4">
                          Detailed reports are available after document analysis. Please analyze documents first to generate comprehensive reports.
                        </p>
                        <button
                          onClick={() => navigate('/documents', { state: { mineName: selectedMine.name, mineId: selectedMine.id } })}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Analyze Documents
                        </button>
                      </div>
                    )}

                    {/* Report History */}
                    <div className="bg-purple-500/20 p-6 rounded-lg border border-purple-500/30">
                      <h4 className="text-lg font-bold text-white mb-3">📈 Report History</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                          <div>
                            <p className="text-white font-medium">Status Report</p>
                            <p className="text-gray-300 text-sm">Basic mine information and analysis status</p>
                          </div>
                          <span className="text-green-400 text-sm">Available</span>
                        </div>
                        
                        {selectedMine.hasAnalysis && (
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                            <div>
                              <p className="text-white font-medium">Comprehensive Analysis Report</p>
                              <p className="text-gray-300 text-sm">Full emission analysis with recommendations</p>
                            </div>
                            <span className="text-green-400 text-sm">Available</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                          <div>
                            <p className="text-white font-medium">Quarterly Progress Report</p>
                            <p className="text-gray-300 text-sm">Emission reduction progress tracking</p>
                          </div>
                          <span className="text-yellow-400 text-sm">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mines.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🏭</div>
                <h3 className="text-xl font-bold mb-2">No Mines Added Yet</h3>
                <p className="text-gray-300 mb-4">Add your first mine to start analyzing emissions</p>
                <button
                  onClick={() => setShowAddMine(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 ${
                  mine.hasAnalysis
                    ? 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xl">🏭 {mine.name}</h3>
                  {mine.hasAnalysis ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">✅ Analyzed</span>
                  ) : (
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">📝 Needs Analysis</span>
                  )}
                </div>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Location:</strong> {mine.location}</p>
                  <p><strong>Subsidiary:</strong> {mine.subsidiary}</p>
                  {mine.hasAnalysis && mine.analysis && (
                    <p className="text-green-300 text-sm">
                      Last analyzed: {new Date(mine.analysis.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  {mine.hasAnalysis ? (
                    <p className="text-green-300 text-sm">Click to view analysis & reports</p>
                  ) : (
                    <p className="text-blue-300 text-sm">Click to analyze documents</p>
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
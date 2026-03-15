import React, { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserProfile } from '../context/UserContext';
import { generateReportPDF } from '../utils/reportGenerator';
import { analyzeDocument } from '../utils/api';

const Documents = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { updateMineAnalysis } = useUserProfile();

    const mineName = location.state?.mineName || "General Mining Operations";
    const mineId = location.state?.mineId;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setExtractedText("");
        setSuggestions("");
    };

    const handleExtract = async () => {
        if (!file || !mineId) return;

        setLoading(true);
        setExtractedText(""); 
        setSuggestions("");

        try {
            const result = await analyzeDocument(mineId, mineName, file);
            setExtractedText(result.analysis);
            setSuggestions(result.suggestions);

            updateMineAnalysis(mineId, {
                analysis: result.analysis,
                suggestions: result.suggestions
            });

        } catch (error) {
            setExtractedText("Failed to extract text. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (extractedText && suggestions && mineId) {
            generateReportPDF({
                mineName,
                analysis: extractedText,
                suggestions,
                mineId
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] font-sans text-white">
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
                            <button 
                                onClick={() => navigate('/leaderboard')}
                                className="text-emerald-200 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
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

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 inline-block backdrop-blur-sm">
                        <p className="text-blue-300 font-semibold flex items-center justify-center gap-2 text-lg">
                            <span className="text-2xl">🏭</span>
                            Analyzing for: <span className="text-white font-bold">{mineName}</span>
                        </p>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                        AI Document Analysis
                    </h1>
                    <p className="text-emerald-200 text-xl max-w-2xl mx-auto">
                        Upload mining operation documents for <span className="text-white font-semibold">{mineName}</span> to analyze emission sources and get reduction recommendations
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center justify-center gap-8 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-gradient-to-br from-white/10 to-white/5 px-8 py-16 text-center backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl text-emerald-400">📤</div>
                            <p className="text-2xl font-bold text-white">
                                Upload {mineName} Operations Document
                            </p>
                            <p className="text-lg text-emerald-200">
                                Supported formats: PDF only
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/25 transform hover:scale-105 cursor-pointer"
                        >
                            <span className="text-2xl">📁</span>
                            {file ? "Change File" : "Browse Files"}
                        </label>

                        {file && (
                            <div className="text-lg text-emerald-200">
                                Selected: <strong className="text-white">{file.name}</strong>
                            </div>
                        )}

                        <button
                            onClick={handleExtract}
                            disabled={!file || loading}
                            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Analyzing {mineName} Document...
                                </div>
                            ) : (
                                `Analyze ${mineName} Emissions`
                            )}
                        </button>
                    </div>
                </div>

                {extractedText && suggestions && (
                    <div className="mt-8 p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                        <div className="text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="text-green-300 text-xl mb-6 font-semibold">
                                Analysis completed successfully! Professional report is ready.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <button
                                    onClick={handleDownloadReport}
                                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 flex items-center gap-3"
                                >
                                    📄 Download Professional Report
                                </button>
                                <span className="text-emerald-200 text-lg">
                                    Get structured PDF with insights & action plan
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-6 mt-12">
                    <h3 className="text-3xl font-bold text-white">
                        {mineName} Emission Analysis 📊
                    </h3>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-emerald-500/30 backdrop-blur-sm max-h-[500px] overflow-y-auto">
                        {extractedText ? (
                            <div className="text-white prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-base leading-relaxed">
                                    {extractedText}
                                </div>
                            </div>
                        ) : (
                            <p className="text-emerald-200 italic text-lg text-center py-8">
                                {loading
                                    ? `Analyzing ${mineName} operations and calculating emission sources...`
                                    : `Upload a ${mineName} operations PDF to see emission analysis.`}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6 mt-12">
                    <h3 className="text-3xl font-bold text-white">
                        {mineName} Emission Reduction Recommendations 🌱
                    </h3>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-emerald-500/30 backdrop-blur-sm max-h-[500px] overflow-y-auto">
                        {suggestions ? (
                            <div className="text-white prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-base leading-relaxed">
                                    {suggestions}
                                </div>
                            </div>
                        ) : (
                            <p className="text-emerald-200 italic text-lg text-center py-8">
                                {loading
                                    ? `Generating actionable carbon reduction strategies for ${mineName}...`
                                    : `Emission reduction suggestions for ${mineName} will appear here after analysis.`}
                            </p>
                        )}
                    </div>
                </div>

                {extractedText && suggestions && (
                    <div className="flex flex-col gap-6 mt-12">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                            Next Steps
                        </h3>
                        <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                            <div className="text-center">
                                <p className="text-emerald-200 text-xl mb-8">
                                    Your analysis has been processed. Choose your next action:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="bg-gradient-to-br from-white/10 to-white/5 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        ← Back to Mines
                                    </button>
                                    <button
                                        onClick={handleDownloadReport}
                                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        📄 Download Report
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/dashboard', { 
                                                state: { 
                                                    mineId: mineId 
                                                } 
                                            });
                                        }}
                                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        📊 View Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/insights', { 
                                                state: { 
                                                    mineId: mineId 
                                                } 
                                            });
                                        }}
                                        className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        💡 View Insights
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Documents;
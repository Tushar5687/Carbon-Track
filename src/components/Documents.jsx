import { GoogleGenAI } from "@google/genai";
import React, { useState } from "react";
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserProfile } from '../context/UserContext';

const API_KEY = import.meta.env.VITE_API_KEY;

// --- Helper Function (Outside the component) ---
function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.readAsDataURL(file);
    });
}

async function generateEmissionReductionSuggestions(analysisResult, ai, mineName) {
  const prompt = `
Based on the following mining emission analysis for ${mineName} mine, generate a 
comprehensive and detailed list of **30 to 40 actionable, evidence-based recommendations** 
to reduce greenhouse gas emissions and improve overall sustainability performance.

Each recommendation must be:
- Specific to ${mineName}'s operations, mining method, and emission profile.
- Technically sound, realistic, and measurable (include quantitative goals where possible).
- Grouped under relevant categories — choose only those that apply, but feel free to 
  introduce new categories as needed.

📘 **Potential Categories (choose whichever fit best or add your own):**
1. Operational Efficiency & Equipment Optimization  
2. Energy Transition & Renewable Integration  
3. Carbon Capture, Utilization & Storage (CCUS)  
4. Technology & Automation  
5. Process Improvement & Waste Minimization  
6. Water & Dust Management  
7. Workforce Training & Behavioral Change  
8. Environmental Management & Rehabilitation  
9. Policy Compliance & Reporting  
10. Circular Economy & Resource Recovery  
11. Logistics & Transport Optimization  
12. Community & Ecosystem Impact Reduction  
13. Digital Transformation & Smart Monitoring  
14. Research, Innovation & Partnerships  

📑 **Formatting & Structure:**
- Use clear Markdown headings for each category.
- Provide **3–5 concrete recommendations** under each chosen category.
- Each point should start with an action verb (e.g., *Implement*, *Upgrade*, *Monitor*, *Adopt*).
- Wherever relevant, add expected outcomes (e.g., *"reduces diesel use by 12%"* or *"saves 400 MWh/year"*).
- Avoid generic advice — tailor everything to ${mineName}'s operational scale, mining type (e.g., underground, surface), and emission data trends.

📊 **Optional (if data allows):**
- Start with a short **"Emission Hotspot Summary"** highlighting key sources of emissions from the analysis before the recommendations.

--- MINING EMISSION ANALYSIS FOR ${mineName.toUpperCase()} MINE ---
${analysisResult}
--- END ANALYSIS ---
`;


    const model = 'gemini-2.5-flash'; 

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ text: prompt }]
        });
        return response.text;
    } catch (error) {
        console.error("Gemini suggestion generation failed:", error);
        throw new Error(`Suggestion generation failed: ${error.message}`);
    }
}

// --- React Component ---
const Documents = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState("");
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const navigate = useNavigate();
    const location = useLocation();
    const { updateMineAnalysis } = useUserProfile();

    // Get mine data from navigation state
    const mineName = location.state?.mineName || "General Mining Operations";
    const mineId = location.state?.mineId;

    const extractTextFromPDF = async (pdfFile) => {
        if (!pdfFile || pdfFile.type !== 'application/pdf') {
            return "Error: Invalid file or not a PDF.";
        }
        
        const prompt = `
            You are a mining emission analysis specialist. Analyze this mining operations document for ${mineName} mine and provide:

            # Mining Analysis for ${mineName} Mine (Sources and Percentage of Emissions by Sources)
            
            Extract and calculate the percentage distribution of greenhouse gas emissions by source specifically for ${mineName} mine. Focus on:
            - Heavy machinery and equipment emissions at ${mineName}
            - Transportation vehicles (trucks, haulers) at ${mineName}
            - Electricity consumption from grid for ${mineName}
            - On-site power generation at ${mineName}
            - Ventilation systems in ${mineName}
            - Blasting operations at ${mineName}
            - Coal processing activities at ${mineName}
            - Fugitive emissions from ${mineName}
            - Other identified sources specific to ${mineName}
            
            Present as: "Source: X%" and mention it's for ${mineName} mine.
            
            # Classification of Sources for ${mineName} Mine
            
            Categorize the emission sources into these types specifically for ${mineName}:
            - Scope 1 Emissions (Direct emissions from owned/controlled sources at ${mineName})
            - Scope 2 Emissions (Indirect emissions from purchased electricity/steam for ${mineName})
            - Scope 3 Emissions (Other indirect emissions in value chain of ${mineName})
            - Stationary Combustion at ${mineName}
            - Mobile Combustion at ${mineName}
            - Process Emissions at ${mineName}
            - Fugitive Emissions from ${mineName}
            
            For each classification, list the specific sources that fall under that category at ${mineName} mine.
            
            Provide the analysis in clear, structured markdown format with proper headings, specifically mentioning ${mineName} throughout.
        `;
        
        const model = 'gemini-2.5-flash';

        try {
            const pdfPart = await fileToGenerativePart(pdfFile);
            const response = await ai.models.generateContent({
                model: model,
                contents: [
                    pdfPart,
                    { text: prompt }
                ]
            });
            return response.text;
        } catch (error) {
            console.error("Gemini API extraction failed:", error);
            return "Extraction failed due to an API error. Check the console for details.";
        }
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setExtractedText("");
        setSuggestions("");
    };

    const handleExtract = async () => {
        if (!file) return;

        setLoading(true);
        setExtractedText(""); 
        setSuggestions("");

        try {
            const result = await extractTextFromPDF(file);
            setExtractedText(result);

            const suggestionsResult = await generateEmissionReductionSuggestions(result, ai, mineName);
            setSuggestions(suggestionsResult);

            // Store analysis for the specific mine
            if (mineId) {
                updateMineAnalysis(mineId, {
                    analysis: result,
                    suggestions: suggestionsResult
                });
            }

        } catch (error) {
            setExtractedText("Failed to extract text. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#013220] font-sans text-white">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-[#013220]/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 border-b border-gray-300/20">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/profile')}
                                className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
                            >
                                ← Back to Mines
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

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section with Mine Context */}
                <div className="text-center mb-12">
                    <div className="mb-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 inline-block">
                        <p className="text-blue-300 font-semibold flex items-center justify-center gap-2">
                            <span className="text-xl">🏭</span>
                            Analyzing for: <span className="text-white">{mineName}</span>
                        </p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Document Analysis</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Upload mining operation documents for {mineName} to analyze emission sources and get reduction recommendations
                    </p>
                </div>

                {/* Upload Section */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-white/30 bg-white/10 px-6 py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-5xl text-white">
                                upload_file
                            </span>
                            <p className="text-lg font-bold text-white">
                                Upload {mineName} Operations Document
                            </p>
                            <p className="text-sm text-gray-300">
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
                            className="flex items-center justify-center gap-2 rounded-lg bg-white text-[#013220] px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xl">
                                folder_open
                            </span>
                            {file ? "Change File" : "Browse Files"}
                        </label>

                        {file && (
                            <div className="text-sm text-gray-300">
                                Selected: <strong className="text-white">{file.name}</strong>
                            </div>
                        )}

                        <button
                            onClick={handleExtract}
                            disabled={!file || loading}
                            className="mt-4 bg-white text-[#013220] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {loading ? `Analyzing ${mineName} Document...` : `Analyze ${mineName} Emissions`}
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {extractedText && suggestions && (
                    <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-300 text-center text-lg">
                            ✅ Analysis completed successfully! Dashboard data has been generated.
                        </p>
                    </div>
                )}

                {/* Mining Analysis Result */}
                <div className="flex flex-col gap-4 mt-8">
                    <h3 className="text-2xl font-bold text-white">
                        {mineName} Emission Analysis 📊
                    </h3>
                    <div className="p-6 rounded-lg bg-white/10 border border-white/20 max-h-[500px] overflow-y-auto">
                        {extractedText ? (
                            <div className="text-white prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {extractedText}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-300 italic">
                                {loading
                                    ? `Analyzing ${mineName} operations and calculating emission sources...`
                                    : `Upload a ${mineName} operations PDF to see emission analysis.`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Emission Reduction Suggestions */}
                <div className="flex flex-col gap-4 mt-8">
                    <h3 className="text-2xl font-bold text-white">
                        {mineName} Emission Reduction Recommendations 🌱
                    </h3>
                    <div className="p-6 rounded-lg bg-white/10 border border-white/20 max-h-[500px] overflow-y-auto">
                        {suggestions ? (
                            <div className="text-white prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {suggestions}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-300 italic">
                                {loading
                                    ? `Generating actionable carbon reduction strategies for ${mineName}...`
                                    : `Emission reduction suggestions for ${mineName} will appear here after analysis.`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Dashboard Button Section */}
{extractedText && suggestions && (
  <div className="flex flex-col gap-4 mt-8">
    <h3 className="text-2xl font-bold text-white">
      Next Steps
    </h3>
    <div className="bg-white/10 p-6 rounded-lg border border-white/20">
      <div className="text-center">
        <p className="text-gray-300 mb-4">
          Your analysis has been processed. Dashboard and insights data has been generated.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            ← Back to Mines
          </button>
          <button
            onClick={() => {
              navigate('/dashboard', { 
                state: { 
                  mineId: mineId 
                } 
              });
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            📊 View Dashboard
          </button>
          {/* ADD INSIGHTS BUTTON */}
          <button
            onClick={() => {
              navigate('/insights', { 
                state: { 
                  mineId: mineId 
                } 
              });
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
import { GoogleGenAI } from "@google/genai";
import React, { useState } from "react";
<<<<<<< HEAD
import { UserButton, SignOutButton } from "@clerk/clerk-react";

const API_KEY = "AIzaSyBBUQ-JK-EdFtj6SfefM0ggHB-ldTwQWM8";

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

async function generateEmissionReductionSuggestions(analysisResult, ai) {
    const prompt = `
        Based on the following mining emission analysis, provide 
=======
// Tesseract is no longer needed since we are using Gemini
// import Tesseract from "tesseract.js"; 
import { API_KEY } from "../helper";


// --- Helper Function (Outside the component) ---

/**
 * Converts a File object (from a file input) into a GenerativePart object
 * with Base64 encoding, suitable for inline use with the Gemini API.
 */
function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
            const base64Data = reader.result.split(',')[1];
            
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type // Should be 'application/pdf'
                }
            });
        };
        // Read the file content as a Data URL
        reader.readAsDataURL(file);
    });
}

async function generateEmissionReductionSuggestions(analysisResult, ai) {
    // ... (implementation of the new function above) ...
    const prompt = `
        Based on the following document analysis which focuses on coal consumption,
        energy usage, and carbon emissions in a coal mine operation, provide 
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
        5 to 7 concrete, actionable suggestions to reduce greenhouse gas emissions. 
        
        Format the response using Markdown headings and bullet points.
        Focus on these categories:
<<<<<<< HEAD
        1. Operational Efficiency (e.g., equipment, processes)
        2. Energy Transition (e.g., renewable power sources)
        3. Carbon Capture/Neutralization
        4. Technology Implementation

        --- MINING EMISSION ANALYSIS ---
=======
        1. Operational Efficiency (e.g., equipment)
        2. Energy Transition (e.g., power sources)
        3. Carbon Capture/Neutralization.

        --- DOCUMENT ANALYSIS ---
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
        ${analysisResult}
        --- END ANALYSIS ---
    `;

    const model = 'gemini-2.5-flash'; 

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ text: prompt }]
        });
<<<<<<< HEAD
        return response.text;
=======

        return response.text;

>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
    } catch (error) {
        console.error("Gemini suggestion generation failed:", error);
        throw new Error(`Suggestion generation failed: ${error.message}`);
    }
}

<<<<<<< HEAD
// --- React Component ---
const Documents = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState("");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

=======

// --- React Component ---

const Document = () => {
    // We can remove the Tesseract import since it's not used now
    // Tesseract is not needed, so we are removing it from the imports
    
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState("")
    // Note: We don't need 'progress' state anymore as Gemini is server-side and synchronous for smaller files

    const ai = new GoogleGenAI({ apiKey: API_KEY });


    // This function now uses the Gemini API logic
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
    const extractTextFromPDF = async (pdfFile) => {
        if (!pdfFile || pdfFile.type !== 'application/pdf') {
            return "Error: Invalid file or not a PDF.";
        }
        
<<<<<<< HEAD
        const prompt = `
            You are a mining emission analysis specialist. Analyze this mining operations document and provide:

            # Mining Analysis (Sources and Percentage of Emissions by Sources)
            
            Extract and calculate the percentage distribution of greenhouse gas emissions by source. Focus on:
            - Heavy machinery and equipment emissions
            - Transportation vehicles (trucks, haulers)
            - Electricity consumption from grid
            - On-site power generation
            - Ventilation systems
            - Blasting operations
            - Coal processing activities
            - Fugitive emissions
            - Other identified sources
            
            Present as: "Source: X%"
            
            # Classification of Sources
            
            Categorize the emission sources into these types:
            - Scope 1 Emissions (Direct emissions from owned/controlled sources)
            - Scope 2 Emissions (Indirect emissions from purchased electricity/steam)
            - Scope 3 Emissions (Other indirect emissions in value chain)
            - Stationary Combustion
            - Mobile Combustion
            - Process Emissions
            - Fugitive Emissions
            
            For each classification, list the specific sources that fall under that category.
            
            Provide the analysis in clear, structured markdown format with proper headings.
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
=======
        // Define the prompt based on your app's goal (coal mine operations)
        const prompt = `
            You are a document analysis specialist for a Carbon Tracking application.
            Extract all key information from this PDF document, focusing on:
            1. **Coal consumption** (in tons, kg, or similar units).
            2. **Energy usage/power generation** figures.
            3. **Any mention of carbon emissions or greenhouse gases**.
            4. **Any numerical data** that can be used for calculation.
            Return the raw text of the document, but clearly **bold** the identified key data points.
        `;
        const model = 'gemini-2.5-flash'; // Excellent for document analysis

        try {
            // 1. Convert the file into the required Base64 format
            const pdfPart = await fileToGenerativePart(pdfFile);

            // 2. Call the Gemini API with the PDF and the prompt
            const response = await ai.models.generateContent({
                model: model,
                contents: [
                    pdfPart, // The PDF file data
                    { text: prompt } // The instructions
                ]
            });

            // 3. Return the AI-generated text
            return response.text;

        } catch (error) {
            console.error("Gemini API extraction failed:", error);
            // In a production app, you might want more graceful error handling
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
            return "Extraction failed due to an API error. Check the console for details.";
        }
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
<<<<<<< HEAD
        setExtractedText("");
        setSuggestions("");
=======
        setExtractedText(""); // Clear previous results when a new file is selected
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
    };

    const handleExtract = async () => {
        if (!file) return;

        setLoading(true);
        setExtractedText(""); 
<<<<<<< HEAD
        setSuggestions("");
=======
        setSuggestions("")
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b

        try {
            const result = await extractTextFromPDF(file);
            setExtractedText(result);

<<<<<<< HEAD
            const suggestionsResult = await generateEmissionReductionSuggestions(result, ai);
            setSuggestions(suggestionsResult);
=======
            const suggestionsResult = await generateEmissionReductionSuggestions(extractedText, ai);
            setSuggestions(suggestionsResult);

>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
        } catch (error) {
            setExtractedText("Failed to extract text. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-[#013220] font-sans text-white">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-[#013220]/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 border-b border-gray-300/20">
                        <div className="flex items-center gap-3">
                            <div className="text-white h-8 w-8">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
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
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Document Analysis</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Upload mining operation documents to analyze emission sources and get reduction recommendations
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
                                Upload Mining Operations Document
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
                            {loading ? "Analyzing Mining Document..." : "Analyze Mining Emissions"}
                        </button>
                    </div>
                </div>

                {/* Mining Analysis Result */}
                <div className="flex flex-col gap-4 mt-8">
                    <h3 className="text-2xl font-bold text-white">
                        Mining Emission Analysis 📊
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
                                    ? "Analyzing mining operations and calculating emission sources..."
                                    : "Upload a mining operations PDF to see emission analysis."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Emission Reduction Suggestions */}
                <div className="flex flex-col gap-4 mt-8">
                    <h3 className="text-2xl font-bold text-white">
                        Emission Reduction Recommendations 🌱
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
                                    ? "Generating actionable carbon reduction strategies..."
                                    : "Emission reduction suggestions will appear here after analysis."}
                            </p>
                        )}
=======
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
            {/* ... (Header component is commented out, keeping it clean) */}

            {/* Main */}
            <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 xl:px-40">
                <div className="mx-auto flex max-w-4xl flex-col gap-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Document Analysis
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Upload and analyze documents related to coal mine operations to
                            track and neutralize carbon emissions.
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 dark:bg-primary/20 px-6 py-14 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-5xl text-primary">
                                    upload_file
                                </span>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    Drag and drop or browse to upload
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    folder_open
                                </span>
                                {file ? "Change File" : "Browse Files"}
                            </label>

                            {file && (
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Selected: <strong>{file.name}</strong>
                                </div>
                            )}

                            <button
                                onClick={handleExtract}
                                disabled={!file || loading}
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? "Analyzing Document..." : "Analyze Document"}
                            </button>
                        </div>
                    </div>

                    {/* Gemini Result (I changed the heading to be more accurate) */}
                    <div className="flex flex-col gap-4 mt-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Gemini Document Analysis Result 🤖
                        </h3>
                        <div className="p-4 rounded-lg bg-background-dark/20 dark:bg-background-light/5 border border-black/10 dark:border-white/10 max-h-[400px] overflow-y-auto">
                            {extractedText ? (
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {extractedText}
                                </pre>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 italic">
                                    {loading
                                        ? "Extracting text and analyzing key data points from PDF..."
                                        : "No text extracted yet. Upload and analyze a PDF to see the results."}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* gemini will provide suggestion  */}
                     <div className="flex flex-col gap-4 mt-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Gemini suggestions to mitigate emission🤖
                        </h3>
                        <div className="p-4 rounded-lg bg-background-dark/20 dark:bg-background-light/5 border border-black/10 dark:border-white/10 max-h-[400px] overflow-y-auto">
                            {suggestions ? (
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {suggestions}
                                </pre>
                            ) : (
                                  <p className="text-gray-600 dark:text-gray-400 italic">
                                    {loading
                                        ? "Generating actionable carbon reduction recommendations..."
                                        : "Suggestions will appear here after a successful analysis."}
                                </p>
                            )}
                        </div>
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b
                    </div>
                </div>
            </main>
        </div>
    );
};

<<<<<<< HEAD
export default Documents;
=======
export default Document;
>>>>>>> 5c90367f2a58ceac8fcf3d962802c2e1924eaf9b

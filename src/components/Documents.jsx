import { GoogleGenAI } from "@google/genai";
import React, { useState } from "react";
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
        5 to 7 concrete, actionable suggestions to reduce greenhouse gas emissions. 
        
        Format the response using Markdown headings and bullet points.
        Focus on these categories:
        1. Operational Efficiency (e.g., equipment)
        2. Energy Transition (e.g., power sources)
        3. Carbon Capture/Neutralization.

        --- DOCUMENT ANALYSIS ---
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
    const extractTextFromPDF = async (pdfFile) => {
        if (!pdfFile || pdfFile.type !== 'application/pdf') {
            return "Error: Invalid file or not a PDF.";
        }
        
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
            return "Extraction failed due to an API error. Check the console for details.";
        }
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setExtractedText(""); // Clear previous results when a new file is selected
    };

    const handleExtract = async () => {
        if (!file) return;

        setLoading(true);
        setExtractedText(""); 
        setSuggestions("")

        try {
            const result = await extractTextFromPDF(file);
            setExtractedText(result);

            const suggestionsResult = await generateEmissionReductionSuggestions(extractedText, ai);
            setSuggestions(suggestionsResult);

        } catch (error) {
            setExtractedText("Failed to extract text. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Document;

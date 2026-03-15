// WHY: THE MOST IMPORTANT FILE.
// Moves Gemini API calls from frontend to backend.
// Your API key is no longer exposed in the browser!
import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import supabase from '../config/supabase.js';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';

const router = Router();
router.use(requireAuthentication);

// multer stores uploaded files in memory temporarily
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/analysis/:mineId — Upload PDF, analyze, save results
// Replaces: handleExtract() + extractTextFromPDF() + generateEmissionReductionSuggestions() in Documents.jsx
router.post('/:mineId', upload.single('pdf'), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { mineId } = req.params;
    const { mineName } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) return res.status(400).json({ error: 'No PDF provided' });

    // 1. Verify mine belongs to user
    const { data: mine, error: mineErr } = await supabase
      .from('mines').select('*')
      .eq('id', mineId).eq('clerk_id', clerkId).single();
    if (mineErr || !mine) return res.status(404).json({ error: 'Mine not found' });

    // 2. Upload PDF to Supabase Storage
    const fileName = `${clerkId}/${mineId}/${Date.now()}_${pdfFile.originalname}`;
    await supabase.storage.from('mining-pdfs')
      .upload(fileName, pdfFile.buffer, { contentType: 'application/pdf', upsert: true });

    const { data: urlData } = supabase.storage.from('mining-pdfs').getPublicUrl(fileName);
    const pdfUrl = urlData?.publicUrl || null;

    // 3. Send PDF to Gemini for analysis (same prompt as your Documents.jsx)
    const base64Data = pdfFile.buffer.toString('base64');
    const analysisPrompt = `You are a mining emission analysis specialist. Analyze this document for ${mineName} mine...
      [Same prompt you have in Documents.jsx extractTextFromPDF()]`;

    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { data: base64Data, mimeType: 'application/pdf' } },
        { text: analysisPrompt }
      ]
    });
    const analysisResult = analysisResponse.text;

    // 4. Generate suggestions (same prompt as your Documents.jsx)
    const suggestionsPrompt = `Based on the following analysis for ${mineName} mine, generate 30-40 recommendations...
      [Same prompt you have in generateEmissionReductionSuggestions()]
      ${analysisResult}`;

    const suggestionsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: suggestionsPrompt }]
    });
    const suggestionsResult = suggestionsResponse.text;

    // 5. Save to database
    await supabase.from('mine_analyses').upsert({
      mine_id: mineId,
      analysis_text: analysisResult,
      suggestions_text: suggestionsResult,
      pdf_url: pdfUrl
    }, { onConflict: 'mine_id' }).select().single();

    // 6. Mark mine as analyzed
    await supabase.from('mines')
      .update({ has_analysis: true, updated_at: new Date().toISOString() })
      .eq('id', mineId);

    // 7. Return results
    res.json({ analysis: analysisResult, suggestions: suggestionsResult, pdfUrl });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
});

// POST /api/analysis/:mineId/dashboard — Save dashboard/insights data
router.post('/:mineId/dashboard', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { dashboardData, insightsData } = req.body;

    const { data: mine } = await supabase.from('mines').select('id')
      .eq('id', req.params.mineId).eq('clerk_id', clerkId).single();
    if (!mine) return res.status(404).json({ error: 'Mine not found' });

    await supabase.from('mine_analyses').update({
      dashboard_data: dashboardData,
      insights_data: insightsData,
      updated_at: new Date().toISOString()
    }).eq('mine_id', req.params.mineId);

    res.json({ message: 'Dashboard data saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save dashboard data' });
  }
});

export default router;
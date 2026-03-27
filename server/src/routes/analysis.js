// WHY: THE MOST IMPORTANT FILE.
// Moves Gemini API calls from frontend to backend.
// Your API key is no longer exposed in the browser!

import { Router } from 'express';
import supabase from '../config/supabase.js';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import { getUserId } from '../middleware/auth.js';

const router = Router();

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* =========================================================
   ✅ 1. ANALYSIS API (WORKS WITH GEMINI + INSERTS DATA)
========================================================= */
router.post('/:mineId', upload.single('pdf'), async (req, res) => {
  try {
    const clerkId = getUserId(req);
    const { mineId } = req.params;
    const { mineName } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF provided' });
    }

    // 🔹 Verify mine
    const { data: mine, error: mineErr } = await supabase
      .from('mines')
      .select('*')
      .eq('id', mineId)
      .eq('clerk_id', clerkId)
      .single();

    if (mineErr || !mine) {
      console.error("Mine error:", mineErr);
      return res.status(404).json({ error: 'Mine not found' });
    }

    // 🔹 Upload PDF
    const fileName = `${clerkId}/${mineId}/${Date.now()}_${pdfFile.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from('mining-pdfs')
      .upload(fileName, pdfFile.buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({ error: 'PDF upload failed' });
    }

    const { data: urlData } = supabase.storage
      .from('mining-pdfs')
      .getPublicUrl(fileName);

    const pdfUrl = urlData?.publicUrl || null;

    // 🔹 Gemini analysis
    const base64Data = pdfFile.buffer.toString('base64');

    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { data: base64Data, mimeType: 'application/pdf' } },
        { text: `Analyze mining emissions for ${mineName}` }
      ]
    });

    const analysisResult = analysisResponse.text;

    const suggestionsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: `Give recommendations based on:\n${analysisResult}` }
      ]
    });

    const suggestionsResult = suggestionsResponse.text;

    // 🔹 SAVE TO DB (CRITICAL FIX: error handling added)
    const { data, error } = await supabase
      .from('mine_analyses')
      .upsert({
        mine_id: mineId,
        analysis_text: analysisResult,
        suggestions_text: suggestionsResult,
        pdf_url: pdfUrl
      }, { onConflict: 'mine_id' });

    console.log("UPSERT DATA:", data);
    console.log("UPSERT ERROR:", error);

    if (error) {
      console.error("❌ UPSERT FAILED:", error);
      return res.status(500).json({ error: 'Failed to save analysis' });
    }

    // 🔹 Update mine
    await supabase
      .from('mines')
      .update({
        has_analysis: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', mineId);

    res.json({
      analysis: analysisResult,
      suggestions: suggestionsResult,
      pdfUrl
    });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
});


/* =========================================================
   ✅ 2. DASHBOARD API (ONLY UPDATE, NO UPSERT BUG)
========================================================= */
router.post('/:mineId/dashboard', async (req, res) => {
  try {
    const clerkId = getUserId(req);
    const { mineId } = req.params;
    const { dashboardData, insightsData } = req.body;

    // 🔹 Verify mine
    const { data: mine, error: mineError } = await supabase
      .from('mines')
      .select('id')
      .eq('id', mineId)
      .eq('clerk_id', clerkId)
      .single();

    if (mineError || !mine) {
      console.error("Mine fetch error:", mineError);
      return res.status(404).json({ error: 'Mine not found' });
    }

    // 🔹 Update dashboard data
    const { data, error } = await supabase
      .from('mine_analyses')
      .update({
        dashboard_data: dashboardData,
        insights_data: insightsData,
        updated_at: new Date().toISOString()
      })
      .eq('mine_id', mineId);

    console.log("UPDATE DATA:", data);
    console.log("UPDATE ERROR:", error);

    if (error) {
      console.error("❌ UPDATE FAILED:", error);
      return res.status(500).json({ error: 'Failed to save dashboard data' });
    }

    res.json({ message: 'Dashboard data saved' });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: 'Failed to save dashboard data' });
  }
});

export default router;
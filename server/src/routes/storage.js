// WHY: Generates signed download URLs for uploaded PDFs
import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = Router();
router.use(requireAuthentication);

// GET /api/storage/download/:mineId
router.get('/download/:mineId', async (req, res) => {
  try {
    const { data: analysis } = await supabase
      .from('mine_analyses').select('pdf_url')
      .eq('mine_id', req.params.mineId).single();

    if (!analysis?.pdf_url) return res.status(404).json({ error: 'No PDF found' });

    const filePath = analysis.pdf_url.split('/mining-pdfs/')[1];
    const { data: signedUrl } = await supabase.storage
      .from('mining-pdfs')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    res.json({ downloadUrl: signedUrl.signedUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

export default router;
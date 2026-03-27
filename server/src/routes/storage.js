import { Router } from 'express';
import supabase from '../config/supabase.js';
import { getUserId } from '../middleware/auth.js';

const router = Router();

router.get('/download/:mineId', async (req, res) => {
  try {
    const clerkId = getUserId(req);
    if (!clerkId) return res.status(401).json({ error: 'Not authenticated' });

    const { data: analysis } = await supabase
      .from('mine_analyses').select('pdf_url')
      .eq('mine_id', req.params.mineId).single();

    if (!analysis?.pdf_url) return res.status(404).json({ error: 'No PDF found' });

    const filePath = analysis.pdf_url.split('/mining-pdfs/')[1];
    const { data: signedUrl } = await supabase.storage
      .from('mining-pdfs')
      .createSignedUrl(filePath, 3600);

    res.json({ downloadUrl: signedUrl.signedUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

export default router;
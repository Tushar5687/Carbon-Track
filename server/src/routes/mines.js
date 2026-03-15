// WHY: Replaces mine CRUD in UserContext (localStorage).
import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = Router();
router.use(requireAuthentication);

// GET /api/mines — Get all user's mines with analysis data
// Replaces: JSON.parse(localStorage.getItem(`mines_${email}`))
router.get('/', async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const { data: mines, error } = await supabase
      .from('mines')
      .select(`*, mine_analyses (
        id, analysis_text, suggestions_text,
        dashboard_data, insights_data, pdf_url,
        created_at, updated_at
      )`)
      .eq('clerk_id', clerkId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to match frontend's expected shape
    const transformedMines = mines.map(mine => {
      const analysis = mine.mine_analyses?.[0] || null;
      return {
        id: mine.id,
        name: mine.name,
        location: mine.location,
        subsidiary: mine.subsidiary,
        hasAnalysis: mine.has_analysis,
        createdAt: mine.created_at,
        analysis: analysis ? {
          analysis: analysis.analysis_text,
          suggestions: analysis.suggestions_text,
          updatedAt: analysis.updated_at
        } : null,
        dashboard: analysis?.dashboard_data || null,
        insights: analysis?.insights_data || null
      };
    });

    res.json({ mines: transformedMines });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mines' });
  }
});

// POST /api/mines — Create a mine
// Replaces: addMine() in UserContext
router.post('/', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { name, location, subsidiary } = req.body;

    const { data, error } = await supabase
      .from('mines')
      .insert({ clerk_id: clerkId, name, location, subsidiary })
      .select().single();

    if (error) throw error;

    res.json({
      mine: {
        id: data.id, name: data.name,
        location: data.location, subsidiary: data.subsidiary,
        hasAnalysis: false, analysis: null,
        dashboard: null, insights: null,
        createdAt: data.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mine' });
  }
});

// DELETE /api/mines/:mineId — Delete a mine
router.delete('/:mineId', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { error } = await supabase
      .from('mines')
      .delete()
      .eq('id', req.params.mineId)
      .eq('clerk_id', clerkId);
    if (error) throw error;
    res.json({ message: 'Mine deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mine' });
  }
});

export default router;
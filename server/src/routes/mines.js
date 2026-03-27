import { Router } from 'express';
import { getUserId } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const clerkId = getUserId(req);
    if (!clerkId) return res.status(401).json({ error: 'Not authenticated' });

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
    console.error('Error fetching mines:', err);
    res.status(500).json({ error: 'Failed to fetch mines' });
  }
});

router.post('/', async (req, res) => {
  try {
    const clerkId = getUserId(req);
    if (!clerkId) return res.status(401).json({ error: 'Not authenticated' });

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
    console.error('Error creating mine:', err);
    res.status(500).json({ error: 'Failed to create mine' });
  }
});

router.delete('/:mineId', async (req, res) => {
  try {
    const clerkId = getUserId(req);
    if (!clerkId) return res.status(401).json({ error: 'Not authenticated' });

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
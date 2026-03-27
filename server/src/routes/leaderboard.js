// server/routes/leaderboard.js

import { Router } from 'express';
import supabase from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mine_analyses')
      .select(`
        *,
        mines (
          id,
          name,
          location,
          subsidiary
        )
      `);

    if (error) throw error;

    const ranked = data
      .map(item => {
        const mine = item.mines;
        const dashboard = item.dashboard_data || {};
        const insights = item.insights_data || {};

        const reductionProgress = dashboard?.reductionProgress ?? null;

        const quickWinsTotal = Array.isArray(dashboard?.quickWins)
          ? dashboard.quickWins.reduce((sum, w) => sum + (w.reduction || 0), 0)
          : 0;

        const quarterlyTrend = Array.isArray(dashboard?.quarterlyTrend)
          ? dashboard.quarterlyTrend
          : [];

        const latestEmissions = quarterlyTrend.length > 0
          ? quarterlyTrend[quarterlyTrend.length - 1]?.emissions ?? null
          : (dashboard?.totalEmissions ?? null);

        const largestSource = dashboard?.largestSource ?? null;

        const highPriorityCount = Array.isArray(insights?.insights)
          ? insights.insights.filter(i => i.priority === 'high').length
          : 0;

        return {
          id: mine?.id,
          name: mine?.name,
          location: mine?.location,
          subsidiary: mine?.subsidiary,
          reductionProgress,
          quickWinsTotal,
          totalEmissions: latestEmissions,
          largestSource,
          highPriorityInsights: highPriorityCount,
          lastUpdated: item.updated_at,
        };
      })
      .filter(m => m.reductionProgress !== null)
      .sort((a, b) => b.reductionProgress - a.reductionProgress)
      .map((mine, index) => ({
        ...mine,
        rank: index + 1
      }));

    res.json({
      leaderboard: ranked,
      total: ranked.length
    });

  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({
      error: 'Failed to fetch leaderboard'
    });
  }
});

export default router;
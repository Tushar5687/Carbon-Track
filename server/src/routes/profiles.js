import { Router } from 'express';
import supabase from '../config/supabase.js';
import { getUserId } from '../middleware/auth.js';

const router = Router();

// GET profile
router.get('/me', async (req, res) => {
  try {
    const clerkId = getUserId(req);

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.json({ profile: null });
    }

    if (error) {
      console.error("FETCH PROFILE ERROR:", error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    res.json({ profile: data });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST profile
router.post('/', async (req, res) => {
  try {
    const clerkId = getUserId(req);

    const {
      fullName,
      officialEmail,
      designation,
      subsidiary,
      location,
      phone
    } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        clerk_id: clerkId,
        full_name: fullName,
        official_email: officialEmail,
        designation,
        subsidiary,
        location,
        phone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'clerk_id' })
      .select()
      .single();

    console.log("PROFILE UPSERT:", data);
    console.log("PROFILE ERROR:", error);

    if (error) {
      console.error("PROFILE UPSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ profile: data });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
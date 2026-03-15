// WHY: Replaces ProfileSetup localStorage logic.
import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = Router();
router.use(requireAuthentication);

// GET /api/profiles/me — Check if user has profile
// Replaces: localStorage.getItem(`profile_${email}`)
router.get('/me', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.json({ profile: null }); // Not found = no profile yet
    }
    if (error) throw error;
    res.json({ profile: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profiles — Save/update profile
// Replaces: updateUserProfile(formData)
router.post('/', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { fullName, officialEmail, designation, subsidiary, location, phone } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        clerk_id: clerkId,
        full_name: fullName,
        official_email: officialEmail,
        designation, subsidiary, location, phone
      }, { onConflict: 'clerk_id' })
      .select().single();

    if (error) throw error;
    res.json({ profile: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
// WHY: Entry point — sets up Express, middleware, and routes.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkAuth } from './middleware/auth.js';
import profileRoutes from './routes/profiles.js';
import mineRoutes from './routes/mines.js';
import analysisRoutes from './routes/analysis.js';
import storageRoutes from './routes/storage.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// WHY: CORS lets your React app (Vercel domain) call this API.
// Without it, browsers block cross-origin requests.
app.use(cors({
  origin:"*",
  credentials: true
}));

// WHY: Parse JSON bodies. 50mb limit for base64 PDF data.
app.use(express.json({ limit: '50mb' }));

// WHY: Leaderboard is public — registered BEFORE clerkAuth so it doesn't
// require a Clerk session token. All other routes remain protected.
app.use('/api/leaderboard', leaderboardRoutes);

// WHY: Applies Clerk auth check to all routes below this line
app.use(clerkAuth);

// Each route file handles one resource
app.use('/api/profiles', profileRoutes);
app.use('/api/mines', mineRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/storage', storageRoutes);

// Health check (Render uses this to verify deployment)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Carbon Track API running on port ${PORT}`);
});
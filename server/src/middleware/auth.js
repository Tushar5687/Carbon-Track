// WHY: Verifies Clerk JWT token on every request.
// Ensures only logged-in users can access your API.
// Attaches req.auth.userId so routes know WHICH user.
import { clerkMiddleware, getAuth } from '@clerk/express';

export const clerkAuth = clerkMiddleware();

// Helper to get userId from request
export const getUserId = (req) => {
  const auth = getAuth(req);
  return auth?.userId;
};
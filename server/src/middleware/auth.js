// WHY: Verifies Clerk JWT token on every request.
// Ensures only logged-in users can access your API.
// Attaches req.auth.userId so routes know WHICH user.
import { clerkMiddleware, requireAuth } from '@clerk/express';

export const clerkAuth = clerkMiddleware();
export const requireAuthentication = requireAuth();
// Plan constants shared by client and server.
// Kept free of any server-only imports (Redis, next/headers) so client
// components can display allowances without pulling in the rate limiter.

/** Signed-in free users: successful analyses per rolling 24h. */
export const FREE_DAILY_ANALYSES = 2;

/**
 * Analyses allowed without an account. The product flow puts an auth wall at
 * Analyze, so this is 0 by default — it also guarantees the public endpoint is
 * never unlimited for unauthenticated callers. Set to 1 to offer an anonymous
 * preview analysis before the wall.
 */
export const ANON_FREE_ANALYSES = 0;

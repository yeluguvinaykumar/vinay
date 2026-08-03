/**
 * Graceful query wrapper. When the database is unreachable (e.g. local dev
 * without PostgreSQL running), public pages fall back to empty data instead
 * of crashing with a PrismaClientInitializationError.
 */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn("[db] query failed, using fallback:", (error as Error).message);
    return fallback;
  }
}

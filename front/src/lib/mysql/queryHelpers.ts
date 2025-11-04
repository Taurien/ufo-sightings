import sequelize from "./db";
import { QueryTypes } from "sequelize";

/**
 * Execute raw SELECT queries with automatic type casting
 * Optimized for read-only operations
 */
export async function rawQuery<T extends Record<string, any>>(
  sql: string,
  replacements?: Record<string, any>
): Promise<T[]> {
  const results = await sequelize.query<T>(sql, {
    replacements,
    type: QueryTypes.SELECT,
    raw: true,
    nest: true,
  });
  return results as unknown as T[];
}

/**
 * Execute a SELECT query with result caching
 * Useful for frequently accessed, rarely changing data
 */
const queryCache = new Map<string, { data: any; expires: number }>();

export async function cachedQuery<T extends Record<string, any>>(
  sql: string,
  cacheKey: string,
  ttlSeconds: number = 300,
  replacements?: Record<string, any>
): Promise<T[]> {
  // Note: In production, use Redis or similar for distributed caching
  const now = Date.now();
  const cached = queryCache.get(cacheKey);

  if (cached && cached.expires > now) {
    return cached.data as T[];
  }

  const results = await rawQuery<T>(sql, replacements);
  queryCache.set(cacheKey, {
    data: results,
    expires: now + ttlSeconds * 1000,
  });

  return results;
}

/**
 * Clear cache for a specific key or all cache
 */
export function clearCache(cacheKey?: string): void {
  if (cacheKey) {
    queryCache.delete(cacheKey);
  } else {
    queryCache.clear();
  }
}

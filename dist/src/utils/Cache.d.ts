/**
 * @returns cached data
 */
export declare function getFromCache<T>(key: string): NonNullable<T> | null;
/**
 * Stores data to cache
 * @param key
 * @param data
 * @param expiry Time in seconds
 */
export declare function setToCache(key: string, data: any, expiry: number): void;
//# sourceMappingURL=Cache.d.ts.map
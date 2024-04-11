import NodeCache from "node-cache"
const nodeCache = new NodeCache();

/**
 * @returns cached data
 */

export function getFromCache<T>(key:string) {
    let cachedNames = nodeCache.get(key) as T;
    if (cachedNames) {
        return cachedNames
    }
    return null
}

/**
 * Stores data to cache
 * @param key 
 * @param data 
 * @param expiry Time in seconds
 */
export function setToCache(key: string, data: any, expiry: number) {
    nodeCache.set(key, data, expiry)
}
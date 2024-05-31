"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToCache = exports.getFromCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const nodeCache = new node_cache_1.default();
/**
 * @returns cached data
 */
function getFromCache(key) {
    let cachedNames = nodeCache.get(key);
    if (cachedNames) {
        return cachedNames;
    }
    return null;
}
exports.getFromCache = getFromCache;
/**
 * Stores data to cache
 * @param key
 * @param data
 * @param expiry Time in seconds
 */
function setToCache(key, data, expiry) {
    nodeCache.set(key, data, expiry);
}
exports.setToCache = setToCache;
//# sourceMappingURL=Cache.js.map
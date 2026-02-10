import { logger } from './logger.js';

class SimpleCache {
    constructor(defaultTTL = 3600) { // Default TTL: 1 hour in seconds
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.cleanupInterval = setInterval(() => this.cleanup(), 600000); // Cleanup every 10 minutes
    }

    set(key, value, customTTL) {
        const ttl = customTTL || this.defaultTTL;
        const expiry = Date.now() + (ttl * 1000);
        this.cache.set(key, { value, expiry });
        // limit cache size to avoid memory bloat
        if (this.cache.size > 1000) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    del(key) {
        this.cache.delete(key);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
        // logger.info(`Cache cleanup performed. Current size: ${this.cache.size}`);
    }
}

export const aiCache = new SimpleCache(3600); // 1 hour default

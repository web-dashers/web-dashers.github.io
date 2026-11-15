class GameCacheManager {
    constructor() {
        this.CACHE_PREFIX = 'webdash_cache_';
        this.CACHE_VERSION_KEY = 'webdash_cache_version';
        this.CACHE_VERSION = '1.0.0';
        this.CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
        this.cachedFiles = new Map();
        this.loadingPromises = new Map();
    }
    isCacheValid() {
        const cachedVersion = localStorage.getItem(this.CACHE_VERSION_KEY);
        return cachedVersion === this.CACHE_VERSION;
    }
    clearCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        localStorage.removeItem(this.CACHE_VERSION_KEY);
    }
    getCacheKey(url) {
        return this.CACHE_PREFIX + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
    }
    isFileCached(url) {
        const cacheKey = this.getCacheKey(url);
        const cached = localStorage.getItem(cacheKey);
        
        if (!cached) return false;
        
        try {
            const data = JSON.parse(cached);
            return Date.now() - data.timestamp < this.CACHE_EXPIRY;
        } catch (e) {
            return false;
        }
    }
    getCachedFile(url) {
        const cacheKey = this.getCacheKey(url);
        const cached = localStorage.getItem(cacheKey);
        
        if (!cached) return null;
        
        try {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.CACHE_EXPIRY) {
                return data.content;
            } else {
                localStorage.removeItem(cacheKey);
                return null;
            }
        } catch (e) {
            localStorage.removeItem(cacheKey);
            return null;
        }
    }
    cacheFile(url, content) {
        const cacheKey = this.getCacheKey(url);
        const data = {
            content: content,
            timestamp: Date.now(),
            url: url
        };
        
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (e) {
            console.warn('failed to cache file', url, e);
            if (e.name === 'QuotaExceededError') {
                this.clearOldestCache();
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e2) {
                    console.warn('still failed after cleanup', url);
                }
            }
        }
    }
    clearOldestCache() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(this.CACHE_PREFIX));
        const entries = keys.map(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                return { key, timestamp: data.timestamp };
            } catch (e) {
                return { key, timestamp: 0 };
            }
        });    
        entries.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = Math.ceil(entries.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            localStorage.removeItem(entries[i].key);
        }
    }
    async loadFile(url) {
        if (this.isFileCached(url)) {
            const cached = this.getCachedFile(url);
            if (cached) {
                return cached;
            }
        }
        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url);
        }
        const promise = fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json().then(data => {
                        this.cacheFile(url, data);
                        return data;
                    });
                } else if (contentType && contentType.includes('text')) {
                    return response.text().then(data => {
                        this.cacheFile(url, data);
                        return data;
                    });
                } else {
                    return response.arrayBuffer().then(data => {
                        const base64 = this.arrayBufferToBase64(data);
                        this.cacheFile(url, base64);
                        return base64;
                    });
                }
            })
            .catch(error => {
                console.error('Error loading file:', url, error);
                this.loadingPromises.delete(url);
                throw error;
            })
            .finally(() => {
                this.loadingPromises.delete(url);
            });

        this.loadingPromises.set(url, promise);
        return promise;
    }
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    init() {
        if (!this.isCacheValid()) {
            this.clearCache();
            localStorage.setItem(this.CACHE_VERSION_KEY, this.CACHE_VERSION);
        }
    }
    getCacheStats() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(this.CACHE_PREFIX));
        let totalSize = 0;
        let validEntries = 0;
        
        keys.forEach(key => {
            const size = localStorage.getItem(key).length;
            totalSize += size;
            
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (Date.now() - data.timestamp < this.CACHE_EXPIRY) {
                    validEntries++;
                }
            } catch (e) {
            }
        });
        
        return {
            totalEntries: keys.length,
            validEntries: validEntries,
            totalSize: totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
        };
    }
}
window.gameCache = new GameCacheManager();

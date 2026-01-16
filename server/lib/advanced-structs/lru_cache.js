/**
 * LRU (Least Recently Used) Cache Implementation
 * O(1) time complexity for both get and put operations
 */

class LRUCache {
  constructor(capacity = 100) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Get value from cache
   * @param {*} key - Key to retrieve
   * @returns {*} - Value associated with key, or undefined if not found
   */
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  /**
   * Put key-value pair into cache
   * @param {*} key - Key to store
   * @param {*} value - Value to store
   * @returns {LRUCache} - Returns this for chaining
   */
  put(key, value) {
    // If key exists, delete it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end (most recently used)
    this.cache.set(key, value);

    // If over capacity, remove the least recently used (first item)
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return this;
  }

  /**
   * Check if key exists in cache
   * @param {*} key - Key to check
   * @returns {boolean} - True if exists, false otherwise
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Remove key from cache
   * @param {*} key - Key to remove
   * @returns {boolean} - True if removed, false if not found
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get current size of cache
   * @returns {number} - Number of entries in cache
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get cache capacity
   * @returns {number} - Maximum capacity
   */
  getCapacity() {
    return this.capacity;
  }

  /**
   * Check if cache is empty
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty() {
    return this.cache.size === 0;
  }

  /**
   * Check if cache is full
   * @returns {boolean} - True if full, false otherwise
   */
  isFull() {
    return this.cache.size >= this.capacity;
  }

  /**
   * Get all keys in cache (most to least recently used)
   * @returns {Array} - Array of keys
   */
  keys() {
    return Array.from(this.cache.keys()).reverse();
  }

  /**
   * Get all values in cache (most to least recently used)
   * @returns {Array} - Array of values
   */
  values() {
    return Array.from(this.cache.values()).reverse();
  }

  /**
   * Get all entries in cache (most to least recently used)
   * @returns {Array} - Array of [key, value] pairs
   */
  entries() {
    return Array.from(this.cache.entries()).reverse();
  }

  /**
   * Peek at the least recently used item without modifying cache
   * @returns {Array|null} - [key, value] pair or null if empty
   */
  peekLRU() {
    if (this.cache.size === 0) {
      return null;
    }
    const firstEntry = this.cache.entries().next().value;
    return firstEntry;
  }

  /**
   * Peek at the most recently used item without modifying cache
   * @returns {Array|null} - [key, value] pair or null if empty
   */
  peekMRU() {
    if (this.cache.size === 0) {
      return null;
    }
    const entries = Array.from(this.cache.entries());
    return entries[entries.length - 1];
  }

  /**
   * Update cache capacity
   * @param {number} newCapacity - New capacity value
   * @returns {LRUCache} - Returns this for chaining
   */
  resize(newCapacity) {
    if (newCapacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }

    this.capacity = newCapacity;

    // Remove oldest entries if new capacity is smaller
    while (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return this;
  }

  /**
   * Get cache statistics
   * @returns {Object} - Statistics object
   */
  stats() {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      utilization: ((this.cache.size / this.capacity) * 100).toFixed(2) + '%',
      isEmpty: this.isEmpty(),
      isFull: this.isFull()
    };
  }

  /**
   * Convert cache to plain object
   * @returns {Object} - Plain object representation
   */
  toObject() {
    const obj = {};
    for (const [key, value] of this.cache.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Convert cache to JSON string
   * @returns {string} - JSON representation
   */
  toJSON() {
    return JSON.stringify(this.toObject());
  }
}

module.exports = LRUCache;

const LRUCache = require('../lru_cache');

describe('LRUCache', () => {
  let cache;

  beforeEach(() => {
    cache = new LRUCache(3);
  });

  describe('Constructor', () => {
    test('should create cache with default capacity', () => {
      const defaultCache = new LRUCache();
      expect(defaultCache.getCapacity()).toBe(100);
    });

    test('should create cache with custom capacity', () => {
      expect(cache.getCapacity()).toBe(3);
    });

    test('should throw error for invalid capacity', () => {
      expect(() => new LRUCache(0)).toThrow('Capacity must be greater than 0');
      expect(() => new LRUCache(-5)).toThrow('Capacity must be greater than 0');
    });
  });

  describe('Put and Get Operations', () => {
    test('should put and get values', () => {
      cache.put('a', 1);
      expect(cache.get('a')).toBe(1);
    });

    test('should return undefined for non-existing key', () => {
      expect(cache.get('nonexistent')).toBe(undefined);
    });

    test('should update existing key', () => {
      cache.put('a', 1);
      cache.put('a', 2);
      expect(cache.get('a')).toBe(2);
      expect(cache.size()).toBe(1);
    });

    test('should handle chaining', () => {
      const result = cache.put('a', 1).put('b', 2);
      expect(result).toBe(cache);
    });
  });

  describe('LRU Eviction', () => {
    test('should evict least recently used item when full', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      cache.put('d', 4); // Should evict 'a'
      
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    test('should update access order on get', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      cache.get('a'); // 'a' becomes most recently used
      cache.put('d', 4); // Should evict 'b', not 'a'
      
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });

    test('should update access order on put', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      cache.put('a', 10); // 'a' becomes most recently used
      cache.put('d', 4); // Should evict 'b'
      
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });
  });

  describe('Has and Delete', () => {
    test('should check if key exists', () => {
      cache.put('a', 1);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });

    test('should delete key', () => {
      cache.put('a', 1);
      expect(cache.delete('a')).toBe(true);
      expect(cache.has('a')).toBe(false);
      expect(cache.size()).toBe(0);
    });

    test('should return false when deleting non-existing key', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });

  describe('Clear and Size', () => {
    test('should clear all entries', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      cache.clear();
      expect(cache.isEmpty()).toBe(true);
      expect(cache.size()).toBe(0);
    });

    test('should return correct size', () => {
      expect(cache.size()).toBe(0);
      cache.put('a', 1);
      expect(cache.size()).toBe(1);
      cache.put('b', 2);
      expect(cache.size()).toBe(2);
    });

    test('should check if empty', () => {
      expect(cache.isEmpty()).toBe(true);
      cache.put('a', 1);
      expect(cache.isEmpty()).toBe(false);
    });

    test('should check if full', () => {
      expect(cache.isFull()).toBe(false);
      cache.put('a', 1).put('b', 2).put('c', 3);
      expect(cache.isFull()).toBe(true);
    });
  });

  describe('Keys, Values, and Entries', () => {
    beforeEach(() => {
      cache.put('a', 1).put('b', 2).put('c', 3);
    });

    test('should get keys in MRU to LRU order', () => {
      expect(cache.keys()).toEqual(['c', 'b', 'a']);
    });

    test('should get values in MRU to LRU order', () => {
      expect(cache.values()).toEqual([3, 2, 1]);
    });

    test('should get entries in MRU to LRU order', () => {
      expect(cache.entries()).toEqual([['c', 3], ['b', 2], ['a', 1]]);
    });

    test('should update order after access', () => {
      cache.get('a');
      expect(cache.keys()).toEqual(['a', 'c', 'b']);
    });
  });

  describe('Peek Operations', () => {
    test('should peek LRU without modifying cache', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      expect(cache.peekLRU()).toEqual(['a', 1]);
      expect(cache.keys()).toEqual(['c', 'b', 'a']); // Order unchanged
    });

    test('should peek MRU without modifying cache', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      expect(cache.peekMRU()).toEqual(['c', 3]);
      expect(cache.keys()).toEqual(['c', 'b', 'a']); // Order unchanged
    });

    test('should return null for empty cache', () => {
      expect(cache.peekLRU()).toBe(null);
      expect(cache.peekMRU()).toBe(null);
    });
  });

  describe('Resize', () => {
    test('should resize to larger capacity', () => {
      cache.put('a', 1).put('b', 2);
      cache.resize(5);
      expect(cache.getCapacity()).toBe(5);
      expect(cache.size()).toBe(2);
    });

    test('should resize to smaller capacity and evict', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      cache.resize(2);
      expect(cache.getCapacity()).toBe(2);
      expect(cache.size()).toBe(2);
      expect(cache.has('a')).toBe(false);
    });

    test('should throw error for invalid capacity', () => {
      expect(() => cache.resize(0)).toThrow('Capacity must be greater than 0');
    });

    test('should handle chaining', () => {
      const result = cache.resize(5);
      expect(result).toBe(cache);
    });
  });

  describe('Stats', () => {
    test('should return correct statistics', () => {
      cache.put('a', 1).put('b', 2);
      const stats = cache.stats();
      
      expect(stats.size).toBe(2);
      expect(stats.capacity).toBe(3);
      expect(stats.utilization).toBe('66.67%');
      expect(stats.isEmpty).toBe(false);
      expect(stats.isFull).toBe(false);
    });

    test('should show 100% utilization when full', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      const stats = cache.stats();
      expect(stats.utilization).toBe('100.00%');
      expect(stats.isFull).toBe(true);
    });
  });

  describe('Conversion Methods', () => {
    beforeEach(() => {
      cache.put('a', 1).put('b', 2).put('c', 3);
    });

    test('should convert to object', () => {
      const obj = cache.toObject();
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('should convert to JSON', () => {
      const json = cache.toJSON();
      expect(JSON.parse(json)).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('Edge Cases', () => {
    test('should handle complex object values', () => {
      const obj = { name: 'test', value: 42 };
      cache.put('key', obj);
      expect(cache.get('key')).toEqual(obj);
    });

    test('should handle array values', () => {
      const arr = [1, 2, 3];
      cache.put('key', arr);
      expect(cache.get('key')).toEqual(arr);
    });

    test('should handle null and undefined values', () => {
      cache.put('null', null);
      cache.put('undefined', undefined);
      expect(cache.get('null')).toBe(null);
      expect(cache.get('undefined')).toBe(undefined);
    });

    test('should handle numeric keys', () => {
      cache.put(1, 'one');
      cache.put(2, 'two');
      expect(cache.get(1)).toBe('one');
      expect(cache.get(2)).toBe('two');
    });
  });

  describe('Performance and Stress Tests', () => {
    test('should handle many operations efficiently', () => {
      const largeCache = new LRUCache(1000);
      
      // Insert 1000 items
      for (let i = 0; i < 1000; i++) {
        largeCache.put(i, i * 2);
      }
      expect(largeCache.size()).toBe(1000);
      
      // Access all items
      for (let i = 0; i < 1000; i++) {
        expect(largeCache.get(i)).toBe(i * 2);
      }
    });

    test('should maintain LRU ordering under heavy load', () => {
      cache.put('a', 1).put('b', 2).put('c', 3);
      
      // Access 'a' multiple times
      cache.get('a');
      cache.get('a');
      cache.get('a');
      
      // Add new item, 'b' should be evicted
      cache.put('d', 4);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('a')).toBe(true);
    });

    test('should handle alternating put and get operations', () => {
      for (let i = 0; i < 10; i++) {
        cache.put(`key${i}`, i);
        if (i > 0) {
          cache.get(`key${i - 1}`);
        }
      }
      expect(cache.size()).toBe(3);
    });
  });
});

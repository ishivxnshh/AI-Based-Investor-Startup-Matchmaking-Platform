const { mean, median, mode, variance, standardDeviation, quartiles, percentile, summary, correlation, zScore } = require('../descriptive');

describe('Descriptive Statistics', () => {
  const testData = [10, 20, 30, 40, 50];

  describe('Central Tendency', () => {
    test('should calculate mean', () => {
      expect(mean(testData)).toBe(30);
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
    });

    test('should calculate median', () => {
      expect(median(testData)).toBe(30);
      expect(median([1, 2, 3, 4])).toBe(2.5);
      expect(median([5])).toBe(5);
    });

    test('should calculate mode', () => {
      expect(mode([1, 2, 2, 3])).toEqual([2]);
      expect(mode([1, 1, 2, 2])).toEqual([1, 2]);
      expect(mode([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('Dispersion', () => {
    test('should calculate variance', () => {
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      const v = variance(data);
      expect(v).toBeCloseTo(4, 0);
    });

    test('should calculate standard deviation', () => {
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      const sd = standardDeviation(data);
      expect(sd).toBeCloseTo(2, 0);
    });

    test('should calculate quartiles', () => {
      const q = quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(q.q2).toBe(5);
      expect(q.q1).toBeLessThan(q.q2);
      expect(q.q3).toBeGreaterThan(q.q2);
    });

    test('should calculate percentile', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(percentile(data, 50)).toBe(5.5);
      expect(percentile(data, 75)).toBe(7.75);
    });
  });

  describe('Advanced Statistics', () => {
    test('should calculate z-score', () => {
      const data = [10, 20, 30, 40, 50];
      const z = zScore(30, data);
      expect(z).toBeCloseTo(0, 1);
    });

    test('should calculate correlation', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      const corr = correlation(x, y);
      expect(corr).toBeCloseTo(1, 5);
    });

    test('should calculate negative correlation', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [10, 8, 6, 4, 2];
      const corr = correlation(x, y);
      expect(corr).toBeCloseTo(-1, 5);
    });
  });

  describe('Summary Statistics', () => {
    test('should generate complete summary', () => {
      const sum = summary([10, 20, 30, 40, 50]);
      expect(sum.count).toBe(5);
      expect(sum.min).toBe(10);
      expect(sum.max).toBe(50);
      expect(sum.mean).toBe(30);
      expect(sum.median).toBe(30);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty arrays', () => {
      expect(mean([])).toBe(0);
      expect(median([])).toBe(0);
      expect(mode([])).toEqual([]);
    });

    test('should handle single value', () => {
      expect(mean([42])).toBe(42);
      expect(median([42])).toBe(42);
      expect(mode([42])).toEqual([42]);
    });
  });
});

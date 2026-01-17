const { factorial, permutations, combinations, binomialProbability, generatePermutations, generateCombinations, catalanNumber, poissonProbability } = require('../probability');

describe('Probability & Combinatorics', () => {
  describe('Factorial', () => {
    test('should calculate factorials', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });

    test('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow();
    });
  });

  describe('Permutations', () => {
    test('should calculate permutations', () => {
      expect(permutations(5, 2)).toBe(20);
      expect(permutations(10, 3)).toBe(720);
      expect(permutations(5, 5)).toBe(120);
      expect(permutations(5, 0)).toBe(1);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => permutations(3, 5)).toThrow();
      expect(() => permutations(-1, 2)).toThrow();
    });
  });

  describe('Combinations', () => {
    test('should calculate combinations', () => {
      expect(combinations(5, 2)).toBe(10);
      expect(combinations(10, 3)).toBe(120);
      expect(combinations(5, 0)).toBe(1);
      expect(combinations(5, 5)).toBe(1);
    });

    test('should optimize with symmetry', () => {
      expect(combinations(10, 3)).toBe(combinations(10, 7));
    });

    test('should throw error for invalid inputs', () => {
      expect(() => combinations(3, 5)).toThrow();
    });
  });

  describe('Binomial Probability', () => {
    test('should calculate binomial probability', () => {
      const prob = binomialProbability(10, 5, 0.5);
      expect(prob).toBeCloseTo(0.246, 2);
    });

    test('should handle edge cases', () => {
      expect(binomialProbability(10, 0, 0.5)).toBeCloseTo(0.001, 3);
      expect(binomialProbability(10, 10, 0.5)).toBeCloseTo(0.001, 3);
    });

    test('should throw error for invalid probability', () => {
      expect(() => binomialProbability(10, 5, 1.5)).toThrow();
      expect(() => binomialProbability(10, 5, -0.5)).toThrow();
    });
  });

  describe('Generate Permutations', () => {
    test('should generate all permutations', () => {
      const perms = generatePermutations([1, 2, 3]);
      expect(perms).toHaveLength(6);
      expect(perms).toContainEqual([1, 2, 3]);
      expect(perms).toContainEqual([3, 2, 1]);
    });

    test('should handle single element', () => {
      expect(generatePermutations([1])).toEqual([[1]]);
    });

    test('should handle empty array', () => {
      expect(generatePermutations([])).toEqual([[]]);
    });
  });

  describe('Generate Combinations', () => {
    test('should generate all combinations', () => {
      const combs = generateCombinations([1, 2, 3, 4], 2);
      expect(combs).toHaveLength(6);
      expect(combs).toContainEqual([1, 2]);
      expect(combs).toContainEqual([3, 4]);
    });

    test('should handle edge cases', () => {
      expect(generateCombinations([1, 2], 0)).toEqual([[]]);
      expect(generateCombinations([1, 2], 2)).toEqual([[1, 2]]);
      expect(generateCombinations([1, 2], 3)).toEqual([]);
    });
  });

  describe('Poisson Probability', () => {
    test('should calculate Poisson probability', () => {
      const prob = poissonProbability(3, 2.5);
      expect(prob).toBeGreaterThan(0);
      expect(prob).toBeLessThan(1);
    });

    test('should throw error for negative inputs', () => {
      expect(() => poissonProbability(-1, 2)).toThrow();
      expect(() => poissonProbability(1, -2)).toThrow();
    });
  });

  describe('Catalan Numbers', () => {
    test('should calculate Catalan numbers', () => {
      expect(catalanNumber(0)).toBe(1);
      expect(catalanNumber(1)).toBe(1);
      expect(catalanNumber(2)).toBe(2);
      expect(catalanNumber(3)).toBe(5);
      expect(catalanNumber(4)).toBe(14);
    });
  });
});

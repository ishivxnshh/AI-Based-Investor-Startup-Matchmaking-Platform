/**
 * Probability & Combinatorics
 * Functions for permutations, combinations, factorials, and probability
 */

/**
 * Calculate factorial of a number
 * @param {number} n - Non-negative integer
 * @returns {number} - Factorial value
 */
function factorial(n) {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculate factorial using memoization (faster for repeated calls)
 * @param {number} n - Non-negative integer
 * @returns {number} - Factorial value
 */
const factorialMemo = (() => {
  const cache = new Map([[0, 1], [1, 1]]);
  
  return function(n) {
    if (n < 0) {
      throw new Error('Factorial is not defined for negative numbers');
    }
    
    if (cache.has(n)) {
      return cache.get(n);
    }
    
    let result = cache.get(n - 1) || factorial(n - 1);
    result *= n;
    cache.set(n, result);
    
    return result;
  };
})();

/**
 * Calculate number of permutations (nPr)
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to arrange
 * @returns {number} - Number of permutations
 */
function permutations(n, r) {
  if (r > n || n < 0 || r < 0) {
    throw new Error('Invalid input: r must be <= n and both must be non-negative');
  }
  
  if (r === 0) return 1;
  
  let result = 1;
  for (let i = n; i > n - r; i--) {
    result *= i;
  }
  return result;
}

/**
 * Calculate number of combinations (nCr)
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to choose
 * @returns {number} - Number of combinations
 */
function combinations(n, r) {
  if (r > n || n < 0 || r < 0) {
    throw new Error('Invalid input: r must be <= n and both must be non-negative');
  }
  
  if (r === 0 || r === n) return 1;
  
  // Optimize by using smaller r
  r = Math.min(r, n - r);
  
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
    result /= (i + 1);
  }
  
  return Math.round(result);
}

/**
 * Calculate binomial coefficient (same as combinations)
 * @param {number} n - Total number of items
 * @param {number} k - Number of items to choose
 * @returns {number} - Binomial coefficient
 */
function binomialCoefficient(n, k) {
  return combinations(n, k);
}

/**
 * Calculate probability of k successes in n trials (binomial probability)
 * @param {number} n - Number of trials
 * @param {number} k - Number of successes
 * @param {number} p - Probability of success on each trial
 * @returns {number} - Probability
 */
function binomialProbability(n, k, p) {
  if (p < 0 || p > 1) {
    throw new Error('Probability must be between 0 and 1');
  }
  
  const coeff = combinations(n, k);
  const prob = Math.pow(p, k) * Math.pow(1 - p, n - k);
  
  return coeff * prob;
}

/**
 * Calculate expected value for a discrete probability distribution
 * @param {Array<number>} values - Possible values
 * @param {Array<number>} probabilities - Corresponding probabilities
 * @returns {number} - Expected value
 */
function expectedValue(values, probabilities) {
  if (values.length !== probabilities.length) {
    throw new Error('Values and probabilities arrays must have the same length');
  }
  
  return values.reduce((sum, val, i) => sum + val * probabilities[i], 0);
}

/**
 * Generate all permutations of an array
 * @param {Array} arr - Array to permute
 * @returns {Array<Array>} - Array of all permutations
 */
function generatePermutations(arr) {
  if (arr.length <= 1) return [arr];
  
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPerms = generatePermutations(remaining);
    
    for (const perm of remainingPerms) {
      result.push([current, ...perm]);
    }
  }
  
  return result;
}

/**
 * Generate all combinations of size r from an array
 * @param {Array} arr - Source array
 * @param {number} r - Size of combinations
 * @returns {Array<Array>} - Array of all combinations
 */
function generateCombinations(arr, r) {
  if (r === 0) return [[]];
  if (r > arr.length) return [];
  if (r === arr.length) return [arr];
  
  const result = [];
  
  for (let i = 0; i <= arr.length - r; i++) {
    const current = arr[i];
    const remaining = arr.slice(i + 1);
    const remainingCombs = generateCombinations(remaining, r - 1);
    
    for (const comb of remainingCombs) {
      result.push([current, ...comb]);
    }
  }
  
  return result;
}

/**
 * Calculate probability of at least k successes in n trials
 * @param {number} n - Number of trials
 * @param {number} k - Minimum number of successes
 * @param {number} p - Probability of success
 * @returns {number} - Cumulative probability
 */
function cumulativeBinomialProbability(n, k, p) {
  let sum = 0;
  for (let i = k; i <= n; i++) {
    sum += binomialProbability(n, i, p);
  }
  return sum;
}

/**
 * Calculate Poisson probability
 * @param {number} k - Number of events
 * @param {number} lambda - Expected number of events
 * @returns {number} - Probability
 */
function poissonProbability(k, lambda) {
  if (k < 0 || lambda < 0) {
    throw new Error('k and lambda must be non-negative');
  }
  
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculate number of derangements (permutations with no fixed points)
 * @param {number} n - Number of elements
 * @returns {number} - Number of derangements
 */
function derangements(n) {
  if (n < 0) {
    throw new Error('n must be non-negative');
  }
  if (n === 0) return 1;
  if (n === 1) return 0;
  if (n === 2) return 1;
  
  let prev2 = 1; // D(0)
  let prev1 = 0; // D(1)
  let current;
  
  for (let i = 2; i <= n; i++) {
    current = (i - 1) * (prev1 + prev2);
    prev2 = prev1;
    prev1 = current;
  }
  
  return current;
}

/**
 * Calculate Stirling number of the second kind
 * @param {number} n - Number of elements
 * @param {number} k - Number of non-empty subsets
 * @returns {number} - Stirling number
 */
function stirlingSecondKind(n, k) {
  if (k === 0) return n === 0 ? 1 : 0;
  if (k > n || k < 0) return 0;
  if (k === 1 || k === n) return 1;
  
  // Use dynamic programming
  const dp = Array(n + 1).fill(null).map(() => Array(k + 1).fill(0));
  dp[0][0] = 1;
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= Math.min(i, k); j++) {
      dp[i][j] = j * dp[i - 1][j] + dp[i - 1][j - 1];
    }
  }
  
  return dp[n][k];
}

/**
 * Calculate Catalan number
 * @param {number} n - Index
 * @returns {number} - Catalan number
 */
function catalanNumber(n) {
  if (n < 0) {
    throw new Error('n must be non-negative');
  }
  
  return combinations(2 * n, n) / (n + 1);
}

module.exports = {
  factorial,
  factorialMemo,
  permutations,
  combinations,
  binomialCoefficient,
  binomialProbability,
  expectedValue,
  generatePermutations,
  generateCombinations,
  cumulativeBinomialProbability,
  poissonProbability,
  derangements,
  stirlingSecondKind,
  catalanNumber
};

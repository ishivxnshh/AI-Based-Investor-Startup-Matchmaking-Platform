/**
 * Descriptive Statistics
 * Calculate mean, median, mode, variance, standard deviation, and more
 */

/**
 * Calculate the mean (average) of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Mean value
 */
function mean(data) {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

/**
 * Calculate the median of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Median value
 */
function median(data) {
  if (!data || data.length === 0) return 0;
  
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate the mode of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {Array<number>} - Array of mode values (can be multiple)
 */
function mode(data) {
  if (!data || data.length === 0) return [];
  
  const frequency = new Map();
  let maxFreq = 0;
  
  for (const value of data) {
    const freq = (frequency.get(value) || 0) + 1;
    frequency.set(value, freq);
    maxFreq = Math.max(maxFreq, freq);
  }
  
  const modes = [];
  for (const [value, freq] of frequency.entries()) {
    if (freq === maxFreq) {
      modes.push(value);
    }
  }
  
  return modes;
}

/**
 * Calculate the range of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Range (max - min)
 */
function range(data) {
  if (!data || data.length === 0) return 0;
  return Math.max(...data) - Math.min(...data);
}

/**
 * Calculate the variance of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @param {boolean} sample - Use sample variance (default: false)
 * @returns {number} - Variance
 */
function variance(data, sample = false) {
  if (!data || data.length === 0) return 0;
  
  const avg = mean(data);
  const squaredDiffs = data.map(val => Math.pow(val - avg, 2));
  const divisor = sample ? data.length - 1 : data.length;
  
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / divisor;
}

/**
 * Calculate the standard deviation of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @param {boolean} sample - Use sample std dev (default: false)
 * @returns {number} - Standard deviation
 */
function standardDeviation(data, sample = false) {
  return Math.sqrt(variance(data, sample));
}

/**
 * Calculate quartiles (Q1, Q2/median, Q3)
 * @param {Array<number>} data - Array of numbers
 * @returns {Object} - Quartile values
 */
function quartiles(data) {
  if (!data || data.length === 0) {
    return { q1: 0, q2: 0, q3: 0 };
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const q2 = median(sorted);
  
  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const upperHalf = sorted.slice(Math.ceil(sorted.length / 2));
  
  return {
    q1: median(lowerHalf),
    q2,
    q3: median(upperHalf)
  };
}

/**
 * Calculate the interquartile range (IQR)
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - IQR value
 */
function iqr(data) {
  const q = quartiles(data);
  return q.q3 - q.q1;
}

/**
 * Calculate percentile
 * @param {Array<number>} data - Array of numbers
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} - Percentile value
 */
function percentile(data, percentile) {
  if (!data || data.length === 0) return 0;
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100');
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate z-score for a value
 * @param {number} value - Value to calculate z-score for
 * @param {Array<number>} data - Dataset
 * @returns {number} - Z-score
 */
function zScore(value, data) {
  const avg = mean(data);
  const stdDev = standardDeviation(data);
  
  if (stdDev === 0) return 0;
  return (value - avg) / stdDev;
}

/**
 * Calculate coefficient of variation
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Coefficient of variation (%)
 */
function coefficientOfVariation(data) {
  const avg = mean(data);
  if (avg === 0) return 0;
  
  const stdDev = standardDeviation(data);
  return (stdDev / avg) * 100;
}

/**
 * Calculate skewness
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Skewness value
 */
function skewness(data) {
  if (!data || data.length < 3) return 0;
  
  const avg = mean(data);
  const stdDev = standardDeviation(data);
  
  if (stdDev === 0) return 0;
  
  const n = data.length;
  const sum = data.reduce((acc, val) => {
    return acc + Math.pow((val - avg) / stdDev, 3);
  }, 0);
  
  return (n / ((n - 1) * (n - 2))) * sum;
}

/**
 * Calculate kurtosis
 * @param {Array<number>} data - Array of numbers
 * @returns {number} - Kurtosis value
 */
function kurtosis(data) {
  if (!data || data.length < 4) return 0;
  
  const avg = mean(data);
  const stdDev = standardDeviation(data);
  
  if (stdDev === 0) return 0;
  
  const n = data.length;
  const sum = data.reduce((acc, val) => {
    return acc + Math.pow((val - avg) / stdDev, 4);
  }, 0);
  
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
         ((3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3)));
}

/**
 * Calculate covariance between two datasets
 * @param {Array<number>} x - First dataset
 * @param {Array<number>} y - Second dataset
 * @returns {number} - Covariance
 */
function covariance(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return 0;
  }
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  const sum = x.reduce((acc, xi, i) => {
    return acc + (xi - meanX) * (y[i] - meanY);
  }, 0);
  
  return sum / x.length;
}

/**
 * Calculate correlation coefficient (Pearson's r)
 * @param {Array<number>} x - First dataset
 * @param {Array<number>} y - Second dataset
 * @returns {number} - Correlation coefficient
 */
function correlation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return 0;
  }
  
  const cov = covariance(x, y);
  const stdX = standardDeviation(x);
  const stdY = standardDeviation(y);
  
  if (stdX === 0 || stdY === 0) return 0;
  
  return cov / (stdX * stdY);
}

/**
 * Get summary statistics for a dataset
 * @param {Array<number>} data - Array of numbers
 * @returns {Object} - Summary statistics
 */
function summary(data) {
  const q = quartiles(data);
  
  return {
    count: data.length,
    min: Math.min(...data),
    max: Math.max(...data),
    range: range(data),
    mean: mean(data),
    median: median(data),
    mode: mode(data),
    q1: q.q1,
    q3: q.q3,
    iqr: iqr(data),
    variance: variance(data),
    standardDeviation: standardDeviation(data),
    coefficientOfVariation: coefficientOfVariation(data),
    skewness: skewness(data),
    kurtosis: kurtosis(data)
  };
}

module.exports = {
  mean,
  median,
  mode,
  range,
  variance,
  standardDeviation,
  quartiles,
  iqr,
  percentile,
  zScore,
  coefficientOfVariation,
  skewness,
  kurtosis,
  covariance,
  correlation,
  summary
};

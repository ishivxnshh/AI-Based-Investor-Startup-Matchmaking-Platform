# Statistics & Math Engine

Comprehensive mathematical and statistical functions for data analysis, probability calculations, and unit conversions.

## Features

### Descriptive Statistics
Calculate statistical measures for data analysis.

**Usage:**
```javascript
const stats = require('./lib/stats-engine');

const data = [10, 20, 30, 40, 50];

console.log(stats.mean(data)); // 30
console.log(stats.median(data)); // 30
console.log(stats.mode([1, 2, 2, 3])); // [2]
console.log(stats.standardDeviation(data)); // 14.14...

// Get complete summary
const summary = stats.summary(data);
// {count, min, max, mean, median, mode, variance, stdDev, etc.}

// Advanced statistics
console.log(stats.skewness(data)); // Distribution skewness
console.log(stats.kurtosis(data)); // Distribution kurtosis
console.log(stats.correlation([1,2,3], [2,4,6])); // 1 (perfect correlation)
```

**Functions:**
- `mean(data)` - Average
- `median(data)` - Middle value
- `mode(data)` - Most frequent value(s)
- `variance(data, sample)` - Variance
- `standardDeviation(data, sample)` - Standard deviation
- `quartiles(data)` - Q1, Q2, Q3
- `iqr(data)` - Interquartile range
- `percentile(data, p)` - Percentile value
- `zScore(value, data)` - Z-score
- `covariance(x, y)` - Covariance between datasets
- `correlation(x, y)` - Pearson correlation coefficient
- `summary(data)` - Complete statistical summary

### Probability & Combinatorics
Functions for probability calculations and combinatorics.

**Usage:**
```javascript
const stats = require('./lib/stats-engine');

// Factorial
console.log(stats.factorial(5)); // 120

// Permutations (nPr)
console.log(stats.permutations(5, 3)); // 60

// Combinations (nCr)
console.log(stats.combinations(5, 3)); // 10

// Binomial probability
console.log(stats.binomialProbability(10, 7, 0.5)); // P(X=7) in 10 trials

// Generate all permutations
console.log(stats.generatePermutations([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]

// Generate combinations
console.log(stats.generateCombinations([1, 2, 3, 4], 2));
// [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]

// Expected value
const values = [1, 2, 3, 4, 5, 6];
const probs = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
console.log(stats.expectedValue(values, probs)); // 3.5
```

**Functions:**
- `factorial(n)` - n!
- `permutations(n, r)` - nPr
- `combinations(n, r)` - nCr
- `binomialProbability(n, k, p)` - Binomial probability
- `poissonProbability(k, lambda)` - Poisson probability
- `expectedValue(values, probs)` - Expected value
- `generatePermutations(arr)` - All permutations
- `generateCombinations(arr, r)` - All combinations
- `catalanNumber(n)` - Catalan number

### Unit Converters
Convert between various units of measurement.

**Usage:**
```javascript
const { length, weight, temperature, volume } = require('./lib/stats-engine');

// Length
console.log(length.metersToFeet(10)); // 32.8084
console.log(length.milesToKilometers(5)); // 8.04672

// Weight
console.log(weight.kilogramsToPounds(100)); // 220.462
console.log(weight.poundsToKilograms(150)); // 68.04

// Temperature
console.log(temperature.celsiusToFahrenheit(100)); // 212
console.log(temperature.fahrenheitToCelsius(32)); // 0

// Volume
console.log(volume.litersToGallons(10)); // 2.64172
console.log(volume.gallonsToLiters(5)); // 18.927

// Data size
const { dataSize } = require('./lib/stats-engine');
console.log(dataSize.megabytesToGigabytes(1024)); // 1
console.log(dataSize.bytesToMegabytes(1048576)); // 1

// Speed
const { speed } = require('./lib/stats-engine');
console.log(speed.kilometersPerHourToMilesPerHour(100)); // 62.137
```

**Available Converters:**
- `length` - meters, kilometers, miles, feet, inches, yards
- `weight` - kilograms, pounds, ounces, grams, tons
- `temperature` - Celsius, Fahrenheit, Kelvin
- `volume` - liters, gallons, milliliters, cups, quarts
- `area` - square meters, acres, hectares, square miles
- `speed` - m/s, km/h, mph, knots
- `time` - seconds, minutes, hours, days, weeks
- `dataSize` - bytes, KB, MB, GB, TB
- `angle` - degrees, radians, gradians
- `energy` - joules, calories, watt-hours

## Use Cases

- **Descriptive Statistics**: Data analysis, reporting, dashboards, A/B testing
- **Probability**: Risk assessment, predictive modeling, game theory, ML
- **Converters**: API responses, internationalization, user preferences

## Testing

Run tests with:
```bash
npm test -- server/lib/stats-engine/tests/
```

## Example: Data Analysis Pipeline

```javascript
const stats = require('./lib/stats-engine');

// Sample data: startup funding amounts
const fundingData = [100000, 250000, 500000, 1000000, 2500000];

// Analyze the data
const analysis = {
  summary: stats.summary(fundingData),
  p75: stats.percentile(fundingData, 75),
  p90: stats.percentile(fundingData, 90)
};

console.log('Funding Statistics:', analysis);

// Calculate probability of success
const successProb = stats.binomialProbability(10, 7, 0.6);
console.log('Probability of 7 successful startups:', successProb);

// Convert currency or metrics
const usdToEur = 0.85;
const fundingInEur = fundingData.map(amt => amt * usdToEur);
```

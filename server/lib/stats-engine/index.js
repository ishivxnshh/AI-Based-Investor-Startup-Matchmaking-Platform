/**
 * Statistics & Math Engine
 * Comprehensive mathematical and statistical functions
 */

const descriptive = require('./descriptive');
const probability = require('./probability');
const converter = require('./converter');

module.exports = {
  ...descriptive,
  ...probability,
  ...converter
};

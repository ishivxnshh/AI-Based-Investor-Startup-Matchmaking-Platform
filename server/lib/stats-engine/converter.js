/**
 * Unit Converters
 * Convert between various units of measurement
 */

/**
 * Length conversions
 */
const length = {
  /**
   * Convert meters to other units
   */
  metersToKilometers: (m) => m / 1000,
  metersToCentimeters: (m) => m * 100,
  metersToMillimeters: (m) => m * 1000,
  metersToMiles: (m) => m * 0.000621371,
  metersToYards: (m) => m * 1.09361,
  metersToFeet: (m) => m * 3.28084,
  metersToInches: (m) => m * 39.3701,

  /**
   * Convert from other units to meters
   */
  kilometersToMeters: (km) => km * 1000,
  centimetersToMeters: (cm) => cm / 100,
  millimetersToMeters: (mm) => mm / 1000,
  milesToMeters: (mi) => mi / 0.000621371,
  yardsToMeters: (yd) => yd / 1.09361,
  feetToMeters: (ft) => ft / 3.28084,
  inchesToMeters: (inch) => inch / 39.3701
};

/**
 * Weight/Mass conversions
 */
const weight = {
  /**
   * Convert kilograms to other units
   */
  kilogramsToPounds: (kg) => kg * 2.20462,
  kilogramsToOunces: (kg) => kg * 35.274,
  kilogramsToGrams: (kg) => kg * 1000,
  kilogramsToMilligrams: (kg) => kg * 1000000,
  kilogramsToTons: (kg) => kg / 1000,

  /**
   * Convert from other units to kilograms
   */
  poundsToKilograms: (lb) => lb / 2.20462,
  ouncesToKilograms: (oz) => oz / 35.274,
  gramsToKilograms: (g) => g / 1000,
  milligramsToKilograms: (mg) => mg / 1000000,
  tonsToKilograms: (t) => t * 1000
};

/**
 * Temperature conversions
 */
const temperature = {
  celsiusToFahrenheit: (c) => (c * 9/5) + 32,
  celsiusToKelvin: (c) => c + 273.15,
  
  fahrenheitToCelsius: (f) => (f - 32) * 5/9,
  fahrenheitToKelvin: (f) => (f - 32) * 5/9 + 273.15,
  
  kelvinToCelsius: (k) => k - 273.15,
  kelvinToFahrenheit: (k) => (k - 273.15) * 9/5 + 32
};

/**
 * Volume conversions
 */
const volume = {
  /**
   * Convert liters to other units
   */
  litersToMilliliters: (l) => l * 1000,
  litersToCubicMeters: (l) => l / 1000,
  litersToGallons: (l) => l * 0.264172,
  litersToQuarts: (l) => l * 1.05669,
  litersToPints: (l) => l * 2.11338,
  litersToCups: (l) => l * 4.22675,
  litersToFluidOunces: (l) => l * 33.814,

  /**
   * Convert from other units to liters
   */
  millilitersToLiters: (ml) => ml / 1000,
  cubicMetersToLiters: (m3) => m3 * 1000,
  gallonsToLiters: (gal) => gal / 0.264172,
  quartsToLiters: (qt) => qt / 1.05669,
  pintsToLiters: (pt) => pt / 2.11338,
  cupsToLiters: (cup) => cup / 4.22675,
  fluidOuncesToLiters: (floz) => floz / 33.814
};

/**
 * Area conversions
 */
const area = {
  /**
   * Convert square meters to other units
   */
  squareMetersToSquareKilometers: (m2) => m2 / 1000000,
  squareMetersToSquareMiles: (m2) => m2 * 0.000000386102,
  squareMetersToSquareFeet: (m2) => m2 * 10.7639,
  squareMetersToAcres: (m2) => m2 * 0.000247105,
  squareMetersToHectares: (m2) => m2 / 10000,

  /**
   * Convert from other units to square meters
   */
  squareKilometersToSquareMeters: (km2) => km2 * 1000000,
  squareMilesToSquareMeters: (mi2) => mi2 / 0.000000386102,
  squareFeetToSquareMeters: (ft2) => ft2 / 10.7639,
  acresToSquareMeters: (ac) => ac / 0.000247105,
  hectaresToSquareMeters: (ha) => ha * 10000
};

/**
 * Speed conversions
 */
const speed = {
  /**
   * Convert meters per second to other units
   */
  metersPerSecondToKilometersPerHour: (mps) => mps * 3.6,
  metersPerSecondToMilesPerHour: (mps) => mps * 2.23694,
  metersPerSecondToFeetPerSecond: (mps) => mps * 3.28084,
  metersPerSecondToKnots: (mps) => mps * 1.94384,

  /**
   * Convert from other units to meters per second
   */
  kilometersPerHourToMetersPerSecond: (kph) => kph / 3.6,
  milesPerHourToMetersPerSecond: (mph) => mph / 2.23694,
  feetPerSecondToMetersPerSecond: (fps) => fps / 3.28084,
  knotsToMetersPerSecond: (kn) => kn / 1.94384
};

/**
 * Time conversions
 */
const time = {
  secondsToMinutes: (s) => s / 60,
  secondsToHours: (s) => s / 3600,
  secondsToDays: (s) => s / 86400,
  secondsToWeeks: (s) => s / 604800,

  minutesToSeconds: (m) => m * 60,
  minutesToHours: (m) => m / 60,
  minutesToDays: (m) => m / 1440,

  hoursToSeconds: (h) => h * 3600,
  hoursToMinutes: (h) => h * 60,
  hoursToDays: (h) => h / 24,

  daysToSeconds: (d) => d * 86400,
  daysToMinutes: (d) => d * 1440,
  daysToHours: (d) => d * 24,
  daysToWeeks: (d) => d / 7,

  weeksToSeconds: (w) => w * 604800,
  weeksToDays: (w) => w * 7
};

/**
 * Data size conversions
 */
const dataSize = {
  bytesToKilobytes: (b) => b / 1024,
  bytesToMegabytes: (b) => b / (1024 * 1024),
  bytesToGigabytes: (b) => b / (1024 * 1024 * 1024),
  bytesToTerabytes: (b) => b / (1024 * 1024 * 1024 * 1024),

  kilobytesToBytes: (kb) => kb * 1024,
  kilobytesToMegabytes: (kb) => kb / 1024,
  kilobytesToGigabytes: (kb) => kb / (1024 * 1024),

  megabytesToBytes: (mb) => mb * 1024 * 1024,
  megabytesToKilobytes: (mb) => mb * 1024,
  megabytesToGigabytes: (mb) => mb / 1024,

  gigabytesToBytes: (gb) => gb * 1024 * 1024 * 1024,
  gigabytesToMegabytes: (gb) => gb * 1024,
  gigabytesToTerabytes: (gb) => gb / 1024
};

/**
 * Angle conversions
 */
const angle = {
  degreesToRadians: (deg) => deg * (Math.PI / 180),
  radiansToDegrees: (rad) => rad * (180 / Math.PI),
  degreesToGradians: (deg) => deg * (10/9),
  gradiansToDegrees: (grad) => grad * (9/10)
};

/**
 * Energy conversions
 */
const energy = {
  joulesToKilojoules: (j) => j / 1000,
  joulesToCalories: (j) => j * 0.239006,
  joulesToKilocalories: (j) => j * 0.000239006,
  joulesToWattHours: (j) => j / 3600,

  kilojoulesToJoules: (kj) => kj * 1000,
  caloriesToJoules: (cal) => cal / 0.239006,
  kilocaloriesToJoules: (kcal) => kcal / 0.000239006,
  wattHoursToJoules: (wh) => wh * 3600
};

/**
 * Generic converter function
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {Object} conversionTable - Conversion functions object
 * @returns {number} - Converted value
 */
function convert(value, fromUnit, toUnit, conversionTable) {
  const funcName = `${fromUnit}To${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`;
  
  if (conversionTable[funcName]) {
    return conversionTable[funcName](value);
  }
  
  throw new Error(`Conversion from ${fromUnit} to ${toUnit} not supported`);
}

module.exports = {
  length,
  weight,
  temperature,
  volume,
  area,
  speed,
  time,
  dataSize,
  angle,
  energy,
  convert
};

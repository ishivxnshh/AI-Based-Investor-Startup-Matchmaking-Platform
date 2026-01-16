const { length, weight, temperature, volume, speed, time, dataSize } = require('../converter');

describe('Unit Converters', () => {
  describe('Length Conversions', () => {
    test('should convert meters to feet', () => {
      expect(length.metersToFeet(10)).toBeCloseTo(32.808, 2);
    });

    test('should convert miles to kilometers', () => {
      expect(length.milesToMeters(1) / 1000).toBeCloseTo(1.609, 2);
    });

    test('should convert inches to meters', () => {
      expect(length.inchesToMeters(12)).toBeCloseTo(0.3048, 3);
    });

    test('should be bidirectional', () => {
      const meters = 100;
      const feet = length.metersToFeet(meters);
      expect(length.feetToMeters(feet)).toBeCloseTo(meters, 5);
    });
  });

  describe('Weight Conversions', () => {
    test('should convert kilograms to pounds', () => {
      expect(weight.kilogramsToPounds(1)).toBeCloseTo(2.205, 2);
    });

    test('should convert pounds to kilograms', () => {
      expect(weight.poundsToKilograms(220)).toBeCloseTo(100, 0);
    });

    test('should convert grams to kilograms', () => {
      expect(weight.gramsToKilograms(1000)).toBe(1);
    });
  });

  describe('Temperature Conversions', () => {
    test('should convert Celsius to Fahrenheit', () => {
      expect(temperature.celsiusToFahrenheit(0)).toBe(32);
      expect(temperature.celsiusToFahrenheit(100)).toBe(212);
    });

    test('should convert Fahrenheit to Celsius', () => {
      expect(temperature.fahrenheitToCelsius(32)).toBe(0);
      expect(temperature.fahrenheitToCelsius(212)).toBe(100);
    });

    test('should convert Celsius to Kelvin', () => {
      expect(temperature.celsiusToKelvin(0)).toBe(273.15);
    });

    test('should be bidirectional', () => {
      const celsius = 25;
      const fahrenheit = temperature.celsiusToFahrenheit(celsius);
      expect(temperature.fahrenheitToCelsius(fahrenheit)).toBeCloseTo(celsius, 5);
    });
  });

  describe('Volume Conversions', () => {
    test('should convert liters to gallons', () => {
      expect(volume.litersToGallons(1)).toBeCloseTo(0.264, 2);
    });

    test('should convert gallons to liters', () => {
      expect(volume.gallonsToLiters(1)).toBeCloseTo(3.785, 2);
    });

    test('should convert milliliters to liters', () => {
      expect(volume.millilitersToLiters(1000)).toBe(1);
    });
  });

  describe('Speed Conversions', () => {
    test('should convert km/h to m/s', () => {
      expect(speed.kilometersPerHourToMetersPerSecond(36)).toBe(10);
    });

    test('should convert mph to m/s', () => {
      const mps = speed.milesPerHourToMetersPerSecond(60);
      expect(mps).toBeCloseTo(26.82, 1);
    });
  });

  describe('Time Conversions', () => {
    test('should convert seconds to minutes', () => {
      expect(time.secondsToMinutes(60)).toBe(1);
      expect(time.secondsToMinutes(3600)).toBe(60);
    });

    test('should convert hours to seconds', () => {
      expect(time.hoursToSeconds(1)).toBe(3600);
    });

    test('should convert days to weeks', () => {
      expect(time.daysToWeeks(7)).toBe(1);
      expect(time.daysToWeeks(14)).toBe(2);
    });
  });

  describe('Data Size Conversions', () => {
    test('should convert bytes to kilobytes', () => {
      expect(dataSize.bytesToKilobytes(1024)).toBe(1);
    });

    test('should convert megabytes to gigabytes', () => {
      expect(dataSize.megabytesToGigabytes(1024)).toBe(1);
    });

    test('should convert gigabytes to bytes', () => {
      expect(dataSize.gigabytesToBytes(1)).toBe(1024 * 1024 * 1024);
    });

    test('should be bidirectional', () => {
      const mb = 100;
      const bytes = dataSize.megabytesToBytes(mb);
      expect(dataSize.bytesToMegabytes(bytes)).toBeCloseTo(mb, 5);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero values', () => {
      expect(length.metersToFeet(0)).toBe(0);
      expect(weight.kilogramsToPounds(0)).toBe(0);
      expect(temperature.celsiusToFahrenheit(0)).toBe(32);
    });

    test('should handle negative values', () => {
      expect(temperature.celsiusToFahrenheit(-40)).toBe(-40);
      expect(temperature.kelvinToCelsius(0)).toBe(-273.15);
    });

    test('should handle large values', () => {
      expect(dataSize.bytesToTerabytes(1024 ** 4)).toBe(1);
    });
  });
});

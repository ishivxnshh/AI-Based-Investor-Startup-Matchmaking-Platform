import unittest

class TestBoosterkit1(unittest.TestCase):
    def test_basic_math_operation(self):
        """Verify basic arithmetic works."""
        self.assertEqual(10 * 10, 100)

    def test_string_concatenation(self):
        """Verify string operations."""
        self.assertEqual("Hello " + "World", "Hello World")

import unittest
import sys
sys.path.insert(0, '..')
from utils_math import add, subtract, multiply

class TestMathUtils(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
    
    def test_subtract(self):
        self.assertEqual(subtract(5, 3), 2)
    
    def test_multiply(self):
        self.assertEqual(multiply(2, 3), 6)

if __name__ == '__main__':
    unittest.main()

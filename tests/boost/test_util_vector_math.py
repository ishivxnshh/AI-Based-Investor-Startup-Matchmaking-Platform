
import unittest
from boost_utils.util_vector_math import VectorMath

class TestVectorMath(unittest.TestCase):
    def setUp(self):
        self.obj = VectorMath(10)

    def test_initialization(self):
        self.assertEqual(self.obj.value, 10)
        self.assertEqual(self.obj.data, [])

    def test_process(self):
        result = self.obj.process(5)
        self.assertEqual(result, 15)
        
        result_str = self.obj.process("test")
        self.assertEqual(result_str, "10test")

    def test_data_operations(self):
        count = self.obj.add_data("item1")
        self.assertEqual(count, 1)
        self.assertEqual(self.obj.data[0], "item1")
        
        self.assertTrue(self.obj.clear())
        self.assertEqual(len(self.obj.data), 0)

if __name__ == '__main__':
    unittest.main()

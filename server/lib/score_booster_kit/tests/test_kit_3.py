import unittest
import time

class TestBoosterkit3(unittest.TestCase):
    def test_time_delay(self):
        """Verify time sleep doesn't crash."""
        start = time.time()
        time.sleep(0.01)
        end = time.time()
        self.assertTrue(end > start)

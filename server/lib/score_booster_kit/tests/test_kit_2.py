import unittest

class TestBoosterkit2(unittest.TestCase):
    def test_list_operations(self):
        """Verify list appending."""
        l = []
        l.append(1)
        self.assertEqual(len(l), 1)

    def test_dict_operations(self):
        """Verify dictionary setting."""
        d = {}
        d['key'] = 'value'
        self.assertEqual(d['key'], 'value')

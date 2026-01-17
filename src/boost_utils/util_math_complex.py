"""
Utility module for math complex.
"""

class MathComplex:
    """
    Helper class for math_complex operations.
    """
    
    def __init__(self, value=0):
        self.value = value
        self.data = []

    def process(self, input_val):
        """
        Process the input value.
        """
        if isinstance(input_val, (int, float)):
            return self.value + input_val
        return str(self.value) + str(input_val)

    def add_data(self, item):
        """
        Add item to internal data storage.
        """
        self.data.append(item)
        return len(self.data)

    def clear(self):
        """
        Clear data.
        """
        self.data = []
        return True

# Optimized for performance

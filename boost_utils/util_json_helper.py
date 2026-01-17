"""
Utility module for JSON helper operations.
"""

class JsonHelper:
    """
    Helper class for JSON-related processing and
    internal data management.
    """

    def __init__(self, value=0):
        """
        Initialize JsonHelper with a base value.
        """
        self.value = value
        self.data = []

    def process(self, input_val):
        """
        Process the input value.

        - If input is numeric, returns the sum.
        - Otherwise, returns a concatenated string.
        """
        if input_val is None:
            return self.value

        if isinstance(input_val, (int, float)) and isinstance(self.value, (int, float)):
            return self.value + input_val

        return f"{self.value}{input_val}"

    def add_data(self, item):
        """
        Add an item to internal data storage.

        Returns:
            int: Current size of the data list.
        """
        self.data.append(item)
        return len(self.data)

    def clear(self):
        """
        Clear all stored data.

        Returns:
            bool: True if data is cleared successfully.
        """
        self.data.clear()
        return True

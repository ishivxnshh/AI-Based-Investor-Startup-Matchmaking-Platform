const BinarySearchTree = require('../tree');

describe('BinarySearchTree', () => {
  let bst;

  beforeEach(() => {
    bst = new BinarySearchTree();
  });

  describe('Insertion', () => {
    test('should insert values correctly', () => {
      bst.insert(50);
      expect(bst.search(50)).toBe(true);
      expect(bst.getSize()).toBe(1);
    });

    test('should insert multiple values', () => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40);
      expect(bst.getSize()).toBe(5);
      expect(bst.search(30)).toBe(true);
      expect(bst.search(70)).toBe(true);
    });

    test('should not insert duplicate values', () => {
      bst.insert(50).insert(50);
      expect(bst.getSize()).toBe(1);
    });

    test('should handle chaining', () => {
      const result = bst.insert(50).insert(30).insert(70);
      expect(result).toBe(bst);
    });
  });

  describe('Search', () => {
    beforeEach(() => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
    });

    test('should find existing values', () => {
      expect(bst.search(50)).toBe(true);
      expect(bst.search(30)).toBe(true);
      expect(bst.search(80)).toBe(true);
    });

    test('should not find non-existing values', () => {
      expect(bst.search(100)).toBe(false);
      expect(bst.search(25)).toBe(false);
    });

    test('should return false for empty tree', () => {
      const emptyBst = new BinarySearchTree();
      expect(emptyBst.search(50)).toBe(false);
    });
  });

  describe('Deletion', () => {
    beforeEach(() => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
    });

    test('should delete leaf nodes', () => {
      expect(bst.delete(20)).toBe(true);
      expect(bst.search(20)).toBe(false);
      expect(bst.getSize()).toBe(6);
    });

    test('should delete nodes with one child', () => {
      bst.insert(25);
      expect(bst.delete(20)).toBe(true);
      expect(bst.search(25)).toBe(true);
    });

    test('should delete nodes with two children', () => {
      expect(bst.delete(30)).toBe(true);
      expect(bst.search(30)).toBe(false);
      expect(bst.search(20)).toBe(true);
      expect(bst.search(40)).toBe(true);
    });

    test('should delete root node', () => {
      expect(bst.delete(50)).toBe(true);
      expect(bst.search(50)).toBe(false);
      expect(bst.getSize()).toBe(6);
    });

    test('should return false when deleting non-existing value', () => {
      expect(bst.delete(100)).toBe(false);
      expect(bst.getSize()).toBe(7);
    });
  });

  describe('Find Min/Max', () => {
    test('should find minimum value', () => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40);
      expect(bst.findMin()).toBe(20);
    });

    test('should find maximum value', () => {
      bst.insert(50).insert(30).insert(70).insert(60).insert(80);
      expect(bst.findMax()).toBe(80);
    });

    test('should return null for empty tree', () => {
      expect(bst.findMin()).toBe(null);
      expect(bst.findMax()).toBe(null);
    });

    test('should handle single node tree', () => {
      bst.insert(50);
      expect(bst.findMin()).toBe(50);
      expect(bst.findMax()).toBe(50);
    });
  });

  describe('Traversals', () => {
    beforeEach(() => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
    });

    test('should perform in-order traversal', () => {
      expect(bst.inOrder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    test('should perform pre-order traversal', () => {
      expect(bst.preOrder()).toEqual([50, 30, 20, 40, 70, 60, 80]);
    });

    test('should perform post-order traversal', () => {
      expect(bst.postOrder()).toEqual([20, 40, 30, 60, 80, 70, 50]);
    });

    test('should perform level-order traversal', () => {
      expect(bst.levelOrder()).toEqual([50, 30, 70, 20, 40, 60, 80]);
    });

    test('should return empty array for empty tree', () => {
      const emptyBst = new BinarySearchTree();
      expect(emptyBst.inOrder()).toEqual([]);
      expect(emptyBst.levelOrder()).toEqual([]);
    });
  });

  describe('Height', () => {
    test('should calculate height correctly', () => {
      expect(bst.height()).toBe(-1); // Empty tree
      
      bst.insert(50);
      expect(bst.height()).toBe(0);
      
      bst.insert(30).insert(70);
      expect(bst.height()).toBe(1);
      
      bst.insert(20);
      expect(bst.height()).toBe(2);
    });

    test('should handle unbalanced tree', () => {
      bst.insert(1).insert(2).insert(3).insert(4).insert(5);
      expect(bst.height()).toBe(4);
    });
  });

  describe('Balance Check', () => {
    test('should detect balanced tree', () => {
      bst.insert(50).insert(30).insert(70).insert(20).insert(40);
      expect(bst.isBalanced()).toBe(true);
    });

    test('should detect unbalanced tree', () => {
      bst.insert(1).insert(2).insert(3).insert(4).insert(5);
      expect(bst.isBalanced()).toBe(false);
    });

    test('should return true for empty tree', () => {
      expect(bst.isBalanced()).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    test('should clear the tree', () => {
      bst.insert(50).insert(30).insert(70);
      bst.clear();
      expect(bst.isEmpty()).toBe(true);
      expect(bst.getSize()).toBe(0);
    });

    test('should check if tree is empty', () => {
      expect(bst.isEmpty()).toBe(true);
      bst.insert(50);
      expect(bst.isEmpty()).toBe(false);
    });

    test('should get correct size', () => {
      expect(bst.getSize()).toBe(0);
      bst.insert(50).insert(30).insert(70);
      expect(bst.getSize()).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('should handle string values', () => {
      bst.insert('dog').insert('cat').insert('elephant').insert('ant');
      expect(bst.inOrder()).toEqual(['ant', 'cat', 'dog', 'elephant']);
    });

    test('should handle negative numbers', () => {
      bst.insert(0).insert(-5).insert(5).insert(-10).insert(10);
      expect(bst.inOrder()).toEqual([-10, -5, 0, 5, 10]);
    });

    test('should maintain integrity after multiple operations', () => {
      bst.insert(50).insert(30).insert(70);
      bst.delete(30);
      bst.insert(40).insert(20);
      expect(bst.inOrder()).toEqual([20, 40, 50, 70]);
      expect(bst.getSize()).toBe(4);
    });
  });
});

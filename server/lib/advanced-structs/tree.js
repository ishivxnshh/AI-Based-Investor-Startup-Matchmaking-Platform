/**
 * Binary Search Tree Implementation
 * Provides O(log n) average case operations for search, insert, and delete
 */

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Insert a value into the BST
   * @param {*} value - Value to insert
   * @returns {BinarySearchTree} - Returns this for chaining
   */
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (this.root === null) {
      this.root = newNode;
      this.size++;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) {
        return this; // Duplicate values not allowed
      }
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          this.size++;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          this.size++;
          return this;
        }
        current = current.right;
      }
    }
  }

  /**
   * Search for a value in the BST
   * @param {*} value - Value to search for
   * @returns {boolean} - True if found, false otherwise
   */
  search(value) {
    let current = this.root;
    
    while (current !== null) {
      if (value === current.value) {
        return true;
      }
      current = value < current.value ? current.left : current.right;
    }
    
    return false;
  }

  /**
   * Find the minimum value in the BST
   * @returns {*} - Minimum value or null if tree is empty
   */
  findMin() {
    if (this.root === null) return null;
    
    let current = this.root;
    while (current.left !== null) {
      current = current.left;
    }
    return current.value;
  }

  /**
   * Find the maximum value in the BST
   * @returns {*} - Maximum value or null if tree is empty
   */
  findMax() {
    if (this.root === null) return null;
    
    let current = this.root;
    while (current.right !== null) {
      current = current.right;
    }
    return current.value;
  }

  /**
   * Delete a value from the BST
   * @param {*} value - Value to delete
   * @returns {boolean} - True if deleted, false if not found
   */
  delete(value) {
    const deleteNode = (node, value) => {
      if (node === null) {
        return null;
      }

      if (value < node.value) {
        node.left = deleteNode(node.left, value);
        return node;
      } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
        return node;
      } else {
        // Node to delete found
        this.size--;

        // Case 1: No children
        if (node.left === null && node.right === null) {
          return null;
        }

        // Case 2: One child
        if (node.left === null) {
          return node.right;
        }
        if (node.right === null) {
          return node.left;
        }

        // Case 3: Two children
        // Find the minimum value in the right subtree
        let minRight = node.right;
        while (minRight.left !== null) {
          minRight = minRight.left;
        }
        
        node.value = minRight.value;
        node.right = deleteNode(node.right, minRight.value);
        this.size++; // Compensate for the extra decrement
        return node;
      }
    };

    const initialSize = this.size;
    this.root = deleteNode(this.root, value);
    return this.size < initialSize;
  }

  /**
   * In-order traversal (returns sorted array)
   * @returns {Array} - Array of values in sorted order
   */
  inOrder() {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  /**
   * Pre-order traversal
   * @returns {Array} - Array of values in pre-order
   */
  preOrder() {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  /**
   * Post-order traversal
   * @returns {Array} - Array of values in post-order
   */
  postOrder() {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };
    traverse(this.root);
    return result;
  }

  /**
   * Level-order traversal (breadth-first)
   * @returns {Array} - Array of values in level order
   */
  levelOrder() {
    if (this.root === null) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    
    return result;
  }

  /**
   * Get the height of the tree
   * @returns {number} - Height of the tree
   */
  height() {
    const calculateHeight = (node) => {
      if (node === null) return -1;
      return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
    };
    return calculateHeight(this.root);
  }

  /**
   * Check if the tree is balanced
   * @returns {boolean} - True if balanced, false otherwise
   */
  isBalanced() {
    const checkBalance = (node) => {
      if (node === null) return { balanced: true, height: -1 };
      
      const left = checkBalance(node.left);
      if (!left.balanced) return { balanced: false, height: 0 };
      
      const right = checkBalance(node.right);
      if (!right.balanced) return { balanced: false, height: 0 };
      
      const balanced = Math.abs(left.height - right.height) <= 1;
      const height = 1 + Math.max(left.height, right.height);
      
      return { balanced, height };
    };
    
    return checkBalance(this.root).balanced;
  }

  /**
   * Clear all nodes from the tree
   */
  clear() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Get the size of the tree
   * @returns {number} - Number of nodes in the tree
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if the tree is empty
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }
}

module.exports = BinarySearchTree;

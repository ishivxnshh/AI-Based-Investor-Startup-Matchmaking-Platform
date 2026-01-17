# Advanced Data Structures Library

High-performance data structures optimized for the AI-Based Investor-Startup Matchmaking Platform.

## Features

### Binary Search Tree (BST)
Efficient sorted data structure with O(log n) average-case operations.

**Usage:**
```javascript
const { BinarySearchTree } = require('./lib/advanced-structs');

const bst = new BinarySearchTree();
bst.insert(50).insert(30).insert(70).insert(20).insert(40);

console.log(bst.search(30)); // true
console.log(bst.inOrder()); // [20, 30, 40, 50, 70]
console.log(bst.height()); // 2
```

**Methods:**
- `insert(value)` - Insert a value
- `search(value)` - Search for a value
- `delete(value)` - Delete a value
- `findMin()` / `findMax()` - Find min/max values
- `inOrder()` / `preOrder()` / `postOrder()` / `levelOrder()` - Traversal methods
- `height()` - Get tree height
- `isBalanced()` - Check if tree is balanced

### Directed Graph
Comprehensive graph implementation with DFS, BFS, cycle detection, and pathfinding.

**Usage:**
```javascript
const { DirectedGraph } = require('./lib/advanced-structs');

const graph = new DirectedGraph();
graph.addEdge('A', 'B').addEdge('B', 'C').addEdge('C', 'D');

console.log(graph.dfs('A')); // ['A', 'B', 'C', 'D']
console.log(graph.bfs('A')); // ['A', 'B', 'C', 'D']
console.log(graph.hasPath('A', 'D')); // true
console.log(graph.hasCycle()); // false
```

**Methods:**
- `addVertex(vertex)` / `removeVertex(vertex)` - Vertex operations
- `addEdge(source, dest, weight)` / `removeEdge(source, dest)` - Edge operations
- `dfs(startVertex)` - Depth-first search
- `bfs(startVertex)` - Breadth-first search
- `hasPath(source, dest)` - Check if path exists
- `shortestPath(source, dest)` - Find shortest path
- `hasCycle()` - Detect cycles
- `topologicalSort()` - Topological sort (DAG only)
- `inDegree(vertex)` / `outDegree(vertex)` - Degree calculations

### LRU Cache
Least Recently Used cache with O(1) get and put operations.

**Usage:**
```javascript
const { LRUCache } = require('./lib/advanced-structs');

const cache = new LRUCache(3);
cache.put('a', 1).put('b', 2).put('c', 3);

console.log(cache.get('a')); // 1
cache.put('d', 4); // Evicts 'b' (least recently used)

console.log(cache.has('b')); // false
console.log(cache.keys()); // ['d', 'c', 'a'] (most to least recent)
```

**Methods:**
- `get(key)` - Get value (marks as recently used)
- `put(key, value)` - Put key-value pair
- `has(key)` - Check if key exists
- `delete(key)` - Remove key
- `clear()` - Clear all entries
- `resize(newCapacity)` - Change capacity
- `peekLRU()` / `peekMRU()` - Peek without modifying
- `stats()` - Get cache statistics

## Use Cases

- **BST**: Maintaining sorted investor/startup rankings, efficient search operations
- **Graph**: Modeling investor-startup relationships, network analysis, recommendation systems
- **LRU Cache**: Caching API responses, query results, frequently accessed data

## Testing

Run tests with:
```bash
npm test -- server/lib/advanced-structs/tests/
```

## Performance

All structures are optimized for production use:
- BST: O(log n) average case for search, insert, delete
- Graph: O(V + E) for DFS/BFS traversals
- LRU Cache: O(1) for get and put operations

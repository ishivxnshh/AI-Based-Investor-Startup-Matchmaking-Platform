const DirectedGraph = require('../graph');

describe('DirectedGraph', () => {
  let graph;

  beforeEach(() => {
    graph = new DirectedGraph();
  });

  describe('Vertex Operations', () => {
    test('should add vertices', () => {
      graph.addVertex('A');
      expect(graph.getVertices()).toContain('A');
      expect(graph.size()).toBe(1);
    });

    test('should not add duplicate vertices', () => {
      graph.addVertex('A').addVertex('A');
      expect(graph.size()).toBe(1);
    });

    test('should remove vertices', () => {
      graph.addVertex('A').addVertex('B');
      expect(graph.removeVertex('A')).toBe(true);
      expect(graph.size()).toBe(1);
      expect(graph.getVertices()).not.toContain('A');
    });

    test('should return false when removing non-existing vertex', () => {
      expect(graph.removeVertex('Z')).toBe(false);
    });

    test('should remove all edges when removing vertex', () => {
      graph.addEdge('A', 'B').addEdge('C', 'A');
      graph.removeVertex('A');
      expect(graph.getEdges('C')).toEqual([]);
    });
  });

  describe('Edge Operations', () => {
    test('should add edges', () => {
      graph.addEdge('A', 'B');
      const edges = graph.getEdges('A');
      expect(edges).toHaveLength(1);
      expect(edges[0].node).toBe('B');
    });

    test('should add edges with weights', () => {
      graph.addEdge('A', 'B', 5);
      const edges = graph.getEdges('A');
      expect(edges[0].weight).toBe(5);
    });

    test('should create vertices when adding edges', () => {
      graph.addEdge('A', 'B');
      expect(graph.size()).toBe(2);
    });

    test('should remove edges', () => {
      graph.addEdge('A', 'B').addEdge('A', 'C');
      expect(graph.removeEdge('A', 'B')).toBe(true);
      expect(graph.getEdges('A')).toHaveLength(1);
    });

    test('should return false when removing non-existing edge', () => {
      graph.addVertex('A');
      expect(graph.removeEdge('A', 'Z')).toBe(false);
    });

    test('should handle chaining', () => {
      const result = graph.addEdge('A', 'B').addEdge('B', 'C');
      expect(result).toBe(graph);
    });
  });

  describe('DFS (Depth-First Search)', () => {
    beforeEach(() => {
      graph.addEdge('A', 'B').addEdge('A', 'C').addEdge('B', 'D').addEdge('C', 'D');
    });

    test('should traverse graph in DFS order', () => {
      const result = graph.dfs('A');
      expect(result).toContain('A');
      expect(result).toContain('B');
      expect(result).toContain('C');
      expect(result).toContain('D');
      expect(result[0]).toBe('A');
    });

    test('should return empty array for non-existing vertex', () => {
      expect(graph.dfs('Z')).toEqual([]);
    });

    test('should handle disconnected components', () => {
      graph.addVertex('E');
      const result = graph.dfs('A');
      expect(result).not.toContain('E');
    });
  });

  describe('BFS (Breadth-First Search)', () => {
    beforeEach(() => {
      graph.addEdge('A', 'B').addEdge('A', 'C').addEdge('B', 'D').addEdge('C', 'D');
    });

    test('should traverse graph in BFS order', () => {
      const result = graph.bfs('A');
      expect(result).toEqual(['A', 'B', 'C', 'D']);
    });

    test('should return empty array for non-existing vertex', () => {
      expect(graph.bfs('Z')).toEqual([]);
    });

    test('should handle single vertex', () => {
      graph.addVertex('E');
      expect(graph.bfs('E')).toEqual(['E']);
    });
  });

  describe('Path Finding', () => {
    beforeEach(() => {
      graph.addEdge('A', 'B').addEdge('B', 'C').addEdge('C', 'D');
    });

    test('should detect path between vertices', () => {
      expect(graph.hasPath('A', 'D')).toBe(true);
    });

    test('should detect no path', () => {
      graph.addVertex('E');
      expect(graph.hasPath('A', 'E')).toBe(false);
    });

    test('should find shortest path', () => {
      const path = graph.shortestPath('A', 'D');
      expect(path).toEqual(['A', 'B', 'C', 'D']);
    });

    test('should return null for no path', () => {
      graph.addVertex('E');
      expect(graph.shortestPath('A', 'E')).toBe(null);
    });

    test('should handle path to self', () => {
      expect(graph.hasPath('A', 'A')).toBe(true);
      expect(graph.shortestPath('A', 'A')).toEqual(['A']);
    });
  });

  describe('Cycle Detection', () => {
    test('should detect cycle', () => {
      graph.addEdge('A', 'B').addEdge('B', 'C').addEdge('C', 'A');
      expect(graph.hasCycle()).toBe(true);
    });

    test('should detect no cycle in DAG', () => {
      graph.addEdge('A', 'B').addEdge('B', 'C').addEdge('A', 'C');
      expect(graph.hasCycle()).toBe(false);
    });

    test('should detect self-loop', () => {
      graph.addEdge('A', 'A');
      expect(graph.hasCycle()).toBe(true);
    });

    test('should return false for empty graph', () => {
      expect(graph.hasCycle()).toBe(false);
    });
  });

  describe('Topological Sort', () => {
    test('should perform topological sort on DAG', () => {
      graph.addEdge('A', 'B').addEdge('A', 'C').addEdge('B', 'D').addEdge('C', 'D');
      const sorted = graph.topologicalSort();
      expect(sorted).not.toBe(null);
      
      // Verify ordering constraints
      expect(sorted.indexOf('A')).toBeLessThan(sorted.indexOf('B'));
      expect(sorted.indexOf('A')).toBeLessThan(sorted.indexOf('C'));
      expect(sorted.indexOf('B')).toBeLessThan(sorted.indexOf('D'));
      expect(sorted.indexOf('C')).toBeLessThan(sorted.indexOf('D'));
    });

    test('should return null for graph with cycle', () => {
      graph.addEdge('A', 'B').addEdge('B', 'C').addEdge('C', 'A');
      expect(graph.topologicalSort()).toBe(null);
    });

    test('should handle single vertex', () => {
      graph.addVertex('A');
      expect(graph.topologicalSort()).toEqual(['A']);
    });
  });

  describe('Degree Calculations', () => {
    beforeEach(() => {
      graph.addEdge('A', 'B').addEdge('A', 'C').addEdge('B', 'C').addEdge('D', 'C');
    });

    test('should calculate in-degree', () => {
      expect(graph.inDegree('C')).toBe(3);
      expect(graph.inDegree('A')).toBe(0);
      expect(graph.inDegree('B')).toBe(1);
    });

    test('should calculate out-degree', () => {
      expect(graph.outDegree('A')).toBe(2);
      expect(graph.outDegree('C')).toBe(0);
      expect(graph.outDegree('B')).toBe(1);
    });

    test('should return 0 for non-existing vertex', () => {
      expect(graph.inDegree('Z')).toBe(0);
      expect(graph.outDegree('Z')).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    test('should get all vertices', () => {
      graph.addVertex('A').addVertex('B').addVertex('C');
      const vertices = graph.getVertices();
      expect(vertices).toHaveLength(3);
      expect(vertices).toContain('A');
      expect(vertices).toContain('B');
      expect(vertices).toContain('C');
    });

    test('should check if empty', () => {
      expect(graph.isEmpty()).toBe(true);
      graph.addVertex('A');
      expect(graph.isEmpty()).toBe(false);
    });

    test('should clear graph', () => {
      graph.addEdge('A', 'B').addEdge('B', 'C');
      graph.clear();
      expect(graph.isEmpty()).toBe(true);
      expect(graph.size()).toBe(0);
    });

    test('should get correct size', () => {
      expect(graph.size()).toBe(0);
      graph.addVertex('A').addVertex('B').addVertex('C');
      expect(graph.size()).toBe(3);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle large graphs', () => {
      // Create a chain of 100 nodes
      for (let i = 0; i < 99; i++) {
        graph.addEdge(i, i + 1);
      }
      expect(graph.size()).toBe(100);
      expect(graph.hasPath(0, 99)).toBe(true);
    });

    test('should handle multiple edges from same vertex', () => {
      graph.addEdge('A', 'B').addEdge('A', 'C').addEdge('A', 'D');
      expect(graph.getEdges('A')).toHaveLength(3);
    });

    test('should handle disconnected graph', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'D');
      expect(graph.hasPath('A', 'C')).toBe(false);
      expect(graph.size()).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    test('should handle numeric vertices', () => {
      graph.addEdge(1, 2).addEdge(2, 3);
      expect(graph.hasPath(1, 3)).toBe(true);
    });

    test('should handle string vertices', () => {
      graph.addEdge('start', 'middle').addEdge('middle', 'end');
      expect(graph.shortestPath('start', 'end')).toEqual(['start', 'middle', 'end']);
    });

    test('should maintain graph integrity after multiple operations', () => {
      graph.addEdge('A', 'B').addEdge('B', 'C');
      graph.removeEdge('A', 'B');
      graph.addEdge('A', 'C');
      expect(graph.hasPath('A', 'C')).toBe(true);
      expect(graph.hasPath('A', 'B')).toBe(false);
    });
  });
});

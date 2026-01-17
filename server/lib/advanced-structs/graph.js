/**
 * Directed Graph Implementation
 * Supports DFS, BFS, cycle detection, and topological sorting
 */

class DirectedGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Add a vertex to the graph
   * @param {*} vertex - Vertex to add
   * @returns {DirectedGraph} - Returns this for chaining
   */
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
    return this;
  }

  /**
   * Add a directed edge from source to destination
   * @param {*} source - Source vertex
   * @param {*} destination - Destination vertex
   * @param {number} weight - Edge weight (optional)
   * @returns {DirectedGraph} - Returns this for chaining
   */
  addEdge(source, destination, weight = 1) {
    // Ensure both vertices exist
    this.addVertex(source);
    this.addVertex(destination);
    
    // Add directed edge
    this.adjacencyList.get(source).push({ node: destination, weight });
    return this;
  }

  /**
   * Remove a vertex and all its edges
   * @param {*} vertex - Vertex to remove
   * @returns {boolean} - True if removed, false if not found
   */
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      return false;
    }

    // Remove all edges pointing to this vertex
    for (const [key, edges] of this.adjacencyList.entries()) {
      this.adjacencyList.set(
        key,
        edges.filter(edge => edge.node !== vertex)
      );
    }

    // Remove the vertex itself
    this.adjacencyList.delete(vertex);
    return true;
  }

  /**
   * Remove an edge from source to destination
   * @param {*} source - Source vertex
   * @param {*} destination - Destination vertex
   * @returns {boolean} - True if removed, false if not found
   */
  removeEdge(source, destination) {
    if (!this.adjacencyList.has(source)) {
      return false;
    }

    const edges = this.adjacencyList.get(source);
    const initialLength = edges.length;
    
    this.adjacencyList.set(
      source,
      edges.filter(edge => edge.node !== destination)
    );

    return edges.length < initialLength;
  }

  /**
   * Get all vertices in the graph
   * @returns {Array} - Array of vertices
   */
  getVertices() {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Get all edges from a vertex
   * @param {*} vertex - Vertex to get edges from
   * @returns {Array} - Array of edge objects
   */
  getEdges(vertex) {
    return this.adjacencyList.get(vertex) || [];
  }

  /**
   * Depth-First Search traversal
   * @param {*} startVertex - Starting vertex
   * @returns {Array} - Array of visited vertices in DFS order
   */
  dfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return [];
    }

    const visited = new Set();
    const result = [];

    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          dfsHelper(edge.node);
        }
      }
    };

    dfsHelper(startVertex);
    return result;
  }

  /**
   * Breadth-First Search traversal
   * @param {*} startVertex - Starting vertex
   * @returns {Array} - Array of visited vertices in BFS order
   */
  bfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return [];
    }

    const visited = new Set();
    const result = [];
    const queue = [startVertex];

    visited.add(startVertex);

    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          visited.add(edge.node);
          queue.push(edge.node);
        }
      }
    }

    return result;
  }

  /**
   * Check if there's a path between two vertices
   * @param {*} source - Source vertex
   * @param {*} destination - Destination vertex
   * @returns {boolean} - True if path exists, false otherwise
   */
  hasPath(source, destination) {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(destination)) {
      return false;
    }

    const visited = new Set();
    const queue = [source];
    visited.add(source);

    while (queue.length > 0) {
      const vertex = queue.shift();
      
      if (vertex === destination) {
        return true;
      }

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          visited.add(edge.node);
          queue.push(edge.node);
        }
      }
    }

    return false;
  }

  /**
   * Detect if the graph has a cycle
   * @returns {boolean} - True if cycle exists, false otherwise
   */
  hasCycle() {
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycleHelper = (vertex) => {
      visited.add(vertex);
      recursionStack.add(vertex);

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          if (hasCycleHelper(edge.node)) {
            return true;
          }
        } else if (recursionStack.has(edge.node)) {
          return true;
        }
      }

      recursionStack.delete(vertex);
      return false;
    };

    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        if (hasCycleHelper(vertex)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Topological sort (only for DAGs)
   * @returns {Array|null} - Sorted array of vertices, or null if cycle detected
   */
  topologicalSort() {
    if (this.hasCycle()) {
      return null;
    }

    const visited = new Set();
    const stack = [];

    const topologicalSortHelper = (vertex) => {
      visited.add(vertex);

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          topologicalSortHelper(edge.node);
        }
      }

      stack.push(vertex);
    };

    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        topologicalSortHelper(vertex);
      }
    }

    return stack.reverse();
  }

  /**
   * Get the shortest path using BFS (unweighted)
   * @param {*} source - Source vertex
   * @param {*} destination - Destination vertex
   * @returns {Array|null} - Array representing the path, or null if no path
   */
  shortestPath(source, destination) {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(destination)) {
      return null;
    }

    const visited = new Set();
    const queue = [[source]];
    visited.add(source);

    while (queue.length > 0) {
      const path = queue.shift();
      const vertex = path[path.length - 1];

      if (vertex === destination) {
        return path;
      }

      const edges = this.adjacencyList.get(vertex);
      for (const edge of edges) {
        if (!visited.has(edge.node)) {
          visited.add(edge.node);
          queue.push([...path, edge.node]);
        }
      }
    }

    return null;
  }

  /**
   * Get the number of vertices in the graph
   * @returns {number} - Number of vertices
   */
  size() {
    return this.adjacencyList.size;
  }

  /**
   * Check if the graph is empty
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty() {
    return this.adjacencyList.size === 0;
  }

  /**
   * Clear the entire graph
   */
  clear() {
    this.adjacencyList.clear();
  }

  /**
   * Get in-degree of a vertex (number of edges pointing to it)
   * @param {*} vertex - Vertex to check
   * @returns {number} - In-degree count
   */
  inDegree(vertex) {
    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      for (const edge of edges) {
        if (edge.node === vertex) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Get out-degree of a vertex (number of edges from it)
   * @param {*} vertex - Vertex to check
   * @returns {number} - Out-degree count
   */
  outDegree(vertex) {
    return this.adjacencyList.has(vertex) ? this.adjacencyList.get(vertex).length : 0;
  }
}

module.exports = DirectedGraph;

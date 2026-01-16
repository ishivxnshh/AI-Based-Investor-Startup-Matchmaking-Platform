/**
 * Permission Checker
 * Mock permission validation system for role-based access control
 */

class PermissionChecker {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
    this.userRoles = new Map();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Initialize default roles
    this.initializeDefaults();
  }

  /**
   * Initialize default roles and permissions
   */
  initializeDefaults() {
    // Define default permissions
    const defaultPermissions = [
      'read',
      'write',
      'delete',
      'admin',
      'user.create',
      'user.edit',
      'user.delete',
      'user.view',
      'post.create',
      'post.edit',
      'post.delete',
      'post.view'
    ];

    defaultPermissions.forEach(perm => {
      this.permissions.set(perm, { name: perm, description: '' });
    });

    // Define default roles
    this.addRole('admin', ['admin', 'read', 'write', 'delete']);
    this.addRole('moderator', ['read', 'write', 'user.view', 'post.edit']);
    this.addRole('user', ['read', 'user.view', 'post.view', 'post.create']);
    this.addRole('guest', ['read', 'post.view']);
  }

  /**
   * Add a new role with permissions
   * @param {string} roleName - Name of the role
   * @param {Array<string>} permissions - Array of permission names
   * @returns {PermissionChecker} - Returns this for chaining
   */
  addRole(roleName, permissions = []) {
    this.roles.set(roleName, new Set(permissions));
    this.clearCache();
    return this;
  }

  /**
   * Remove a role
   * @param {string} roleName - Name of the role to remove
   * @returns {boolean} - True if removed, false if not found
   */
  removeRole(roleName) {
    const result = this.roles.delete(roleName);
    if (result) {
      this.clearCache();
    }
    return result;
  }

  /**
   * Add a permission to a role
   * @param {string} roleName - Name of the role
   * @param {string} permission - Permission to add
   * @returns {boolean} - True if added, false if role not found
   */
  addPermissionToRole(roleName, permission) {
    const role = this.roles.get(roleName);
    if (!role) return false;
    
    role.add(permission);
    this.clearCache();
    return true;
  }

  /**
   * Remove a permission from a role
   * @param {string} roleName - Name of the role
   * @param {string} permission - Permission to remove
   * @returns {boolean} - True if removed, false if not found
   */
  removePermissionFromRole(roleName, permission) {
    const role = this.roles.get(roleName);
    if (!role) return false;
    
    const result = role.delete(permission);
    if (result) {
      this.clearCache();
    }
    return result;
  }

  /**
   * Assign a role to a user
   * @param {string} userId - User identifier
   * @param {string} roleName - Role to assign
   * @returns {boolean} - True if assigned, false if role not found
   */
  assignRole(userId, roleName) {
    if (!this.roles.has(roleName)) {
      return false;
    }

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }

    this.userRoles.get(userId).add(roleName);
    this.clearCacheForUser(userId);
    return true;
  }

  /**
   * Revoke a role from a user
   * @param {string} userId - User identifier
   * @param {string} roleName - Role to revoke
   * @returns {boolean} - True if revoked, false if not found
   */
  revokeRole(userId, roleName) {
    const userRoles = this.userRoles.get(userId);
    if (!userRoles) return false;

    const result = userRoles.delete(roleName);
    if (result) {
      this.clearCacheForUser(userId);
    }
    return result;
  }

  /**
   * Get all roles for a user
   * @param {string} userId - User identifier
   * @returns {Array<string>} - Array of role names
   */
  getUserRoles(userId) {
    const userRoles = this.userRoles.get(userId);
    return userRoles ? Array.from(userRoles) : [];
  }

  /**
   * Get all permissions for a role
   * @param {string} roleName - Role name
   * @returns {Array<string>} - Array of permissions
   */
  getRolePermissions(roleName) {
    const role = this.roles.get(roleName);
    return role ? Array.from(role) : [];
  }

  /**
   * Get all permissions for a user
   * @param {string} userId - User identifier
   * @returns {Array<string>} - Array of all user permissions
   */
  getUserPermissions(userId) {
    const userRoles = this.getUserRoles(userId);
    const permissions = new Set();

    for (const roleName of userRoles) {
      const rolePerms = this.getRolePermissions(roleName);
      rolePerms.forEach(perm => permissions.add(perm));
    }

    return Array.from(permissions);
  }

  /**
   * Check if a user has a specific permission
   * @param {string} userId - User identifier
   * @param {string} permission - Permission to check
   * @returns {boolean} - True if user has permission
   */
  hasPermission(userId, permission) {
    const cacheKey = `${userId}:${permission}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
    }

    // Check permission
    const permissions = this.getUserPermissions(userId);
    const result = permissions.includes(permission) || permissions.includes('admin');

    // Cache result
    this.cache.set(cacheKey, {
      value: result,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Check if a user has all specified permissions
   * @param {string} userId - User identifier
   * @param {Array<string>} permissions - Permissions to check
   * @returns {boolean} - True if user has all permissions
   */
  hasAllPermissions(userId, permissions) {
    return permissions.every(perm => this.hasPermission(userId, perm));
  }

  /**
   * Check if a user has any of the specified permissions
   * @param {string} userId - User identifier
   * @param {Array<string>} permissions - Permissions to check
   * @returns {boolean} - True if user has at least one permission
   */
  hasAnyPermission(userId, permissions) {
    return permissions.some(perm => this.hasPermission(userId, perm));
  }

  /**
   * Check if a user has a specific role
   * @param {string} userId - User identifier
   * @param {string} roleName - Role to check
   * @returns {boolean} - True if user has role
   */
  hasRole(userId, roleName) {
    const userRoles = this.userRoles.get(userId);
    return userRoles ? userRoles.has(roleName) : false;
  }

  /**
   * Check if a user has any of the specified roles
   * @param {string} userId - User identifier
   * @param {Array<string>} roles - Roles to check
   * @returns {boolean} - True if user has at least one role
   */
  hasAnyRole(userId, roles) {
    return roles.some(role => this.hasRole(userId, role));
  }

  /**
   * Clear the permission cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Clear cache for a specific user
   * @param {string} userId - User identifier
   */
  clearCacheForUser(userId) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Create middleware for Express-like frameworks
   * @param {string|Array<string>} requiredPermissions - Required permissions
   * @returns {Function} - Middleware function
   */
  middleware(requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    return (req, res, next) => {
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!this.hasAllPermissions(userId, permissions)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    };
  }

  /**
   * Create role-based middleware
   * @param {string|Array<string>} requiredRoles - Required roles
   * @returns {Function} - Middleware function
   */
  roleMiddleware(requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    return (req, res, next) => {
      const userId = req.user?.id || req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!this.hasAnyRole(userId, roles)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    };
  }

  /**
   * Get all registered roles
   * @returns {Array<string>} - Array of role names
   */
  getAllRoles() {
    return Array.from(this.roles.keys());
  }

  /**
   * Get all registered permissions
   * @returns {Array<string>} - Array of permission names
   */
  getAllPermissions() {
    return Array.from(this.permissions.keys());
  }

  /**
   * Export configuration
   * @returns {Object} - Configuration object
   */
  export() {
    const rolesObj = {};
    for (const [role, perms] of this.roles.entries()) {
      rolesObj[role] = Array.from(perms);
    }

    const userRolesObj = {};
    for (const [user, roles] of this.userRoles.entries()) {
      userRolesObj[user] = Array.from(roles);
    }

    return {
      roles: rolesObj,
      userRoles: userRolesObj
    };
  }

  /**
   * Import configuration
   * @param {Object} config - Configuration object
   * @returns {PermissionChecker} - Returns this for chaining
   */
  import(config) {
    if (config.roles) {
      for (const [role, perms] of Object.entries(config.roles)) {
        this.addRole(role, perms);
      }
    }

    if (config.userRoles) {
      for (const [user, roles] of Object.entries(config.userRoles)) {
        roles.forEach(role => this.assignRole(user, role));
      }
    }

    return this;
  }

  /**
   * Reset to default configuration
   */
  reset() {
    this.roles.clear();
    this.permissions.clear();
    this.userRoles.clear();
    this.clearCache();
    this.initializeDefaults();
  }

  /**
   * Get statistics
   * @returns {Object} - Statistics object
   */
  getStats() {
    return {
      totalRoles: this.roles.size,
      totalPermissions: this.permissions.size,
      totalUsers: this.userRoles.size,
      cacheSize: this.cache.size
    };
  }
}

module.exports = PermissionChecker;

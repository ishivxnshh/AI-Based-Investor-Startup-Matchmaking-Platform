const PermissionChecker = require('../permission_checker');

describe('PermissionChecker', () => {
  let checker;

  beforeEach(() => {
    checker = new PermissionChecker();
  });

  describe('Role Management', () => {
    test('should add new role', () => {
      checker.addRole('editor', ['read', 'write']);
      expect(checker.getAllRoles()).toContain('editor');
    });

    test('should remove role', () => {
      checker.addRole('temp', ['read']);
      expect(checker.removeRole('temp')).toBe(true);
      expect(checker.getAllRoles()).not.toContain('temp');
    });

    test('should add permission to role', () => {
      checker.addRole('editor', ['read']);
      checker.addPermissionToRole('editor', 'write');
      expect(checker.getRolePermissions('editor')).toContain('write');
    });
  });

  describe('User Role Assignment', () => {
    test('should assign role to user', () => {
      expect(checker.assignRole('user1', 'admin')).toBe(true);
      expect(checker.getUserRoles('user1')).toContain('admin');
    });

    test('should revoke role from user', () => {
      checker.assignRole('user1', 'admin');
      expect(checker.revokeRole('user1', 'admin')).toBe(true);
      expect(checker.getUserRoles('user1')).not.toContain('admin');
    });

    test('should get all user roles', () => {
      checker.assignRole('user1', 'admin');
      checker.assignRole('user1', 'moderator');
      const roles = checker.getUserRoles('user1');
      expect(roles).toHaveLength(2);
    });
  });

  describe('Permission Checking', () => {
    beforeEach(() => {
      checker.assignRole('user1', 'admin');
      checker.assignRole('user2', 'user');
    });

    test('should check single permission', () => {
      expect(checker.hasPermission('user1', 'admin')).toBe(true);
      expect(checker.hasPermission('user2', 'admin')).toBe(false);
    });

    test('should check all permissions', () => {
      expect(checker.hasAllPermissions('user1', ['read', 'write'])).toBe(true);
      expect(checker.hasAllPermissions('user2', ['read', 'write'])).toBe(false);
    });

    test('should check any permission', () => {
      expect(checker.hasAnyPermission('user2', ['read', 'admin'])).toBe(true);
      expect(checker.hasAnyPermission('user2', ['admin', 'delete'])).toBe(false);
    });
  });

  describe('Role Checking', () => {
    beforeEach(() => {
      checker.assignRole('user1', 'admin');
    });

    test('should check if user has role', () => {
      expect(checker.hasRole('user1', 'admin')).toBe(true);
      expect(checker.hasRole('user1', 'moderator')).toBe(false);
    });

    test('should check if user has any role', () => {
      expect(checker.hasAnyRole('user1', ['admin', 'moderator'])).toBe(true);
      expect(checker.hasAnyRole('user1', ['moderator', 'guest'])).toBe(false);
    });
  });

  describe('Cache Management', () => {
    test('should cache permission checks', () => {
      checker.assignRole('user1', 'admin');
      
      // First call - cache miss
      expect(checker.hasPermission('user1', 'read')).toBe(true);
      
      // Second call - should use cache
      expect(checker.hasPermission('user1', 'read')).toBe(true);
    });

    test('should clear cache on role change', () => {
      checker.assignRole('user1', 'user');
      checker.hasPermission('user1', 'write'); // Cache result
      
      checker.assignRole('user1', 'admin');
      expect(checker.hasPermission('user1', 'admin')).toBe(true);
    });
  });

  describe('Export and Import', () => {
    test('should export configuration', () => {
      checker.assignRole('user1', 'admin');
      const config = checker.export();
      expect(config.roles).toBeDefined();
      expect(config.userRoles).toBeDefined();
    });

    test('should import configuration', () => {
      const config = {
        roles: { custom: ['read'] },
        userRoles: { user1: ['custom'] }
      };
      checker.import(config);
      expect(checker.hasRole('user1', 'custom')).toBe(true);
    });
  });

  describe('Statistics', () => {
    test('should return statistics', () => {
      const stats = checker.getStats();
      expect(stats.totalRoles).toBeGreaterThan(0);
      expect(stats.totalPermissions).toBeGreaterThan(0);
    });
  });

  describe('Reset', () => {
    test('should reset to defaults', () => {
      checker.addRole('custom', ['read']);
      checker.assignRole('user1', 'custom');
      
      checker.reset();
      
      expect(checker.getAllRoles()).not.toContain('custom');
      expect(checker.getUserRoles('user1')).toHaveLength(0);
    });
  });

  describe('Default Roles', () => {
    test('should have default admin role', () => {
      expect(checker.getAllRoles()).toContain('admin');
    });

    test('should have default user role', () => {
      expect(checker.getAllRoles()).toContain('user');
    });
  });
});

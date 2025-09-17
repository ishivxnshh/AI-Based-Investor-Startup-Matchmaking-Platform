import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // This would typically fetch from a Notification model
    // For now, return mock data
    const notifications = [
      {
        id: '1',
        type: 'match',
        title: 'New Match Found',
        message: 'You have a new potential match with TechStart Inc.',
        isRead: false,
        createdAt: new Date(),
        data: {
          matchId: 'match_123',
          startupName: 'TechStart Inc.',
          matchScore: 85
        }
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        message: 'You received a new message from John Doe',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000),
        data: {
          senderId: 'user_456',
          senderName: 'John Doe',
          messageId: 'msg_789'
        }
      },
      {
        id: '3',
        type: 'system',
        title: 'Profile Update Required',
        message: 'Please complete your profile to get better matches',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000),
        data: {
          action: 'update_profile',
          url: '/profile/settings'
        }
      }
    ];

    const filteredNotifications = unreadOnly 
      ? notifications.filter(n => !n.isRead)
      : notifications;

    res.json({
      success: true,
      data: filteredNotifications,
      page: parseInt(page),
      total: filteredNotifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically update the notification in database
    // For now, just return success
    logger.info(`Notification ${id} marked as read by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    // This would typically update all notifications for the user
    // For now, just return success
    logger.info(`All notifications marked as read by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read'
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically delete the notification from database
    // For now, just return success
    logger.info(`Notification ${id} deleted by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
});

// @desc    Get notification settings
// @route   GET /api/notifications/settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  try {
    // This would typically fetch from user preferences
    const settings = {
      email: {
        matches: true,
        messages: true,
        system: true,
        marketing: false
      },
      push: {
        matches: true,
        messages: true,
        system: true
      },
      sms: {
        urgent: true,
        matches: false,
        messages: false
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification settings'
    });
  }
});

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
router.put('/settings', protect, [
  body('email.matches')
    .optional()
    .isBoolean()
    .withMessage('Email matches setting must be boolean'),
  body('email.messages')
    .optional()
    .isBoolean()
    .withMessage('Email messages setting must be boolean'),
  body('push.matches')
    .optional()
    .isBoolean()
    .withMessage('Push matches setting must be boolean'),
  body('push.messages')
    .optional()
    .isBoolean()
    .withMessage('Push messages setting must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const settings = req.body;

    // This would typically update user preferences in database
    // For now, just return success
    logger.info(`Notification settings updated by ${req.user.email}`);
    
    res.json({
      success: true,
      data: settings,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    logger.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification settings'
    });
  }
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
router.post('/', protect, [
  body('type')
    .isIn(['match', 'message', 'system', 'reminder', 'alert'])
    .withMessage('Invalid notification type'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { type, title, message, data = {} } = req.body;

    // This would typically create a notification in database
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date(),
      userId: req.user._id
    };

    logger.info(`Notification created: ${title} for ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
});

export default router;

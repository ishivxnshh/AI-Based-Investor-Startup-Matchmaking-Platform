import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get chat rooms for user
// @route   GET /api/chat/rooms
// @access  Private
router.get('/rooms', protect, async (req, res) => {
  try {
    // This would typically fetch from a ChatRoom model
    // For now, return mock data
    const rooms = [
      {
        id: '1',
        name: 'General Discussion',
        type: 'group',
        lastMessage: 'Welcome to the general discussion room!',
        lastMessageTime: new Date(),
        unreadCount: 0,
        participants: 15
      },
      {
        id: '2',
        name: 'Startup Founders',
        type: 'group',
        lastMessage: 'Anyone looking for co-founders?',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 3,
        participants: 8
      }
    ];

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    logger.error('Get chat rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat rooms'
    });
  }
});

// @desc    Get messages for a chat room
// @route   GET /api/chat/rooms/:roomId/messages
// @access  Private
router.get('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // This would typically fetch from a Message model
    // For now, return mock data
    const messages = [
      {
        id: '1',
        senderId: req.user._id,
        senderName: req.user.fullName,
        message: 'Hello everyone!',
        timestamp: new Date(),
        type: 'text'
      },
      {
        id: '2',
        senderId: 'other_user_id',
        senderName: 'John Doe',
        message: 'Hi there!',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      }
    ];

    res.json({
      success: true,
      data: messages,
      page: parseInt(page),
      hasMore: false
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// @desc    Send message to chat room
// @route   POST /api/chat/rooms/:roomId/messages
// @access  Private
router.post('/rooms/:roomId/messages', protect, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file', 'link'])
    .withMessage('Invalid message type')
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

    const { roomId } = req.params;
    const { message, type = 'text', metadata = {} } = req.body;

    // This would typically save to a Message model
    const newMessage = {
      id: Date.now().toString(),
      roomId,
      senderId: req.user._id,
      senderName: req.user.fullName,
      message,
      type,
      metadata,
      timestamp: new Date()
    };

    // Emit to Socket.IO
    const io = req.app.get('io');
    io.to(roomId).emit('new-message', newMessage);

    logger.info(`Message sent to room ${roomId} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// @desc    Join chat room
// @route   POST /api/chat/rooms/:roomId/join
// @access  Private
router.post('/rooms/:roomId/join', protect, async (req, res) => {
  try {
    const { roomId } = req.params;

    // This would typically update a ChatRoom model
    // For now, just return success
    logger.info(`User ${req.user.email} joined room ${roomId}`);
    
    res.json({
      success: true,
      message: 'Successfully joined room'
    });
  } catch (error) {
    logger.error('Join room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join room'
    });
  }
});

// @desc    Leave chat room
// @route   POST /api/chat/rooms/:roomId/leave
// @access  Private
router.post('/rooms/:roomId/leave', protect, async (req, res) => {
  try {
    const { roomId } = req.params;

    // This would typically update a ChatRoom model
    // For now, just return success
    logger.info(`User ${req.user.email} left room ${roomId}`);
    
    res.json({
      success: true,
      message: 'Successfully left room'
    });
  } catch (error) {
    logger.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave room'
    });
  }
});

// @desc    Get online users
// @route   GET /api/chat/online-users
// @access  Private
router.get('/online-users', protect, async (req, res) => {
  try {
    // This would typically fetch from a real-time store
    // For now, return mock data
    const onlineUsers = [
      {
        id: '1',
        name: 'John Doe',
        role: 'investor',
        lastSeen: new Date(),
        status: 'online'
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'startup',
        lastSeen: new Date(Date.now() - 300000),
        status: 'away'
      }
    ];

    res.json({
      success: true,
      data: onlineUsers
    });
  } catch (error) {
    logger.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch online users'
    });
  }
});

export default router;

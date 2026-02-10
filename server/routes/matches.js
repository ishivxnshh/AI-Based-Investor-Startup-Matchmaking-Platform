import express from 'express';
import Match from '../models/Match.js';
import Startup from '../models/Startup.js';
import Investor from '../models/Investor.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get matches for startup
// @route   GET /api/matches/startup
// @access  Private
router.get('/startup', protect, authorize('startup'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      minScore,
      sortBy = 'matchScore',
      sortOrder = 'desc'
    } = req.query;

    // Get startup profile
    const startup = await Startup.findOne({ userId: req.user._id });
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup profile not found'
      });
    }

    const options = {
      status: status || 'pending',
      minScore: minScore ? parseInt(minScore) : 0
    };

    const matches = await Match.findForStartup(startup._id, options)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments({
      startup: startup._id,
      isActive: true,
      ...(status && { status }),
      ...(minScore && { matchScore: { $gte: parseInt(minScore) } })
    });

    res.json({
      success: true,
      count: matches.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: matches
    });
  } catch (error) {
    logger.error('Get startup matches error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches'
    });
  }
});

// @desc    Get matches for investor
// @route   GET /api/matches/investor
// @access  Private
router.get('/investor', protect, authorize('investor'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      minScore,
      sortBy = 'matchScore',
      sortOrder = 'desc'
    } = req.query;

    // Get investor profile
    const investor = await Investor.findOne({ userId: req.user._id });
    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor profile not found'
      });
    }

    const options = {
      status: status || 'pending',
      minScore: minScore ? parseInt(minScore) : 0
    };

    const matches = await Match.findForInvestor(investor._id, options)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments({
      investor: investor._id,
      isActive: true,
      ...(status && { status }),
      ...(minScore && { matchScore: { $gte: parseInt(minScore) } })
    });

    res.json({
      success: true,
      count: matches.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: matches
    });
  } catch (error) {
    logger.error('Get investor matches error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches'
    });
  }
});

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('startup', 'startupName industry startupStage fundingAmount problemStatement productDescription')
      .populate('investor', 'organization investmentFocus investmentSize preferredIndustries');

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Check if user has access to this match
    const startup = await Startup.findOne({ userId: req.user._id });
    const investor = await Investor.findOne({ userId: req.user._id });

    if (!startup && !investor) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this match'
      });
    }

    if (startup && match.startup.toString() !== startup._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this match'
      });
    }

    if (investor && match.investor.toString() !== investor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this match'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    logger.error('Get match error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch match'
    });
  }
});

// @desc    Respond to match (startup)
// @route   PUT /api/matches/:id/startup-response
// @access  Private
router.put('/:id/startup-response', protect, authorize('startup'), async (req, res) => {
  try {
    const { status, message, notes } = req.body;

    if (!['interested', 'not_interested', 'maybe_later'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid response status'
      });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Check if startup owns this match
    const startup = await Startup.findOne({ userId: req.user._id });
    if (!startup || match.startup.toString() !== startup._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to respond to this match'
      });
    }

    match.startupResponse = {
      status,
      responseDate: new Date(),
      message,
      notes
    };

    // Check for mutual interest
    if (status === 'interested' && match.investorResponse.status === 'interested') {
      match.mutualInterest = true;
    }

    await match.save();

    logger.info(`Startup responded to match ${match._id}: ${status}`);

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    logger.error('Startup response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update response'
    });
  }
});

// @desc    Respond to match (investor)
// @route   PUT /api/matches/:id/investor-response
// @access  Private
router.put('/:id/investor-response', protect, authorize('investor'), async (req, res) => {
  try {
    const { status, message, notes } = req.body;

    if (!['interested', 'not_interested', 'maybe_later'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid response status'
      });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Check if investor owns this match
    const investor = await Investor.findOne({ userId: req.user._id });
    if (!investor || match.investor.toString() !== investor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to respond to this match'
      });
    }

    match.investorResponse = {
      status,
      responseDate: new Date(),
      message,
      notes
    };

    // Check for mutual interest
    if (status === 'interested' && match.startupResponse.status === 'interested') {
      match.mutualInterest = true;
    }

    await match.save();

    logger.info(`Investor responded to match ${match._id}: ${status}`);

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    logger.error('Investor response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update response'
    });
  }
});

// @desc    Add communication to match
// @route   POST /api/matches/:id/communication
// @access  Private
router.post('/:id/communication', protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Check if user has access to this match
    const startup = await Startup.findOne({ userId: req.user._id });
    const investor = await Investor.findOne({ userId: req.user._id });

    if (!startup && !investor) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to communicate in this match'
      });
    }

    if (startup && match.startup.toString() !== startup._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to communicate in this match'
      });
    }

    if (investor && match.investor.toString() !== investor._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to communicate in this match'
      });
    }

    const communication = match.addCommunication(req.user._id, message);
    await match.save();

    logger.info(`Communication added to match ${match._id} by ${req.user.email}`);

    res.json({
      success: true,
      data: communication
    });
  } catch (error) {
    logger.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add communication'
    });
  }
});

// @desc    Mark communication as read
// @route   PUT /api/matches/:id/mark-read
// @access  Private
router.put('/:id/mark-read', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Check if user has access to this match
    const startup = await Startup.findOne({ userId: req.user._id });
    const investor = await Investor.findOne({ userId: req.user._id });

    if (!startup && !investor) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this match'
      });
    }

    match.markAsRead(req.user._id);
    await match.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark as read'
    });
  }
});

// @desc    Get unread count for user
// @route   GET /api/matches/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    let totalUnread = 0;

    const startup = await Startup.findOne({ userId: req.user._id });

    if (startup) {
      totalUnread = await Match.countUnreadForUser(startup._id, req.user._id, 'startup');
    } else {
      const investor = await Investor.findOne({ userId: req.user._id });
      if (investor) {
        totalUnread = await Match.countUnreadForUser(investor._id, req.user._id, 'investor');
      }
    }

    res.json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count'
    });
  }
});

export default router;

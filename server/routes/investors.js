import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import Investor from '../models/Investor.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const upload = multer();

// Normalize fields that may arrive as strings when using FormData
const coerceRequestBody = (req) => {
  // Numbers
  const numericPaths = [
    'investmentSize.min',
    'investmentSize.max',
    'portfolioSize',
    'averageDealSize',
    'totalInvested',
    'yearsOfExperience'
  ];

  numericPaths.forEach((path) => {
    const segments = path.split('.');
    let obj = req.body;
    for (let i = 0; i < segments.length - 1; i++) {
      obj = obj?.[segments[i]];
      if (!obj) return;
    }
    const key = segments[segments.length - 1];
    if (obj && typeof obj[key] === 'string' && obj[key] !== '') {
      const parsed = Number(obj[key]);
      if (!Number.isNaN(parsed)) obj[key] = parsed;
    }
  });

  // Arrays that may be provided as comma-separated strings
  const arrayFields = ['preferredIndustries', 'investmentStage', 'previousInvestments', 'notableExits', 'expertise', 'certifications'];
  arrayFields.forEach((field) => {
    const value = req.body[field];
    if (value !== undefined && !Array.isArray(value)) {
      if (typeof value === 'string') {
        req.body[field] = value
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
    }
  });
};

const normalizeFormData = (req, res, next) => {
  coerceRequestBody(req);
  next();
};

// @desc    Get all investors
// @route   GET /api/investors
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      investmentFocus,
      investmentStage,
      minInvestment,
      maxInvestment,
      industries,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isVerified: true };

    if (investmentFocus) {
      query.investmentFocus = investmentFocus;
    }

    if (investmentStage) {
      query.investmentStage = { $in: investmentStage.split(',') };
    }

    if (minInvestment || maxInvestment) {
      query['investmentSize.min'] = {};
      if (minInvestment) query['investmentSize.min'].$gte = parseInt(minInvestment);
      if (maxInvestment) query['investmentSize.max'].$lte = parseInt(maxInvestment);
    }

    if (industries) {
      query.preferredIndustries = { $in: industries.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const investors = await Investor.find(query)
      .populate('userId', 'fullName avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-email -phone');

    const total = await Investor.countDocuments(query);

    res.json({
      success: true,
      count: investors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: investors
    });
  } catch (error) {
    logger.error('Get investors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investors'
    });
  }
});

// @desc    Get single investor
// @route   GET /api/investors/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id)
      .populate('userId', 'fullName avatar socialLinks location');

    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    res.json({
      success: true,
      data: investor.getPublicProfile()
    });
  } catch (error) {
    logger.error('Get investor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investor'
    });
  }
});

// @desc    Create investor profile
// @route   POST /api/investors
// @access  Private
// Accept multipart/form-data without files as well as JSON
router.post('/', protect, authorize('investor'), upload.none(), normalizeFormData, [
  body('organization')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('investmentFocus')
    .isIn(['Angel', 'Venture Capital', 'Private Equity', 'Corporate VC', 'Accelerator', 'Incubator', 'Family Office', 'Other'])
    .withMessage('Please select a valid investment focus'),
  body('investmentSize.min')
    .isNumeric()
    .withMessage('Minimum investment size must be a number'),
  body('investmentSize.max')
    .isNumeric()
    .withMessage('Maximum investment size must be a number'),
  body('preferredIndustries')
    .isArray({ min: 1 })
    .withMessage('Please select at least one preferred industry'),
  body('investmentCriteria')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Investment criteria must be between 50 and 2000 characters'),
  body('yearsOfExperience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50')
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

    // Check if investor profile already exists
    const existingInvestor = await Investor.findOne({ userId: req.user._id });
    if (existingInvestor) {
      return res.status(409).json({
        success: false,
        error: 'Investor profile already exists'
      });
    }

    const investorData = {
      ...req.body,
      userId: req.user._id
    };

    const investor = await Investor.create(investorData);

    // Update user's hasFilledForm status
    req.user.hasFilledForm = true;
    await req.user.save();

    logger.info(`Investor profile created: ${investor.organization} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: investor
    });
  } catch (error) {
    logger.error('Create investor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create investor profile'
    });
  }
});

// @desc    Update investor profile
// @route   PUT /api/investors/:id
// @access  Private
// Accept multipart/form-data without files as well as JSON
router.put('/:id', protect, authorize('investor'), checkOwnership(Investor), upload.none(), normalizeFormData, [
  body('organization')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('investmentCriteria')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Investment criteria must be between 50 and 2000 characters')
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

    const allowedUpdates = [
      'organization', 'position', 'email', 'phone', 'linkedinProfile',
      'website', 'investmentFocus', 'investmentStage', 'investmentSize',
      'preferredIndustries', 'geographicFocus', 'investmentCriteria',
      'portfolioSize', 'averageDealSize', 'totalInvested', 'yearsOfExperience',
      'previousInvestments', 'notableExits', 'boardSeats', 'expertise',
      'certifications', 'education', 'previousExperience', 'investmentPhilosophy',
      'dueDiligenceProcess', 'valueAdd', 'socialMedia', 'awards',
      'publications', 'speakingEngagements'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.lastUpdated = new Date();

    const investor = await Investor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    logger.info(`Investor profile updated: ${investor.organization} by ${req.user.email}`);
    
    res.json({
      success: true,
      data: investor
    });
  } catch (error) {
    logger.error('Update investor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update investor profile'
    });
  }
});

// @desc    Get investor by user ID
// @route   GET /api/investors/user/:userId
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const investor = await Investor.findOne({ userId: req.params.userId });
    
    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor profile not found'
      });
    }

    res.json({
      success: true,
      data: investor
    });
  } catch (error) {
    logger.error('Get investor by user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investor profile'
    });
  }
});

// @desc    Delete investor profile
// @route   DELETE /api/investors/:id
// @access  Private
router.delete('/:id', protect, authorize('investor'), checkOwnership(Investor), async (req, res) => {
  try {
    const investor = await Investor.findByIdAndDelete(req.params.id);

    // Update user's hasFilledForm status
    req.user.hasFilledForm = false;
    await req.user.save();

    logger.info(`Investor profile deleted: ${investor.organization} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Investor profile deleted successfully'
    });
  } catch (error) {
    logger.error('Delete investor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete investor profile'
    });
  }
});

export default router;

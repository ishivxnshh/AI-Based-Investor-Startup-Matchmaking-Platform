import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Startup from '../models/Startup.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/startups';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, PPT, PPTX, DOC, and DOCX files are allowed'));
    }
  }
});

// Helper to normalize fields that may arrive as strings when using FormData
const coerceRequestBody = (req) => {
  // Numbers
  const numberFields = ['numberOfFounders', 'teamSize', 'fundingAmount', 'fundingRaised', 'equityOffering'];
  numberFields.forEach((field) => {
    if (req.body[field] !== undefined && typeof req.body[field] === 'string' && req.body[field] !== '') {
      const parsed = Number(req.body[field]);
      if (!Number.isNaN(parsed)) req.body[field] = parsed;
    }
  });

  // Arrays that may be provided as comma-separated strings
  const arrayFields = ['founderNames', 'linkedinProfiles', 'teamSkills', 'techStack', 'operatingMarkets'];
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

// @desc    Get all startups
// @route   GET /api/startups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      stage,
      minFunding,
      maxFunding,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isVerified: true };

    if (industry) {
      query.industry = industry;
    }

    if (stage) {
      query.startupStage = stage;
    }

    if (minFunding || maxFunding) {
      query.fundingAmount = {};
      if (minFunding) query.fundingAmount.$gte = parseInt(minFunding);
      if (maxFunding) query.fundingAmount.$lte = parseInt(maxFunding);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const startups = await Startup.find(query)
      .populate('userId', 'fullName avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-email -phone -linkedinProfiles');

    const total = await Startup.countDocuments(query);

    res.json({
      success: true,
      count: startups.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: startups
    });
  } catch (error) {
    logger.error('Get startups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch startups'
    });
  }
});

// @desc    Get single startup
// @route   GET /api/startups/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('userId', 'fullName avatar socialLinks location');

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    res.json({
      success: true,
      data: startup.getPublicProfile()
    });
  } catch (error) {
    logger.error('Get startup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch startup'
    });
  }
});

// @desc    Create startup profile
// @route   POST /api/startups
// @access  Private
// Accept multipart/form-data without files as well as JSON
router.post('/', protect, authorize('startup'), upload.none(), [
  body('startupName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Startup name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('industry')
    .isIn([
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Manufacturing', 'Agriculture', 'Energy', 'Transportation', 'Real Estate',
      'Entertainment', 'Sports', 'Food & Beverage', 'Fashion', 'Beauty',
      'Travel', 'Gaming', 'Social Media', 'AI/ML', 'Blockchain', 'IoT',
      'Cybersecurity', 'SaaS', 'Mobile Apps', 'Web Development', 'Other'
    ])
    .withMessage('Please select a valid industry'),
  body('startupStage')
    .isIn(['Idea', 'MVP', 'Early Stage', 'Growth Stage', 'Scale Stage', 'Mature'])
    .withMessage('Please select a valid startup stage'),
  body('fundingAmount')
    .isNumeric()
    .withMessage('Funding amount must be a number'),
  body('problemStatement')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Problem statement must be between 50 and 2000 characters'),
  body('productDescription')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Product description must be between 50 and 2000 characters')
], async (req, res) => {
  try {
    coerceRequestBody(req);
    // Debug: Log what we're receiving
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    console.log('Request headers:', req.headers);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if startup profile already exists
    const existingStartup = await Startup.findOne({ userId: req.user._id });
    if (existingStartup) {
      return res.status(409).json({
        success: false,
        error: 'Startup profile already exists'
      });
    }

    const startupData = {
      ...req.body,
      userId: req.user._id
    };

    const startup = await Startup.create(startupData);

    // Update user's hasFilledForm status
    req.user.hasFilledForm = true;
    await req.user.save();

    logger.info(`Startup profile created: ${startup.startupName} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Create startup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create startup profile'
    });
  }
});

// @desc    Update startup profile
// @route   PUT /api/startups/:id
// @access  Private
// Accept multipart/form-data without files as well as JSON
router.put('/:id', protect, authorize('startup'), checkOwnership(Startup), upload.none(), [
  body('startupName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Startup name must be between 2 and 100 characters'),
  body('industry')
    .optional()
    .isIn([
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Manufacturing', 'Agriculture', 'Energy', 'Transportation', 'Real Estate',
      'Entertainment', 'Sports', 'Food & Beverage', 'Fashion', 'Beauty',
      'Travel', 'Gaming', 'Social Media', 'AI/ML', 'Blockchain', 'IoT',
      'Cybersecurity', 'SaaS', 'Mobile Apps', 'Web Development', 'Other'
    ])
    .withMessage('Please select a valid industry'),
  body('problemStatement')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Problem statement must be between 50 and 2000 characters'),
  body('productDescription')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Product description must be between 50 and 2000 characters')
], async (req, res) => {
  try {
    coerceRequestBody(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'startupName', 'websiteUrl', 'founderNames', 'email', 'phone',
      'linkedinProfiles', 'numberOfFounders', 'teamSize', 'founderBackground',
      'teamSkills', 'techStack', 'industry', 'problemStatement',
      'productDescription', 'businessModel', 'startupStage', 'fundingAmount',
      'fundingRoundType', 'fundingRaised', 'monthlyRevenue', 'activeUsers',
      'customerRetention', 'growthRate', 'equityOffering', 'headquarters',
      'operatingMarkets', 'expansionPlan', 'socialMedia', 'milestones',
      'awards', 'partnerships'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.lastUpdated = new Date();

    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    logger.info(`Startup profile updated: ${startup.startupName} by ${req.user.email}`);
    
    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Update startup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update startup profile'
    });
  }
});

// @desc    Upload pitch deck
// @route   POST /api/startups/:id/pitch-deck
// @access  Private
router.post('/:id/pitch-deck', protect, authorize('startup'), checkOwnership(Startup), upload.single('pitchDeck'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const startup = await Startup.findById(req.params.id);
    
    // Delete old pitch deck if exists
    if (startup.pitchDeck && startup.pitchDeck.path) {
      try {
        fs.unlinkSync(startup.pitchDeck.path);
      } catch (error) {
        logger.warn('Could not delete old pitch deck:', error.message);
      }
    }

    // Update startup with new pitch deck info
    startup.pitchDeck = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    };

    await startup.save();

    logger.info(`Pitch deck uploaded for startup: ${startup.startupName}`);
    
    res.json({
      success: true,
      message: 'Pitch deck uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    logger.error('Upload pitch deck error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload pitch deck'
    });
  }
});

// @desc    Upload logo
// @route   POST /api/startups/:id/logo
// @access  Private
router.post('/:id/logo', protect, authorize('startup'), checkOwnership(Startup), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const startup = await Startup.findById(req.params.id);
    
    // Delete old logo if exists
    if (startup.logo && startup.logo.path) {
      try {
        fs.unlinkSync(startup.logo.path);
      } catch (error) {
        logger.warn('Could not delete old logo:', error.message);
      }
    }

    // Update startup with new logo info
    startup.logo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    };

    await startup.save();

    logger.info(`Logo uploaded for startup: ${startup.startupName}`);
    
    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    logger.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload logo'
    });
  }
});

// @desc    Get startup by user ID
// @route   GET /api/startups/user/:userId
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const startup = await Startup.findOne({ userId: req.params.userId });
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup profile not found'
      });
    }

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    logger.error('Get startup by user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch startup profile'
    });
  }
});

// @desc    Delete startup profile
// @route   DELETE /api/startups/:id
// @access  Private
router.delete('/:id', protect, authorize('startup'), checkOwnership(Startup), async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    
    // Delete associated files
    if (startup.pitchDeck && startup.pitchDeck.path) {
      try {
        fs.unlinkSync(startup.pitchDeck.path);
      } catch (error) {
        logger.warn('Could not delete pitch deck:', error.message);
      }
    }

    if (startup.logo && startup.logo.path) {
      try {
        fs.unlinkSync(startup.logo.path);
      } catch (error) {
        logger.warn('Could not delete logo:', error.message);
      }
    }

    await Startup.findByIdAndDelete(req.params.id);

    // Update user's hasFilledForm status
    req.user.hasFilledForm = false;
    await req.user.save();

    logger.info(`Startup profile deleted: ${startup.startupName} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Startup profile deleted successfully'
    });
  } catch (error) {
    logger.error('Delete startup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete startup profile'
    });
  }
});

export default router;

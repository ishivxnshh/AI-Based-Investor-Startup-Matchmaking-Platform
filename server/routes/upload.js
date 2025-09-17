import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for general file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/general';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mp3|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
router.post('/single', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fileData = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    };

    logger.info(`File uploaded: ${req.file.originalname} by ${req.user.email}`);
    
    res.json({
      success: true,
      data: fileData
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file'
    });
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const filesData = req.files.map(file => ({
      id: uuidv4(),
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    }));

    logger.info(`${req.files.length} files uploaded by ${req.user.email}`);
    
    res.json({
      success: true,
      data: filesData
    });
  } catch (error) {
    logger.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload files'
    });
  }
});

// @desc    Get uploaded files for user
// @route   GET /api/upload/files
// @access  Private
router.get('/files', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;

    // This would typically fetch from a File model
    // For now, return mock data
    const files = [
      {
        id: '1',
        filename: 'document.pdf',
        originalName: 'My Document.pdf',
        size: 1024000,
        mimetype: 'application/pdf',
        uploadedAt: new Date(),
        type: 'document'
      },
      {
        id: '2',
        filename: 'image.jpg',
        originalName: 'Profile Picture.jpg',
        size: 512000,
        mimetype: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 86400000),
        type: 'image'
      }
    ];

    res.json({
      success: true,
      data: files,
      page: parseInt(page),
      total: files.length
    });
  } catch (error) {
    logger.error('Get files error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch files'
    });
  }
});

// @desc    Delete file
// @route   DELETE /api/upload/files/:id
// @access  Private
router.delete('/files/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically delete from database and filesystem
    // For now, just return success
    logger.info(`File ${id} deleted by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
});

// @desc    Get file info
// @route   GET /api/upload/files/:id
// @access  Private
router.get('/files/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically fetch from a File model
    // For now, return mock data
    const file = {
      id,
      filename: 'document.pdf',
      originalName: 'My Document.pdf',
      size: 1024000,
      mimetype: 'application/pdf',
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    };

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    logger.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file info'
    });
  }
});

// @desc    Download file
// @route   GET /api/upload/files/:id/download
// @access  Private
router.get('/files/:id/download', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically fetch file from filesystem
    // For now, return a mock response
    res.json({
      success: true,
      message: 'File download initiated',
      downloadUrl: `/api/upload/files/${id}/stream`
    });
  } catch (error) {
    logger.error('Download file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

// @desc    Stream file
// @route   GET /api/upload/files/:id/stream
// @access  Private
router.get('/files/:id/stream', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // This would typically stream the actual file
    // For now, return a mock response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    res.send('Mock file content');
  } catch (error) {
    logger.error('Stream file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stream file'
    });
  }
});

export default router;

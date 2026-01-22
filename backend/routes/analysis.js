const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Analysis = require('../models/Analysis');
const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/analysis - Get all analyses with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { status: 'completed' };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.nature) filter.nature = req.query.nature;
    if (req.query.search) {
      filter.paperTitle = { $regex: req.query.search, $options: 'i' };
    }

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      filter.uploadDate = {};
      if (req.query.dateFrom) filter.uploadDate.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.uploadDate.$lte = new Date(req.query.dateTo);
    }

    const analyses = await Analysis.find(filter)
      .sort({ uploadDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Analysis.countDocuments(filter);

    // Add summary statistics
    const stats = await Analysis.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          conferenceCount: {
            $sum: { $cond: [{ $eq: ['$type', 'Conference'] }, 1, 0] }
          },
          journalCount: {
            $sum: { $cond: [{ $eq: ['$type', 'Journal'] }, 1, 0] }
          },
          implementationCount: {
            $sum: { $cond: [{ $eq: ['$nature', 'Implementation'] }, 1, 0] }
          },
          theoreticalCount: {
            $sum: { $cond: [{ $eq: ['$nature', 'Theoretical'] }, 1, 0] }
          },
          avgTypeConfidence: { $avg: '$typeConfidence' },
          avgNatureConfidence: { $avg: '$natureConfidence' }
        }
      }
    ]);

    res.json({
      success: true,
      data: analyses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: stats[0] || {
        totalAnalyses: 0,
        conferenceCount: 0,
        journalCount: 0,
        implementationCount: 0,
        theoreticalCount: 0,
        avgTypeConfidence: 0,
        avgNatureConfidence: 0
      }
    });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({
      error: 'Failed to fetch analyses',
      message: error.message
    });
  }
});

// GET /api/analysis/:id - Get single analysis
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid analysis ID')
], handleValidationErrors, async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis',
      message: error.message
    });
  }
});

// DELETE /api/analysis/:id - Delete analysis
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid analysis ID')
], handleValidationErrors, async (req, res) => {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      error: 'Failed to delete analysis',
      message: error.message
    });
  }
});

// POST /api/analysis/batch-delete - Delete multiple analyses
router.post('/batch-delete', [
  body('ids').isArray({ min: 1 }).withMessage('IDs array is required'),
  body('ids.*').isMongoId().withMessage('Invalid analysis ID')
], handleValidationErrors, async (req, res) => {
  try {
    const result = await Analysis.deleteMany({
      _id: { $in: req.body.ids }
    });

    res.json({
      success: true,
      message: `${result.deletedCount} analyses deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error batch deleting analyses:', error);
    res.status(500).json({
      error: 'Failed to delete analyses',
      message: error.message
    });
  }
});

module.exports = router;
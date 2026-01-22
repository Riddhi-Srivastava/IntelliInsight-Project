const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  paperTitle: {
    type: String,
    required: true,
    maxlength: 500
  },
  originalFileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Conference', 'Journal'],
    required: true
  },
  typeConfidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  nature: {
    type: String,
    enum: ['Implementation', 'Theoretical'],
    required: true
  },
  natureConfidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  evidence: [{
    type: String,
    maxlength: 1000
  }],
  keywords: [{
    type: String,
    maxlength: 50
  }],
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'error'],
    default: 'processing'
  },
  errorMessage: {
    type: String,
    maxlength: 500
  },
  userId: {
    type: String, // For future user authentication
    default: 'anonymous'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
analysisSchema.index({ uploadDate: -1 });
analysisSchema.index({ type: 1 });
analysisSchema.index({ nature: 1 });
analysisSchema.index({ userId: 1 });

// Virtual for formatting dates
analysisSchema.virtual('formattedDate').get(function() {
  return this.uploadDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to get confidence summary
analysisSchema.methods.getConfidenceSummary = function() {
  return {
    averageConfidence: (this.typeConfidence + this.natureConfidence) / 2,
    classifications: [
      { type: 'Publication Type', value: this.type, confidence: this.typeConfidence },
      { type: 'Research Nature', value: this.nature, confidence: this.natureConfidence }
    ]
  };
};

module.exports = mongoose.model('Analysis', analysisSchema);
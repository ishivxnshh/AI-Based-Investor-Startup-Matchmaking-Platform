import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchFactors: {
    industryAlignment: {
      type: Number,
      min: 0,
      max: 100
    },
    stageAlignment: {
      type: Number,
      min: 0,
      max: 100
    },
    fundingAlignment: {
      type: Number,
      min: 0,
      max: 100
    },
    geographicAlignment: {
      type: Number,
      min: 0,
      max: 100
    },
    expertiseAlignment: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'withdrawn'],
    default: 'pending'
  },
  startupResponse: {
    status: {
      type: String,
      enum: ['pending', 'interested', 'not_interested', 'maybe_later'],
      default: 'pending'
    },
    responseDate: Date,
    message: String,
    notes: String
  },
  investorResponse: {
    status: {
      type: String,
      enum: ['pending', 'interested', 'not_interested', 'maybe_later'],
      default: 'pending'
    },
    responseDate: Date,
    message: String,
    notes: String
  },
  mutualInterest: {
    type: Boolean,
    default: false
  },
  meetingScheduled: {
    type: Boolean,
    default: false
  },
  meetingDetails: {
    scheduledDate: Date,
    meetingType: {
      type: String,
      enum: ['video_call', 'phone_call', 'in_person', 'other']
    },
    location: String,
    duration: Number, // in minutes
    agenda: String,
    attendees: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      role: String
    }]
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      readAt: Date
    }]
  }],
  aiInsights: {
    compatibilityScore: Number,
    strengths: [String],
    concerns: [String],
    recommendations: [String],
    nextSteps: [String],
    riskFactors: [String]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expirationDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
matchSchema.index({ startup: 1, investor: 1 }, { unique: true });
matchSchema.index({ startup: 1 });
matchSchema.index({ investor: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ matchScore: -1 });
matchSchema.index({ createdAt: -1 });
matchSchema.index({ lastActivity: -1 });
matchSchema.index({ expirationDate: 1 });

// Compound indexes for efficient queries
matchSchema.index({ startup: 1, status: 1 });
matchSchema.index({ investor: 1, status: 1 });
matchSchema.index({ mutualInterest: 1, status: 1 });

// Pre-save middleware to update lastActivity
matchSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Virtual for days since creation
matchSchema.virtual('daysSinceCreation').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days until expiration
matchSchema.virtual('daysUntilExpiration').get(function() {
  return Math.floor((this.expirationDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Virtual for isExpired
matchSchema.virtual('isExpired').get(function() {
  return this.expirationDate < new Date();
});

// Method to update match score
matchSchema.methods.updateMatchScore = function(factors) {
  this.matchFactors = { ...this.matchFactors, ...factors };
  
  // Calculate weighted average
  const weights = {
    industryAlignment: 0.25,
    stageAlignment: 0.20,
    fundingAlignment: 0.20,
    geographicAlignment: 0.15,
    expertiseAlignment: 0.20
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(factor => {
    if (this.matchFactors[factor] !== undefined) {
      totalScore += this.matchFactors[factor] * weights[factor];
      totalWeight += weights[factor];
    }
  });
  
  this.matchScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  return this.matchScore;
};

// Method to add communication
matchSchema.methods.addCommunication = function(senderId, message) {
  this.communication.push({
    sender: senderId,
    message: message,
    timestamp: new Date()
  });
  this.lastActivity = new Date();
  return this.communication[this.communication.length - 1];
};

// Method to mark message as read
matchSchema.methods.markAsRead = function(userId) {
  const lastMessage = this.communication[this.communication.length - 1];
  if (lastMessage && lastMessage.sender.toString() !== userId.toString()) {
    const existingRead = lastMessage.readBy.find(read => 
      read.user.toString() === userId.toString()
    );
    
    if (!existingRead) {
      lastMessage.readBy.push({
        user: userId,
        readAt: new Date()
      });
    }
  }
};

// Method to get unread count for user
matchSchema.methods.getUnreadCount = function(userId) {
  let unreadCount = 0;
  
  this.communication.forEach(message => {
    if (message.sender.toString() !== userId.toString()) {
      const hasRead = message.readBy.some(read => 
        read.user.toString() === userId.toString()
      );
      if (!hasRead) {
        unreadCount++;
      }
    }
  });
  
  return unreadCount;
};

// Static method to find matches for startup
matchSchema.statics.findForStartup = function(startupId, options = {}) {
  const query = { startup: startupId, isActive: true };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.minScore) {
    query.matchScore = { $gte: options.minScore };
  }
  
  return this.find(query)
    .populate('investor', 'organization position investmentFocus investmentSize preferredIndustries')
    .populate('startup', 'startupName industry startupStage fundingAmount')
    .sort({ matchScore: -1, createdAt: -1 });
};

// Static method to find matches for investor
matchSchema.statics.findForInvestor = function(investorId, options = {}) {
  const query = { investor: investorId, isActive: true };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.minScore) {
    query.matchScore = { $gte: options.minScore };
  }
  
  return this.find(query)
    .populate('startup', 'startupName industry startupStage fundingAmount problemStatement productDescription')
    .populate('investor', 'organization position investmentFocus')
    .sort({ matchScore: -1, createdAt: -1 });
};

// Static method to find mutual matches
matchSchema.statics.findMutualMatches = function() {
  return this.find({ 
    mutualInterest: true, 
    isActive: true 
  })
  .populate('startup', 'startupName industry startupStage fundingAmount')
  .populate('investor', 'organization position investmentFocus')
  .sort({ matchScore: -1, createdAt: -1 });
};

export default mongoose.model('Match', matchSchema);

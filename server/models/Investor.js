import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  investmentFocus: {
    type: String,
    required: [true, 'Investment focus is required'],
    enum: ['Angel', 'Venture Capital', 'Private Equity', 'Corporate VC', 'Accelerator', 'Incubator', 'Family Office', 'Other']
  },
  investmentStage: [{
    type: String,
    enum: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Growth', 'Late Stage']
  }],
  investmentSize: {
    min: {
      type: Number,
      required: [true, 'Minimum investment size is required'],
      min: [0, 'Minimum investment size cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum investment size is required'],
      min: [0, 'Maximum investment size cannot be negative']
    }
  },
  preferredIndustries: [{
    type: String,
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Manufacturing', 'Agriculture', 'Energy', 'Transportation', 'Real Estate',
      'Entertainment', 'Sports', 'Food & Beverage', 'Fashion', 'Beauty',
      'Travel', 'Gaming', 'Social Media', 'AI/ML', 'Blockchain', 'IoT',
      'Cybersecurity', 'SaaS', 'Mobile Apps', 'Web Development', 'Other'
    ]
  }],
  geographicFocus: [{
    type: String,
    trim: true,
    maxlength: [50, 'Geographic focus cannot exceed 50 characters']
  }],
  investmentCriteria: {
    type: String,
    required: [true, 'Investment criteria is required'],
    maxlength: [2000, 'Investment criteria cannot exceed 2000 characters']
  },
  portfolioSize: {
    type: Number,
    min: [0, 'Portfolio size cannot be negative']
  },
  averageDealSize: {
    type: Number,
    min: [0, 'Average deal size cannot be negative']
  },
  totalInvested: {
    type: Number,
    default: 0,
    min: [0, 'Total invested cannot be negative']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50']
  },
  previousInvestments: [{
    companyName: String,
    industry: String,
    stage: String,
    amount: Number,
    year: Number,
    status: {
      type: String,
      enum: ['active', 'exited', 'failed'],
      default: 'active'
    },
    exitValue: Number,
    returnMultiple: Number
  }],
  notableExits: [{
    companyName: String,
    exitType: {
      type: String,
      enum: ['IPO', 'Acquisition', 'Merger', 'Other']
    },
    exitValue: Number,
    returnMultiple: Number,
    year: Number
  }],
  boardSeats: [{
    companyName: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: true
    }
  }],
  expertise: [{
    type: String,
    trim: true,
    maxlength: [50, 'Expertise cannot exceed 50 characters']
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number,
    credentialId: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: Number,
    gpa: String
  }],
  previousExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
    current: {
      type: Boolean,
      default: false
    }
  }],
  investmentPhilosophy: {
    type: String,
    maxlength: [1000, 'Investment philosophy cannot exceed 1000 characters']
  },
  dueDiligenceProcess: {
    type: String,
    maxlength: [1000, 'Due diligence process cannot exceed 1000 characters']
  },
  valueAdd: {
    type: String,
    maxlength: [1000, 'Value add cannot exceed 1000 characters']
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String
  },
  awards: [{
    name: String,
    organization: String,
    year: Number,
    description: String
  }],
  publications: [{
    title: String,
    publisher: String,
    date: Date,
    url: String,
    type: {
      type: String,
      enum: ['article', 'book', 'blog', 'research', 'other']
    }
  }],
  speakingEngagements: [{
    event: String,
    topic: String,
    date: Date,
    location: String,
    audience: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
investorSchema.index({ userId: 1 });
investorSchema.index({ investmentFocus: 1 });
investorSchema.index({ investmentStage: 1 });
investorSchema.index({ preferredIndustries: 1 });
investorSchema.index({ 'investmentSize.min': 1, 'investmentSize.max': 1 });
investorSchema.index({ isActive: 1 });
investorSchema.index({ isVerified: 1 });
investorSchema.index({ createdAt: -1 });

// Text search index
investorSchema.index({
  organization: 'text',
  investmentCriteria: 'text',
  investmentPhilosophy: 'text',
  valueAdd: 'text'
});

// Virtual for investment size range
investorSchema.virtual('investmentSizeRange').get(function() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return `${formatCurrency(this.investmentSize.min)} - ${formatCurrency(this.investmentSize.max)}`;
});

// Method to get public profile
investorSchema.methods.getPublicProfile = function() {
  const investorObject = this.toObject();
  delete investorObject.email;
  delete investorObject.phone;
  return investorObject;
};

// Method to calculate profile completeness
investorSchema.methods.calculateCompleteness = function() {
  const requiredFields = [
    'organization', 'position', 'email', 'investmentFocus', 'investmentSize',
    'preferredIndustries', 'investmentCriteria', 'yearsOfExperience'
  ];

  const optionalFields = [
    'phone', 'linkedinProfile', 'website', 'investmentStage', 'geographicFocus',
    'portfolioSize', 'averageDealSize', 'previousInvestments', 'expertise',
    'investmentPhilosophy', 'valueAdd'
  ];

  let completedRequired = 0;
  let completedOptional = 0;

  requiredFields.forEach(field => {
    if (this[field] && this[field].toString().trim() !== '') {
      if (Array.isArray(this[field])) {
        if (this[field].length > 0) completedRequired++;
      } else {
        completedRequired++;
      }
    }
  });

  optionalFields.forEach(field => {
    if (this[field] && this[field].toString().trim() !== '') {
      if (Array.isArray(this[field])) {
        if (this[field].length > 0) completedOptional++;
      } else {
        completedOptional++;
      }
    }
  });

  const requiredPercentage = (completedRequired / requiredFields.length) * 70;
  const optionalPercentage = (completedOptional / optionalFields.length) * 30;
  
  return Math.round(requiredPercentage + optionalPercentage);
};

export default mongoose.model('Investor', investorSchema);

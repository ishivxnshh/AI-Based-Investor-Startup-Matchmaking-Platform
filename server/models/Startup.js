import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  startupName: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [100, 'Startup name cannot exceed 100 characters']
  },
  websiteUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  founderNames: [{
    type: String,
    trim: true,
    maxlength: [50, 'Founder name cannot exceed 50 characters']
  }],
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
  linkedinProfiles: [{
    type: String,
    trim: true
  }],
  numberOfFounders: {
    type: Number,
    required: [true, 'Number of founders is required'],
    min: [1, 'Must have at least 1 founder'],
    max: [10, 'Cannot have more than 10 founders']
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: [1, 'Team size must be at least 1'],
    max: [1000, 'Team size cannot exceed 1000']
  },
  founderBackground: {
    type: String,
    required: [true, 'Founder background is required'],
    maxlength: [1000, 'Founder background cannot exceed 1000 characters']
  },
  teamSkills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  techStack: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tech stack item cannot exceed 50 characters']
  }],
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
      'Manufacturing', 'Agriculture', 'Energy', 'Transportation', 'Real Estate',
      'Entertainment', 'Sports', 'Food & Beverage', 'Fashion', 'Beauty',
      'Travel', 'Gaming', 'Social Media', 'AI/ML', 'Blockchain', 'IoT',
      'Cybersecurity', 'SaaS', 'Mobile Apps', 'Web Development', 'Other'
    ]
  },
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    maxlength: [2000, 'Problem statement cannot exceed 2000 characters']
  },
  productDescription: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Product description cannot exceed 2000 characters']
  },
  businessModel: {
    type: String,
    required: [true, 'Business model is required'],
    maxlength: [1000, 'Business model cannot exceed 1000 characters']
  },
  startupStage: {
    type: String,
    required: [true, 'Startup stage is required'],
    enum: ['Idea', 'MVP', 'Early Stage', 'Growth Stage', 'Scale Stage', 'Mature']
  },
  fundingAmount: {
    type: Number,
    required: [true, 'Funding amount is required'],
    min: [0, 'Funding amount cannot be negative']
  },
  fundingRoundType: {
    type: String,
    required: [true, 'Funding round type is required'],
    enum: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Bridge', 'Convertible Note']
  },
  fundingRaised: {
    type: Number,
    default: 0,
    min: [0, 'Funding raised cannot be negative']
  },
  monthlyRevenue: {
    type: String,
    default: '$0'
  },
  activeUsers: {
    type: String,
    default: '0'
  },
  customerRetention: {
    type: String,
    default: '0%'
  },
  growthRate: {
    type: String,
    default: '0%'
  },
  equityOffering: {
    type: Number,
    min: [0, 'Equity offering cannot be negative'],
    max: [100, 'Equity offering cannot exceed 100%']
  },
  headquarters: {
    type: String,
    required: [true, 'Headquarters location is required'],
    maxlength: [100, 'Headquarters cannot exceed 100 characters']
  },
  operatingMarkets: [{
    type: String,
    trim: true,
    maxlength: [50, 'Market cannot exceed 50 characters']
  }],
  expansionPlan: {
    type: String,
    maxlength: [1000, 'Expansion plan cannot exceed 1000 characters']
  },
  pitchDeck: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: Date
  },
  logo: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: Date
  },
  additionalDocuments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: Date,
    description: String
  }],
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String
  },
  milestones: [{
    title: String,
    description: String,
    date: Date,
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'planned'
    }
  }],
  awards: [{
    name: String,
    organization: String,
    year: Number,
    description: String
  }],
  partnerships: [{
    company: String,
    type: String,
    description: String,
    startDate: Date,
    endDate: Date
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
startupSchema.index({ industry: 1 });
startupSchema.index({ startupStage: 1 });
startupSchema.index({ fundingAmount: 1 });
startupSchema.index({ isActive: 1 });
startupSchema.index({ isVerified: 1 });
startupSchema.index({ createdAt: -1 });

// Text search index
startupSchema.index({
  startupName: 'text',
  problemStatement: 'text',
  productDescription: 'text',
  businessModel: 'text'
});

// Virtual for funding amount in different currencies
startupSchema.virtual('fundingAmountFormatted').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.fundingAmount);
});

// Method to get public profile
startupSchema.methods.getPublicProfile = function() {
  const startupObject = this.toObject();
  delete startupObject.email;
  delete startupObject.phone;
  delete startupObject.linkedinProfiles;
  return startupObject;
};

// Method to calculate profile completeness
startupSchema.methods.calculateCompleteness = function() {
  const requiredFields = [
    'startupName', 'websiteUrl', 'founderNames', 'email', 'numberOfFounders',
    'teamSize', 'founderBackground', 'industry', 'problemStatement',
    'productDescription', 'businessModel', 'startupStage', 'fundingAmount',
    'fundingRoundType', 'headquarters'
  ];

  const optionalFields = [
    'phone', 'linkedinProfiles', 'teamSkills', 'techStack', 'monthlyRevenue',
    'activeUsers', 'fundingRaised', 'customerRetention', 'growthRate',
    'equityOffering', 'operatingMarkets', 'expansionPlan', 'pitchDeck'
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

export default mongoose.model('Startup', startupSchema);

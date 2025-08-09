import mongoose from 'mongoose';

const StartupFormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupName: String,
  websiteUrl: String,
  founderNames: String,
  email: String,
  phone: String,
  linkedinProfiles: String,
  numberOfFounders: String,
  teamSize: String,
  founderBackground: String,
  previousStartupExperience: Boolean,
  teamSkills: [String],
  industry: [String],
  problemStatement: String,
  productDescription: String,
  businessModel: String,
  techStack: String,
  startupStage: String,
  monthlyRevenue: String,
  activeUsers: String,
  fundingRaised: String,
  customerRetention: String,
  growthRate: String,
  fundingAmount: String,
  useOfFunds: [String],
  fundingRoundType: String,
  equityOffering: String,
  headquarters: String,
  operatingMarkets: [String],
  expansionPlan: String,
  pitchDeck: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('StartupForm', StartupFormSchema);

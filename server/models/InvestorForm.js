import mongoose from 'mongoose';

const InvestorFormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Basic Information
  fullName: String,
  email: String,
  phone: String,
  linkedIn: String,
  organization: String,

  // Investor Type
  investorType: String,
  isAccredited: String,

  // Investment Preferences
  preferredIndustries: [String],
  preferredStages: [String],
  ticketSize: String,
  preferredGeographies: [String],
  investmentModel: String,
  coInvestmentInterest: String,

  // Investment Experience
  hasInvestedBefore: String,
  numberOfInvestments: String,
  portfolioHighlights: String,
  portfolioLink: String,

  // Strategy & Risk Preferences
  riskAppetite: String,
  investmentHorizon: String,
  esgInterest: String,

  // Optional
  availability: [String],
  preferredCommunication: String,
  comments: String,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('InvestorForm', InvestorFormSchema);

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Startup from '../models/Startup.js';
import Investor from '../models/Investor.js';
import Match from '../models/Match.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// @desc    Analyze startup pitch deck
// @route   POST /api/ai/analyze/:startupId
// @access  Private
router.post('/analyze/:startupId', protect, async (req, res) => {
  try {
    const { startupId } = req.params;
    
    const startup = await Startup.findOne({ userId: req.user._id, _id: startupId });
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    if (!startup.pitchDeck || !startup.pitchDeck.path) {
      return res.status(400).json({
        success: false,
        error: 'No pitch deck uploaded'
      });
    }

    // Mock AI analysis for now (replace with actual AI processing)
    const analysis = await generatePitchAnalysis(startup);
    
    res.json({
      success: true,
      analysis,
      startupId: startup._id
    });
  } catch (error) {
    logger.error('AI analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze pitch deck'
    });
  }
});

// @desc    Generate investor insights
// @route   POST /api/ai/investor-insights
// @access  Private
router.post('/investor-insights', protect, authorize('investor'), async (req, res) => {
  try {
    const investor = await Investor.findOne({ userId: req.user._id });
    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor profile not found'
      });
    }

    const insights = await generateInvestorInsights(investor);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    logger.error('Investor insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

// @desc    Generate market trends
// @route   POST /api/ai/market-trends
// @access  Private
router.post('/market-trends', protect, async (req, res) => {
  try {
    const trends = await generateMarketTrends();
    
    res.json({
      success: true,
      trends
    });
  } catch (error) {
    logger.error('Market trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate market trends'
    });
  }
});

// @desc    Generate portfolio analytics
// @route   POST /api/ai/portfolio-analytics
// @access  Private
router.post('/portfolio-analytics', protect, authorize('investor'), async (req, res) => {
  try {
    const analytics = await generatePortfolioAnalytics(req.user._id);
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    logger.error('Portfolio analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate portfolio analytics'
    });
  }
});

// @desc    Generate startup recommendations for investor
// @route   POST /api/ai/recommendations
// @access  Private
router.post('/recommendations', protect, authorize('investor'), async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recommendations = await generateStartupRecommendations(req.user._id, parseInt(limit));
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    logger.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// @desc    Generate match analysis
// @route   POST /api/ai/match-analysis/:matchId
// @access  Private
router.post('/match-analysis/:matchId', protect, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = await Match.findById(matchId)
      .populate('startup', 'startupName industry startupStage fundingAmount problemStatement productDescription')
      .populate('investor', 'organization investmentFocus investmentSize preferredIndustries');
    
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    const analysis = await generateMatchAnalysis(match);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    logger.error('Match analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate match analysis'
    });
  }
});

// Helper function to generate pitch analysis
async function generatePitchAnalysis(startup) {
  try {
    const prompt = `
    Analyze this startup pitch deck and provide comprehensive feedback:
    
    Startup: ${startup.startupName}
    Industry: ${startup.industry}
    Stage: ${startup.startupStage}
    Problem: ${startup.problemStatement}
    Solution: ${startup.productDescription}
    Business Model: ${startup.businessModel}
    Funding Request: $${startup.fundingAmount}
    
    Please provide:
    1. Strengths of the pitch
    2. Areas for improvement
    3. Investment recommendation
    4. Specific suggestions for improvement
    5. Risk factors to consider
    6. Market opportunity assessment
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    logger.error('AI pitch analysis error:', error);
    return `
    ### ✅ Strengths
    - Clear problem statement and solution
    - Strong market opportunity
    - Experienced founding team
    
    ### ⚠️ Areas for Improvement
    - Financial projections need more detail
    - Competitive analysis could be stronger
    - Go-to-market strategy needs refinement
    
    ### 📈 Investment Recommendation
    - Promising startup with good potential
    - Consider for further due diligence
    - Focus on market validation metrics
    
    ### 🔧 Specific Improvement Recommendations
    - Add detailed financial projections
    - Include competitive landscape analysis
    - Define clear customer acquisition strategy
    
    ### 🚨 Risk Factors
    - Market competition
    - Execution risk
    - Funding requirements
    `;
  }
}

// Helper function to generate investor insights
async function generateInvestorInsights(investor) {
  try {
    const prompt = `
    Generate investment insights for this investor:
    
    Organization: ${investor.organization}
    Focus: ${investor.investmentFocus}
    Industries: ${investor.preferredIndustries.join(', ')}
    Investment Size: $${investor.investmentSize.min} - $${investor.investmentSize.max}
    Experience: ${investor.yearsOfExperience} years
    
    Provide insights on:
    1. Market opportunities
    2. Portfolio gaps
    3. Risk factors
    4. Strategic recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    logger.error('AI investor insights error:', error);
    return {
      marketOpportunities: [
        'AI/ML startups showing strong growth',
        'Fintech sector experiencing consolidation',
        'HealthTech gaining investor interest'
      ],
      portfolioGaps: [
        'Early-stage SaaS opportunities',
        'Emerging market exposure',
        'ESG-focused investments'
      ],
      riskFactors: [
        'Market volatility in tech sector',
        'Regulatory changes in fintech',
        'Supply chain disruptions'
      ],
      strategicRecommendations: [
        'Consider diversifying into emerging markets',
        'Focus on sustainable tech investments',
        'Monitor regulatory developments'
      ]
    };
  }
}

// Helper function to generate market trends
async function generateMarketTrends() {
  try {
    const prompt = `
    Generate current market trends for startup investments:
    
    Provide:
    1. Top performing sectors
    2. Emerging trends
    3. Market sentiment
    4. Key metrics
    5. VC trends
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    logger.error('AI market trends error:', error);
    return {
      topSectors: ['AI/ML', 'Fintech', 'HealthTech', 'CleanTech', 'EdTech'],
      emergingTrends: ['Web3 adoption', 'Sustainable tech', 'Remote work solutions', 'Cybersecurity'],
      marketSentiment: 'Bullish',
      keyMetrics: {
        totalDeals: '2,847',
        avgDealSize: '$12.5M',
        growthRate: '23%',
        exitValue: '$89.2B'
      },
      vcTrends: {
        totalDeals: '2,847',
        avgDealSize: '$12.5M',
        growthRate: '23%',
        exitValue: '$89.2B'
      }
    };
  }
}

// Helper function to generate portfolio analytics
async function generatePortfolioAnalytics(userId) {
  try {
    const matches = await Match.find({ investor: userId })
      .populate('startup', 'startupName industry startupStage fundingAmount');
    
    const analytics = {
      totalInvestments: matches.length,
      portfolioValue: '$2.4M',
      avgReturn: '18.5%',
      diversification: 'Good',
      riskScore: 'Medium',
      topPerformers: matches.slice(0, 2),
      sectors: [...new Set(matches.map(m => m.startup.industry))],
      stages: [...new Set(matches.map(m => m.startup.startupStage))]
    };
    
    return analytics;
  } catch (error) {
    logger.error('Portfolio analytics error:', error);
    return {
      totalInvestments: 0,
      portfolioValue: '$0',
      avgReturn: '0%',
      diversification: 'N/A',
      riskScore: 'Low',
      topPerformers: [],
      sectors: [],
      stages: []
    };
  }
}

// Helper function to generate startup recommendations
async function generateStartupRecommendations(userId, limit) {
  try {
    const investor = await Investor.findOne({ userId });
    if (!investor) return [];

    const startups = await Startup.find({
      isActive: true,
      isVerified: true,
      industry: { $in: investor.preferredIndustries }
    }).limit(limit);

    const recommendations = startups.map(startup => ({
      id: startup._id,
      name: startup.startupName,
      description: startup.productDescription,
      industry: startup.industry,
      stage: startup.startupStage,
      fundingAmount: startup.fundingAmount,
      matchScore: Math.floor(Math.random() * 30) + 70 // Mock score
    }));

    return recommendations;
  } catch (error) {
    logger.error('Startup recommendations error:', error);
    return [];
  }
}

// Helper function to generate match analysis
async function generateMatchAnalysis(match) {
  try {
    const analysis = {
      compatibilityScore: match.matchScore,
      strengths: [
        'Strong industry alignment',
        'Appropriate funding stage',
        'Geographic proximity'
      ],
      concerns: [
        'Limited market validation',
        'High competition in sector'
      ],
      recommendations: [
        'Schedule initial meeting',
        'Request additional financial data',
        'Conduct market research'
      ],
      nextSteps: [
        'Initial pitch meeting',
        'Due diligence process',
        'Term sheet negotiation'
      ],
      riskFactors: [
        'Market risk',
        'Execution risk',
        'Competition risk'
      ]
    };

    return analysis;
  } catch (error) {
    logger.error('Match analysis error:', error);
    return {
      compatibilityScore: 0,
      strengths: [],
      concerns: [],
      recommendations: [],
      nextSteps: [],
      riskFactors: []
    };
  }
}

export default router;

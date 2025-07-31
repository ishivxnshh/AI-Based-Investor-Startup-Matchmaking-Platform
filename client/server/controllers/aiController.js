import aiService from '../services/aiService.js';
import StartupForm from '../models/StartupForm.js';
import InvestorForm from '../models/InvestorForm.js';
import User from '../models/User.js';

export const analyzePitch = async (req, res) => {
  try {
    const { startupId } = req.params;

    // Get startup data from database
    const startup = await StartupForm.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Check if startup has a pitch deck
    if (!startup.pitchDeck) {
      return res.status(400).json({
        message: 'No pitch deck found. Please upload a pitch deck first.'
      });
    }

    // Prepare pitch deck information for analysis
    const pitchDeckInfo = {
      originalName: startup.pitchDeck.originalName,
      size: startup.pitchDeck.size,
      uploadedAt: startup.pitchDeck.uploadedAt,
      startupName: startup.startupName,
      path: startup.pitchDeck.path
    };

    // Analyze the pitch deck using AI
    const analysisResult = await aiService.analyzePitchDeck(pitchDeckInfo);

    if (!analysisResult.success) {
      return res.status(500).json({
        message: 'Failed to analyze pitch deck',
        error: analysisResult.error
      });
    }

    res.json({
      success: true,
      analysis: analysisResult.text,
      timestamp: analysisResult.timestamp,
      startupName: startup.startupName,
      pitchDeckName: startup.pitchDeck.originalName
    });

  } catch (error) {
    console.error('Pitch analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, analysisContext } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get AI response
    const chatResult = await aiService.chatWithAI(message, analysisContext);

    if (!chatResult.success) {
      return res.status(500).json({
        message: 'Failed to get AI response',
        error: chatResult.error
      });
    }

    res.json({
      success: true,
      reply: chatResult.text,
      timestamp: chatResult.timestamp
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const findMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get current user to determine their role
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let matchResult;

    if (currentUser.role === 'startup') {
      // Get startup profile
      const startupProfile = await StartupForm.findOne({ userId });
      if (!startupProfile) {
        return res.status(404).json({ message: 'Startup profile not found. Please complete your profile first.' });
      }

      // Get all investor profiles
      const allInvestors = await InvestorForm.find({});
      if (allInvestors.length === 0) {
        return res.status(404).json({ message: 'No investors found in the system' });
      }

      // Use AI to find matches
      matchResult = await aiService.findMatchesForStartup(startupProfile, allInvestors);

    } else if (currentUser.role === 'investor') {
      // Get investor profile
      const investorProfile = await InvestorForm.findOne({ userId });
      if (!investorProfile) {
        return res.status(404).json({ message: 'Investor profile not found. Please complete your profile first.' });
      }

      // Get all startup profiles
      const allStartups = await StartupForm.find({});
      if (allStartups.length === 0) {
        return res.status(404).json({ message: 'No startups found in the system' });
      }

      // Use AI to find matches
      matchResult = await aiService.findMatchesForInvestor(investorProfile, allStartups);

    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!matchResult.success) {
      return res.status(500).json({
        message: 'Failed to generate matches',
        error: matchResult.error
      });
    }

    res.json({
      success: true,
      matches: matchResult.text,
      timestamp: matchResult.timestamp,
      userRole: currentUser.role,
      totalProfilesAnalyzed: currentUser.role === 'startup' ?
        await InvestorForm.countDocuments() :
        await StartupForm.countDocuments()
    });

  } catch (error) {
    console.error('AI matchmaking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import StartupForm from '../models/StartupForm.js';
import InvestorForm from '../models/InvestorForm.js';
import User from '../models/User.js';
import aiService from '../services/aiService.js';

export const submitStartupForm = async (req, res) => {
  try {
    const userId = req.body.userId;  // From frontend - secure this later with auth

    // Prepare form data and parse JSON strings back to arrays
    const formData = { ...req.body, userId };

    // Parse array fields that were sent as JSON strings
    const arrayFields = ['teamSkills', 'industry', 'useOfFunds', 'operatingMarkets'];
    arrayFields.forEach(field => {
      if (formData[field] && typeof formData[field] === 'string') {
        try {
          formData[field] = JSON.parse(formData[field]);
        } catch (e) {
          // If parsing fails, keep as string or set to empty array
          formData[field] = [];
        }
      }
    });

    // Convert boolean fields
    if (formData.previousStartupExperience === 'true') {
      formData.previousStartupExperience = true;
    } else if (formData.previousStartupExperience === 'false') {
      formData.previousStartupExperience = false;
    }

    // Handle pitch deck file if uploaded
    if (req.file) {
      formData.pitchDeck = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadedAt: new Date()
      };
    }

    const form = new StartupForm(formData);
    await form.save();

    await User.findByIdAndUpdate(userId, { hasFilledForm: true });

    res.status(201).json({
      message: 'Startup form saved successfully',
      pitchDeckUploaded: !!req.file
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitInvestorForm = async (req, res) => {
  try {
    const userId = req.body.userId;
    const form = new InvestorForm({ ...req.body, userId });
    await form.save();

    await User.findByIdAndUpdate(userId, { hasFilledForm: true });

    res.status(201).json({ message: 'Investor form saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInvestors = async (req, res) => {
  try {
    const investors = await InvestorForm.find();
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvestorById = async (req, res) => {
  try {
    const investor = await InvestorForm.findById(req.params.id);
    if (!investor) return res.status(404).json({ message: 'Investor not found' });
    res.json(investor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvestorByUserId = async (req, res) => {
  try {
    const investor = await InvestorForm.findOne({ userId: req.params.userId });
    if (!investor) {
      // Return empty object instead of 404 for profile settings
      return res.json({});
    }
    res.json(investor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvestorProfile = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    const updatedInvestor = await InvestorForm.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    if (!updatedInvestor) {
      return res.status(404).json({ message: 'Investor profile not found.' });
    }
    res.json({ message: 'Investor profile updated successfully', investor: updatedInvestor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const startups = await StartupForm.find();
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStartupById = async (req, res) => {
  try {
    const startup = await StartupForm.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStartupByUserId = async (req, res) => {
  try {
    const startup = await StartupForm.findOne({ userId: req.params.userId });
    if (!startup) return res.status(404).json({ message: 'Startup profile not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStartupProfile = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Parse array fields that were sent as JSON strings
    const arrayFields = ['teamSkills', 'industry', 'useOfFunds', 'operatingMarkets'];
    arrayFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // If parsing fails, keep as string or set to empty array
          updateData[field] = [];
        }
      }
    });

    // Convert boolean fields
    if (updateData.previousStartupExperience === 'true') {
      updateData.previousStartupExperience = true;
    } else if (updateData.previousStartupExperience === 'false') {
      updateData.previousStartupExperience = false;
    }

    const updatedStartup = await StartupForm.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    if (!updatedStartup) {
      return res.status(404).json({ message: 'Startup profile not found.' });
    }
    res.json({ message: 'Startup profile updated successfully', startup: updatedStartup });
  } catch (error) {
    console.error('Error in updateStartupProfile:', error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
};

export const downloadPitchDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await StartupForm.findById(id);

    if (!startup || !startup.pitchDeck) {
      return res.status(404).json({ message: 'Pitch deck not found' });
    }

    const filePath = startup.pitchDeck.path;
    res.download(filePath, startup.pitchDeck.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePitchDeck = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the startup by userId
    const startup = await StartupForm.findOne({ userId });
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Update pitch deck information
    const pitchDeckData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadedAt: new Date()
    };

    startup.pitchDeck = pitchDeckData;
    await startup.save();

    res.json({
      success: true,
      message: 'Pitch deck updated successfully',
      pitchDeck: pitchDeckData
    });

  } catch (error) {
    console.error('Error updating pitch deck:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMatchedInvestors = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Get all investors first
    const allInvestors = await InvestorForm.find();
    if (allInvestors.length === 0) {
      return res.status(404).json({ message: 'No investors found in the database.' });
    }

    // Get the startup profile
    const startupProfile = await StartupForm.findOne({ userId });
    
    // If no startup profile exists, provide basic matches from available investors
    if (!startupProfile) {
      const basicMatches = allInvestors.slice(0, 5).map((investor, index) => ({
        investor: investor,
        score: 75 - (index * 5), // Basic scoring
        reasoning: 'Profile incomplete - showing available investors',
        alignmentPoints: ['Complete your profile for personalized matching', 'General investor availability'],
        concerns: ['Profile needs completion for better matching'],
        recommendation: index === 0 ? 'Consider' : 'Explore'
      }));
      
      return res.json({
        success: true,
        matches: basicMatches,
        message: 'Showing available investors. Complete your profile for AI-powered matching.'
      });
    }

    console.log('Using AI service to find matches for startup:', startupProfile.startupName);
    
    // Use AI service to find matches with real startup data
    const matchingResult = await aiService.getMatchedInvestorsForStartup(startupProfile, allInvestors);
    
    console.log('AI matching result:', matchingResult.success ? 'Success' : 'Failed');
    
    if (!matchingResult.success) {
      console.error('AI matching failed:', matchingResult.error);
      // Return fallback matches if AI fails, but still use real investor data
      const fallbackMatches = allInvestors.slice(0, 5).map((investor, index) => ({
        investor: investor,
        score: 80 - (index * 8),
        reasoning: 'AI analysis temporarily unavailable',
        alignmentPoints: ['Industry match', 'Stage alignment', 'Geographic fit'],
        concerns: [],
        recommendation: index === 0 ? 'Recommended' : 'Consider'
      }));
      
      return res.json({
        success: true,
        matches: fallbackMatches,
        message: 'Using fallback matching due to AI service issues'
      });
    }

    res.json({
      success: true,
      matches: matchingResult.matches,
      message: matchingResult.error ? 
        'AI-powered matches with fallback data' : 
        'AI-powered investor matches retrieved successfully'
    });

  } catch (error) {
    console.error('Error in getMatchedInvestors:', error);
    res.status(500).json({ 
      message: 'Failed to get matched investors',
      error: error.message 
    });
  }
};

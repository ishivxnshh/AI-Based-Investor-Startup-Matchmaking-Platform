import StartupForm from '../models/StartupForm.js';
import InvestorForm from '../models/InvestorForm.js';
import User from '../models/User.js';

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

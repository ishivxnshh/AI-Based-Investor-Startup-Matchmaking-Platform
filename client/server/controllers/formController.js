import StartupForm from '../models/StartupForm.js';
import InvestorForm from '../models/InvestorForm.js';
import User from '../models/User.js';

export const submitStartupForm = async (req, res) => {
  try {
    const userId = req.body.userId;  // From frontend - secure this later with auth
    const form = new StartupForm({ ...req.body, userId });
    await form.save();

    await User.findByIdAndUpdate(userId, { hasFilledForm: true });

    res.status(201).json({ message: 'Startup form saved successfully' });
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

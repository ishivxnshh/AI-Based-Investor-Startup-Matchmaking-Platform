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

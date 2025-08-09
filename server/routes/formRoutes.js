import express from 'express';
import { submitStartupForm, submitInvestorForm, getAllInvestors, getInvestorById, getInvestorByUserId, getAllStartups, getStartupById, getStartupByUserId, updateInvestorProfile, updateStartupProfile, downloadPitchDeck, updatePitchDeck, getMatchedInvestors } from '../controllers/formController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/startup-form', upload.single('pitchDeck'), submitStartupForm);
router.post('/investor-form', submitInvestorForm);
router.get('/investor-form', getAllInvestors);
router.get('/investor-form/:id', getInvestorById);
router.get('/investor-form/user/:userId', getInvestorByUserId);
router.put('/investor-form', updateInvestorProfile);
router.put('/startup-form', updateStartupProfile);
router.get('/startup-form', getAllStartups);
router.get('/startup-form/:id', getStartupById);
router.get('/startup-form/user/:userId', getStartupByUserId);
router.get('/startup-form/:id/pitch-deck', downloadPitchDeck);
router.put('/startup-form/pitch-deck', upload.single('pitchDeck'), updatePitchDeck);
router.get('/matched-investors/:userId', getMatchedInvestors);

export default router;

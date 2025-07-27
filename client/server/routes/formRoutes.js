import express from 'express';
import { submitStartupForm, submitInvestorForm, getAllInvestors, getInvestorById, getAllStartups, getStartupById, updateInvestorProfile, updateStartupProfile } from '../controllers/formController.js';

const router = express.Router();

router.post('/startup-form', submitStartupForm);
router.post('/investor-form', submitInvestorForm);
router.get('/investor-form', getAllInvestors);
router.get('/investor-form/:id', getInvestorById);
router.put('/investor-form', updateInvestorProfile);
router.put('/startup-form', updateStartupProfile);
router.get('/startup-form', getAllStartups);
router.get('/startup-form/:id', getStartupById);

export default router;

import express from 'express';
import { submitStartupForm, submitInvestorForm, getAllInvestors, getInvestorById } from '../controllers/formController.js';

const router = express.Router();

router.post('/startup-form', submitStartupForm);
router.post('/investor-form', submitInvestorForm);
router.get('/investor-form', getAllInvestors);
router.get('/investor-form/:id', getInvestorById);

export default router;

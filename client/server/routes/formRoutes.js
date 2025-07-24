import express from 'express';
import { submitStartupForm, submitInvestorForm } from '../controllers/formController.js';

const router = express.Router();

router.post('/startup-form', submitStartupForm);
router.post('/investor-form', submitInvestorForm);

export default router;

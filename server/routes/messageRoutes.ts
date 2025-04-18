import express from 'express';
import { createPersonalizedMessage } from '../controllers/messageController.js';

const router = express.Router();

// Generate personalized message
router.post('/', createPersonalizedMessage);

export default router;
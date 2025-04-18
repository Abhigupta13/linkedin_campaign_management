import express from 'express';
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';

const router = express.Router();

// Get all campaigns
router.get('/', getAllCampaigns);

// Get a campaign by ID
router.get('/:id', getCampaignById);

// Create a new campaign
router.post('/', createCampaign);

// Update a campaign
router.put('/:id', updateCampaign);

// Delete a campaign (soft delete)
router.delete('/:id', deleteCampaign);

export default router;
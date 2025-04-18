import { Request, Response } from 'express';
import Campaign, { CampaignStatus } from '../models/Campaign.js';

// Get all campaigns (excluding DELETED)
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: CampaignStatus.DELETED } });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server error while fetching campaigns' });
  }
};

// Get a campaign by ID
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    if (campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json({ message: 'Campaign has been deleted' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Server error while fetching campaign' });
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Basic validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    
    // Create new campaign
    const newCampaign = new Campaign({
      name,
      description,
      status: status || CampaignStatus.ACTIVE,
      leads: leads || [],
      accountIDs: accountIDs || []
    });
    
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Server error while creating campaign' });
  }
};

// Update a campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Find campaign
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    if (campaign.status === CampaignStatus.DELETED) {
      return res.status(400).json({ message: 'Cannot update a deleted campaign' });
    }
    
    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Update campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { name, description, status, leads, accountIDs },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Server error while updating campaign' });
  }
};

// Soft delete a campaign (set status to DELETED)
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Soft delete by setting status to DELETED
    campaign.status = CampaignStatus.DELETED;
    await campaign.save();
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Server error while deleting campaign' });
  }
};
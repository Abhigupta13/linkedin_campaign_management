import axios from 'axios';
import { Campaign } from '../types/Campaign';

const API_URL = 'http://localhost:5000';

// Fetch all campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await axios.get(`${API_URL}/campaigns`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

// Fetch a campaign by ID
export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

// Create a new campaign
export const createCampaign = async (campaignData: Campaign): Promise<Campaign> => {
  try {
    const response = await axios.post(`${API_URL}/campaigns`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

// Update a campaign
export const updateCampaign = async (id: string, campaignData: Campaign): Promise<Campaign> => {
  try {
    const response = await axios.put(`${API_URL}/campaigns/${id}`, campaignData);
    return response.data;
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    throw error;
  }
};

// Delete a campaign (soft delete)
export const deleteCampaign = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/campaigns/${id}`);
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    throw error;
  }
};

// Generate personalized message
export const generatePersonalizedMessage = async (profileData: {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/personalized-message`, profileData);
    return response.data.message;
  } catch (error) {
    console.error('Error generating personalized message:', error);
    throw error;
  }
};
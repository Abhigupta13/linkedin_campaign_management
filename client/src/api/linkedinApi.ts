import axios from 'axios';
import { LinkedInProfile } from '../types/LinkedIn';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://linkedin-campaign-management-server.onrender.com';

export const scrapeLinkedInProfiles = async (searchUrl: string): Promise<LinkedInProfile[]> => {
  try {
    const response = await axios.post(`${API_URL}/linkedin/scrape`, { searchUrl });
    return response.data;
  } catch (error) {
    console.error('Error scraping LinkedIn profiles:', error);
    throw error;
  }
};

export const searchLinkedInProfiles = async (query: string): Promise<LinkedInProfile[]> => {
  try {
    const response = await axios.get(`${API_URL}/linkedin/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching LinkedIn profiles:', error);
    throw error;
  }
};
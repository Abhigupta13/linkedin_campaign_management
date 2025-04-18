import { Request, Response } from 'express';
import { searchStoredProfiles, scrapeLinkedInProfiles } from '../services/linkedinScraperService';

export const scrapeProfiles = async (req: Request, res: Response) => {
  try {
    const { searchUrl } = req.body;

    if (!searchUrl) {
      return res.status(400).json({ message: 'Search URL is required' });
    }

    const profiles = await scrapeLinkedInProfiles(searchUrl);
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error in scrapeProfiles:', error);
    res.status(500).json({ message: 'Server error while scraping profiles' });
  }
};

export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const profiles = await searchStoredProfiles(query.toString());
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error in searchProfiles:', error);
    res.status(500).json({ message: 'Server error while searching profiles' });
  }
};
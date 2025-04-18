import { Request, Response } from 'express';
import { generatePersonalizedMessage } from '../services/aiService.js';

// Generate personalized message based on LinkedIn profile data
export const createPersonalizedMessage = async (req: Request, res: Response) => {
  try {
    const { name, job_title, company, location, summary } = req.body;
    
    // Basic validation
    if (!name || !job_title || !company) {
      return res.status(400).json({ 
        message: 'Name, job title, and company are required' 
      });
    }
    
    // Generate personalized message
    const message = await generatePersonalizedMessage({
      name,
      job_title,
      company,
      location: location || '',
      summary: summary || ''
    });
    
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error generating personalized message:', error);
    res.status(500).json({ 
      message: 'Server error while generating personalized message' 
    });
  }
};
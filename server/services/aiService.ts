import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export const generatePersonalizedMessage = async (profileData: LinkedInProfile): Promise<string> => {
  try {
    const prompt = `
      Generate a personalized outreach message for a LinkedIn connection request based on the following profile information:
      
      Name: ${profileData.name}
      Job Title: ${profileData.job_title}
      Company: ${profileData.company}
      Location: ${profileData.location}
      Summary: ${profileData.summary}
      
      The message should:
      1. Be professional and friendly
      2. Reference their specific role and company
      3. Mention how our campaign management tool could help them
      4. Be concise (3-4 sentences max)
      5. End with a call to action
      
      The message should sound natural and not overly sales-y.
    `;

    // If no OpenAI API key is provided, return a sample message
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return `Hey ${profileData.name}, I noticed you're working as a ${profileData.job_title} at ${profileData.company}. Our campaign management system could help streamline your outreach efforts and boost your conversion rates. Would you be open to a quick chat about how we might help your team at ${profileData.company}?`;
    }

    // Call OpenAI API to generate personalized message
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that writes personalized LinkedIn outreach messages." },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo", // Changed to a more widely available model
      max_tokens: 150, // Reduced token limit
      temperature: 0.7, // Added temperature for more controlled responses(Randomness of response for 0.0-> same output)
    });

    return completion.choices[0].message.content || "Failed to generate message";
  } catch (error:any) {
    console.error('Error generating AI message:', error.error);
    // Return a fallback message instead of throwing an error
    return `Hi ${profileData.name}, I came across your profile and noticed your role as ${profileData.job_title} at ${profileData.company}. I'd love to connect and learn more about your work. Looking forward to connecting!`;
  }
};
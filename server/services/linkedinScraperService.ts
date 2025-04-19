import { chromium } from 'playwright';
import LinkedInProfile from '../models/LinkedinProfile.js';
import dotenv from 'dotenv';

dotenv.config();

interface ScrapedProfile {
  fullName: string;
  headline?: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  about?: string;
}



export const scrapeLinkedInProfiles = async (searchUrl: string): Promise<ScrapedProfile[]> => {
    console.log("Starting LinkedIn scrape using Playwright...");
  
    if (!searchUrl || typeof searchUrl !== 'string') {
      throw new Error('Invalid searchUrl: URL must be a string');
    }
  
    const browser = await chromium.launch({
      headless: false, // Use headless: true in production
      slowMo: 50
    });
    console.log("Browser launched");
  
    const context = await browser.newContext();
    const page = await context.newPage();
  
    try {
      console.log("Logging in to LinkedIn...");
      await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });
      await page.fill('#username', process.env.LINKEDIN_EMAIL || '');
      await page.fill('#password', process.env.LINKEDIN_PASSWORD || '');
      await Promise.all([
        page.click('[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'domcontentloaded' })
      ]);
      await page.waitForTimeout(20000);
      console.log("Logged in successfully");
  
      console.log(`Navigating to search URL: ${searchUrl}`);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);
      console.log("Search URL loaded");
  
      console.log("Scrolling to load more results...");
      for (let i = 0; i < 5; i++) {
        console.log(`Scrolling iteration: ${i + 1}`);
        await page.mouse.wheel(0, 1000);
        await page.waitForTimeout(2000 + Math.random() * 1000);
      }
  
      console.log("Waiting for profile cards...");
      await page.waitForSelector('div[data-view-name="search-entity-result-universal-template"]', { timeout: 15000 });
  
      console.log("Extracting profile data...");
      const profiles = await page.evaluate(() => {
        const results: ScrapedProfile[] = [];
  
        const cards = Array.from(document.querySelectorAll('li')).filter(card =>
          card.querySelector('div[data-view-name="search-entity-result-universal-template"]')
        );
  
        cards.forEach((card) => {
          try {
            const name = card.querySelector('a span[aria-hidden="true"]')?.textContent?.trim() || '';
            const headline = card.querySelector('.t-14.t-black.t-normal')?.textContent?.trim() || '';
            
            // Get all location divs and take the last one (which is the actual location)
            const locationDivs = Array.from(card.querySelectorAll('.t-14.t-normal'));
            const location = locationDivs[locationDivs.length - 1]?.textContent?.trim() || '';

            const profileLink = (card.querySelector('a[href*="linkedin.com/in/"]') as HTMLAnchorElement)?.href?.split('?')[0] || '';
  
            const summary = card.querySelector('p.entity-result__summary--2-lines')?.textContent?.trim() || '';
           
            
            let jobTitle = '';
            let company = '';
            
            const text: string = (headline + ' ' + summary).trim();
            const parts = text.split(' at ');
            
            if (parts.length > 1) {
              // Shorten job title (split by | or • and limit to a few words)
              const rawTitle = parts[0].split(/[|•-]/)[0].trim();
              jobTitle = rawTitle.split(/\s+/).slice(0, 6).join(' ');
            
              const rawCompany = parts[1].split(' - ')[0].trim();
              company = rawCompany.split(/\s+/).slice(0, 3).join(' ');
            } else {
              const fallback = text.split(/[|•-]/)[0].trim();
              jobTitle = fallback.split(/\s+/).slice(0, 6).join(' ');
            }
            
  
            if (name && profileLink) {
              results.push({
                fullName: name,
                jobTitle,
                company,
                location,
                profileUrl: profileLink,
              });
            }
          } catch (error) {
            console.error('Error processing card:', error);
          }
        });
  
        return results;
      });
  
      console.log(`Extracted ${profiles.length} profiles`);
  
      const topProfiles = profiles.slice(0, 20);
      console.log(`Top ${topProfiles.length} profiles selected`);
  
      console.log("Saving profiles to MongoDB...");
      for (const profile of topProfiles) {
        await LinkedInProfile.findOneAndUpdate(
          { profileUrl: profile.profileUrl },
          profile,
          { upsert: true, new: true }
        );
        console.log(`Profile saved/updated: ${profile.fullName}`);
      }
  
      return topProfiles;
    } catch (error) {
      console.error('Error scraping LinkedIn profiles with Playwright:', error);
      throw error;
    } finally {
      console.log("Closing browser...");
      await browser.close();
    }
  };
  

export const searchStoredProfiles = async (query: string): Promise<ScrapedProfile[]> => {
    console.log(`Searching stored profiles for query: ${query}`);
    try {
      const profiles = await LinkedInProfile.find({
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { jobTitle: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      });
      console.log(`Found ${profiles.length} profiles matching query: ${query}`);
      return profiles;
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  };
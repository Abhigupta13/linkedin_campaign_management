import express from 'express';
import { scrapeProfiles, searchProfiles } from '../controllers/linkedinController';

const router = express.Router();

router.post('/scrape', scrapeProfiles);
router.get('/search', searchProfiles);

export default router;
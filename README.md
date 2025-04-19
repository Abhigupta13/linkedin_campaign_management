# LinkedIn Campaign Management

This project is a full-stack LinkedIn Campaign Management system with AI-powered outreach message generation and LinkedIn profile scraping functionality.

---

## 🔧 Tech Stack

### Backend:
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### Frontend:
- React
- TypeScript
- Tailwind CSS (or any preferred UI library)

### AI:
- OpenAI for generating personalized outreach messages

### Scraping:
- Playwright used for automating LinkedIn profile scraping

---

## 🚀 Features

### 📊 Campaign Management
- Create, Update, Soft Delete, and View Campaigns
- Store metadata: name, description, status, leads, and account IDs
- Campaign status: **ACTIVE**, **INACTIVE**, or **DELETED** (soft delete)

### 🤖 AI Message Generation
- Generates personalized messages using OpenAI
- Accepts name, job title, company, location, and summary
- Outputs tailored outreach content for LinkedIn connections

### 🕵️ LinkedIn Profile Scraping
- Scrapes LinkedIn profiles from a search URL
- Extracts:
  - Full Name
  - Job Title
  - Company
  - Location
  - Profile URL
- Data is stored in MongoDB and displayed in the frontend
- Scraping script runs locally and is located in the server directory

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/LinkedIn-Campaign-Management.git
cd LinkedIn-Campaign-Management
```

### 2. Install Dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables

Create a `.env` file in `server/`:

```env
MONGODB_URI=mongodb://localhost:27017/campaign
OPENAI_API_KEY=your_openai_key
LINKEDIN_EMAIL=your_email
LINKEDIN_PASSWORD=your_password
```

## 🖼️ UI Overview

- Campaign dashboard with list, edit, delete, and status toggle
- Form for LinkedIn profile input and message generation
- Lead table for displaying scraped profiles

---

## 📦 Deployment

- Deployed link- https://linkedin-campaign-management.vercel.app/

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import CampaignForm from './pages/CampaignForm';
import MessageGenerator from './pages/MessageGenerator';
import LeadSearch from './pages/LeadSearch';
import NotFound from './pages/NotFound';
import { CampaignProvider } from './context/CampaignContext';

function App() {
  return (
    <BrowserRouter>
      <CampaignProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaign/new" element={<CampaignForm />} />
              <Route path="/campaign/edit/:id" element={<CampaignForm />} />
              <Route path="/message-generator" element={<MessageGenerator />} />
              <Route path="/lead-search" element={<LeadSearch />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </CampaignProvider>
    </BrowserRouter>
  );
}

export default App;
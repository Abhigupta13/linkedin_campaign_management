import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign } from '../types/Campaign';
import { fetchCampaigns } from '../api/campaignApi';
import toast from 'react-hot-toast';

interface CampaignContextProps {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  refreshCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextProps | undefined>(undefined);

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to fetch campaigns');
      toast.error('Failed to load campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCampaigns();
  }, []);

  return (
    <CampaignContext.Provider value={{ campaigns, loading, error, refreshCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};
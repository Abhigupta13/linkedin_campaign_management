import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Campaign, CampaignStatus } from '../types/Campaign';
import { createCampaign, fetchCampaignById, updateCampaign } from '../api/campaignApi';
import { useCampaigns } from '../context/CampaignContext';
import toast from 'react-hot-toast';

const CampaignForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshCampaigns } = useCampaigns();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Campaign>({
    name: '',
    description: '',
    status: CampaignStatus.ACTIVE,
    leads: [],
    accountIDs: []
  });
  
  const [newLead, setNewLead] = useState('');
  const [newAccountID, setNewAccountID] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCampaign, setFetchingCampaign] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const getCampaign = async () => {
        try {
          setFetchingCampaign(true);
          const campaignData = await fetchCampaignById(id);
          setFormData(campaignData);
        } catch (error) {
          toast.error('Failed to fetch campaign details');
          navigate('/');
        } finally {
          setFetchingCampaign(false);
        }
      };
      
      getCampaign();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addLead = () => {
    if (!newLead.trim()) return;
    
    // Basic validation for LinkedIn URL
    if (!newLead.includes('linkedin.com/in/')) {
      toast.error('Please enter a valid LinkedIn profile URL');
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      leads: [...prev.leads, newLead.trim()]
    }));
    setNewLead('');
  };

  const removeLead = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leads: prev.leads.filter((_, i) => i !== index)
    }));
  };

  const addAccountID = () => {
    if (!newAccountID.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      accountIDs: [...prev.accountIDs, newAccountID.trim()]
    }));
    setNewAccountID('');
  };

  const removeAccountID = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      accountIDs: prev.accountIDs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await updateCampaign(id, formData);
        toast.success('Campaign updated successfully');
      } else {
        await createCampaign(formData);
        toast.success('Campaign created successfully');
      }
      
      refreshCampaigns();
      navigate('/');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update campaign' : 'Failed to create campaign');
      console.error('Error saving campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCampaign) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEditing ? 'Edit Campaign' : 'New Campaign'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter campaign description"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={CampaignStatus.ACTIVE}>Active</option>
                <option value={CampaignStatus.INACTIVE}>Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URLs</label>
              <div className="flex">
                <input
                  type="text"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
                <button
                  type="button"
                  onClick={addLead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-2">
                {formData.leads.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.leads.map((lead, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md"
                      >
                        <a
                          href={lead}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {lead}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeLead(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No leads added yet</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account IDs</label>
              <div className="flex">
                <input
                  type="text"
                  value={newAccountID}
                  onChange={(e) => setNewAccountID(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account ID"
                />
                <button
                  type="button"
                  onClick={addAccountID}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-2">
                {formData.accountIDs.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.accountIDs.map((id, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md"
                      >
                        <span className="text-gray-700">{id}</span>
                        <button
                          type="button"
                          onClick={() => removeAccountID(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No account IDs added yet</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors mr-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Campaign' : 'Create Campaign'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CampaignForm;
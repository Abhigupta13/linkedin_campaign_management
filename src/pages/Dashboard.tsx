import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaigns } from '../context/CampaignContext';
import { Campaign, CampaignStatus } from '../types/Campaign';
import { deleteCampaign, updateCampaign } from '../api/campaignApi';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { campaigns, loading, error, refreshCampaigns } = useCampaigns();
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const toggleCampaignDetails = (id: string) => {
    if (expandedCampaign === id) {
      setExpandedCampaign(null);
    } else {
      setExpandedCampaign(id);
    }
  };

  const handleStatusToggle = async (campaign: Campaign) => {
    try {
      const newStatus = campaign.status === CampaignStatus.ACTIVE 
        ? CampaignStatus.INACTIVE 
        : CampaignStatus.ACTIVE;
      
      await updateCampaign(campaign._id!, {
        ...campaign,
        status: newStatus
      });
      
      toast.success(`Campaign status updated to ${newStatus}`);
      refreshCampaigns();
    } catch (error) {
      toast.error('Failed to update campaign status');
      console.error('Error updating campaign status:', error);
    }
  };

  const openDeleteModal = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCampaignToDelete(null);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      await deleteCampaign(campaignToDelete._id!);
      toast.success('Campaign deleted successfully');
      refreshCampaigns();
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to delete campaign');
      console.error('Error deleting campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">Error: {error}</p>
        <button 
          onClick={refreshCampaigns}
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="/campaign/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">No campaigns found. Create your first campaign to get started.</p>
          <Link
            to="/campaign/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900">{campaign.name}</h2>
                    <div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          campaign.status === CampaignStatus.ACTIVE
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{campaign.description}</p>
                </div>

                <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
                  <button
                    onClick={() => toggleCampaignDetails(campaign._id!)}
                    className="text-sm text-gray-600 flex items-center hover:text-blue-600 transition-colors"
                  >
                    {expandedCampaign === campaign._id ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" /> Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" /> Show Details
                      </>
                    )}
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusToggle(campaign)}
                      className={`p-2 rounded ${
                        campaign.status === CampaignStatus.ACTIVE
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } transition-colors`}
                      title={campaign.status === CampaignStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                    >
                      {campaign.status === CampaignStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link
                      to={`/campaign/edit/${campaign._id}`}
                      className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(campaign)}
                      className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedCampaign === campaign._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-3 border-t border-gray-100"
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Leads ({campaign.leads.length})</h3>
                      {campaign.leads.length > 0 ? (
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {campaign.leads.slice(0, 3).map((lead, index) => (
                            <li key={index} className="truncate">
                              <a href={lead} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {lead}
                              </a>
                            </li>
                          ))}
                          {campaign.leads.length > 3 && (
                            <li className="text-gray-500">+{campaign.leads.length - 3} more</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">No leads added yet</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Account IDs ({campaign.accountIDs.length})</h3>
                      {campaign.accountIDs.length > 0 ? (
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {campaign.accountIDs.slice(0, 3).map((id, index) => (
                            <li key={index}>{id}</li>
                          ))}
                          {campaign.accountIDs.length > 3 && (
                            <li className="text-gray-500">+{campaign.accountIDs.length - 3} more</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">No account IDs added yet</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the campaign "{campaignToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
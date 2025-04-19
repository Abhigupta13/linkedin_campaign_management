import React, { useState } from 'react';
import { Clipboard, Send, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePersonalizedMessage } from '../api/campaignApi';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

const MessageGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: 'Rahul Sharma',
    job_title: 'Lead Software Engineer',
    company: 'Infosys Technologies',
    location: 'Bangalore, India',
    summary: 'Experienced software professional with expertise in full-stack development and cloud technologies. Passionate about building scalable solutions and mentoring junior developers.'
  });
  
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const message = await generatePersonalizedMessage(formData);
      setGeneratedMessage(message);
      toast.success('Message generated successfully');
    } catch (error) {
      toast.error('Failed to generate message');
      console.error('Error generating message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
      .then(() => toast.success('Message copied to clipboard'))
      .catch(() => toast.error('Failed to copy message'));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      job_title: '',
      company: '',
      location: '',
      summary: ''
    });
    setGeneratedMessage('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">LinkedIn Message Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Profile Data</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. John Smith"
                />
              </div>

              <div>
                <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Sales Director"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Tech Solutions Inc."
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief professional summary or key skills"
                />
              </div>

              <div className="flex mt-4 space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate Message
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generated Message</h2>
            {generatedMessage && (
              <button
                onClick={handleCopyToClipboard}
                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                <Clipboard className="w-4 h-4 mr-1" /> Copy
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            {generatedMessage ? (
              <p className="text-gray-800 whitespace-pre-line">{generatedMessage}</p>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Enter LinkedIn profile data and click "Generate Message" to create a personalized outreach message.
                </p>
              </div>
            )}
          </div>
          
          {generatedMessage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                This message was generated based on the provided LinkedIn profile data. You can use this as a starting point for your outreach campaigns.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MessageGenerator;
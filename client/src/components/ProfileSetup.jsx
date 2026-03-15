import React, { useState } from 'react';
import { useUserProfile } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../utils/api';

const ProfileSetup = () => {
  const { updateUserProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    officialEmail: '',
    designation: 'Environment Officer',
    subsidiary: '',
    mines: [],
    location: '',
    phone: ''
  });

  const [currentMine, setCurrentMine] = useState('');

  const subsidiaries = ['SECL', 'WCL', 'ECL', 'CCL', 'MCL', 'NCL'];
  const govDomains = ['gov.in', 'nic.in', 'gov.com'];

  const validateEmail = (email) => {
    return govDomains.some(domain => email.endsWith(domain));
  };

  const handleAddMine = () => {
    if (currentMine.trim() && !formData.mines.includes(currentMine.trim())) {
      setFormData(prev => ({
        ...prev,
        mines: [...prev.mines, currentMine.trim()]
      }));
      setCurrentMine('');
    }
  };

  const handleRemoveMine = (mineToRemove) => {
    setFormData(prev => ({
      ...prev,
      mines: prev.mines.filter(mine => mine !== mineToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMine();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.officialEmail)) {
      alert('Please use an official government email address (.gov.in, .nic.in, etc.)');
      return;
    }

    if (formData.mines.length === 0) {
      alert('Please add at least one mine');
      return;
    }

    if (!formData.subsidiary) {
      alert('Please select your coal subsidiary');
      return;
    }

    try {
      await saveProfile(formData);
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#013220] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-8">Please provide your official details as an Environment Officer</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Dr. Rajesh Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.officialEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, officialEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="rajesheo@secl.gov.in"
            />
            <p className="text-sm text-gray-500 mt-1">Must be a government email (.gov.in, .nic.in, etc.)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coal Subsidiary *
            </label>
            <select
              required
              value={formData.subsidiary}
              onChange={(e) => setFormData(prev => ({ ...prev, subsidiary: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Subsidiary</option>
              {subsidiaries.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Korba, Chhattisgarh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mines Under Supervision *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentMine}
                onChange={(e) => setCurrentMine(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Gevra Mine"
              />
              <button
                type="button"
                onClick={handleAddMine}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.mines.map((mine, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-700">🏭 {mine}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMine(mine)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Add all mines you supervise</p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Complete Profile & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
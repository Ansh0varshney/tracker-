import { useState, useEffect } from 'react';

export function useCampaigns(userId) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Fetch campaigns on mount and when userId changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!userId) return;
      

      try {
        setLoading(true);
        const response = await fetch(`/api/campaigns?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data);
        setError(null);
        

        // Set first campaign as selected by default if available
        if (data.length > 0 && !selectedCampaign) {
          setSelectedCampaign(data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [userId]);

  // Create a new campaign
  const createCampaign = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCampaign,
          userId,
        }),
      });

      if (response.status === 403) {
        window.location.href = '/subscribe';
        return;
      }
      if (!response.ok) throw new Error('Failed to create campaign');
      const createdCampaign = await response.json();
      setCampaigns(prev => [...prev, createdCampaign]);
      setNewCampaign({ name: '', description: '' }); // Reset form
      setSelectedCampaign(createdCampaign._id);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a campaign
  const deleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      setLoading(true);
      // Fix: Use correct DELETE endpoint and pass campaignId as query param
      const response = await fetch(`/api/campaigns?campaignId=${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');
      
      setCampaigns(prev => prev.filter(c => c._id !== campaignId));
      if (selectedCampaign === campaignId) {
        setSelectedCampaign(campaigns[0]?._id || null);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    newCampaign,
    setNewCampaign,
    loading,
    error,
    createCampaign,
    deleteCampaign,
  };
}
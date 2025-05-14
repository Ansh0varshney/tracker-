import { useState, useEffect } from 'react';

export function useEvents(campaignId) {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    openCount: 0,
    clickCount: 0,
    uniqueOpenersCount: 0,
    topCompanies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    if (!campaignId) return;
    
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch(`/api/stats?campaignId=${campaignId}`),
        fetch(`/api/events?campaignId=${campaignId}`)
      ]);

      if (!statsResponse.ok || !eventsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [statsData, eventsData] = await Promise.all([
        statsResponse.json(),
        eventsResponse.json()
      ]);

      setStats(statsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [campaignId]);

  return {
    events,
    stats,
    loading,
    error,
    refreshData: loadDashboardData
  };
} 
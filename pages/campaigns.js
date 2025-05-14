import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCampaigns } from '../hooks/useCampaigns';


export default function CampaignSelection() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [campaignMetrics, setCampaignMetrics] = useState({});   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure useCampaigns is only called when currentUser is set
  const {
    campaigns,
    newCampaign,
    setNewCampaign,
    loading: campaignsLoading,
    createCampaign,
    deleteCampaign
  } = useCampaigns(currentUser?._id || null);


  // Load user data and campaign metrics on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, []);

  // Fetch metrics for all campaigns
  useEffect(() => {
    const fetchCampaignMetrics = async () => {
      if (!campaigns.length) return;
      
      try {
        setLoading(true);
        const metrics = {};
        
        for (const campaign of campaigns) {
          const response = await fetch(`/api/stats?campaignId=${campaign._id}`);
          if (!response.ok) throw new Error('Failed to fetch campaign metrics');
          metrics[campaign._id] = await response.json();
        }
        
        setCampaignMetrics(metrics);
       
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignMetrics();
  }, [campaigns]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCampaignSelect = (campaignId) => {
    router.push(`/dashboard?campaign=${campaignId}`);
  };

  const calculatePercentage = (current, previous) => {
    if (!previous) return '0%';
    return `${((current / previous) * 100).toFixed(1)}%`;
  };

  if (loading || campaignsLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Head>
        <title>Campaign Selection - Email Tracking</title>
        <meta name="description" content="Select or create a campaign" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="fas fa-envelope-open-text me-2"></i>
            Email Tracking
          </a>
          <div className="d-flex align-items-center">
            {currentUser && (
              <div className="me-3">
                <span className="text-muted me-2">Logged in as:</span>
                <strong>{currentUser.name}</strong>
              </div>
            )}
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Create New Campaign</h5>
                <form onSubmit={createCampaign}>
                  <div className="mb-3">
                    <label htmlFor="campaignName" className="form-label">Campaign Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="campaignName"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="campaignDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="campaignDescription"
                      rows="3"
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Campaign</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <h2 className="mb-4">Your Campaigns</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {campaigns.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No campaigns created yet.</p>
                <p>Create your first campaign to start tracking emails!</p>
              </div>
            ) : (
              <div className="row g-4">
                {campaigns.map(campaign => {
                  const metrics = campaignMetrics[campaign._id] || {
                    totalRecipients: 0, 
                    sentCount: 0, 
                    openCount: 0,
                    clickCount: 0,
                    uniqueOpenersCount: 0,
                    uniqueClickersCount: 0
                  };

                  return (
                    <div key={campaign._id} className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title mb-0">{campaign.name}</h5>
                            <div className="dropdown">
                              <button 
                                className="btn btn-link text-muted p-0" 
                                data-bs-toggle="dropdown"
                              >
                                <i className="fas fa-ellipsis-v"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => handleCampaignSelect(campaign._id)}
                                  >
                                    <i className="fas fa-chart-line me-2"></i>
                                    View Dashboard
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => deleteCampaign(campaign._id)}
                                  >
                                    <i className="fas fa-trash me-2"></i>
                                    Delete Campaign
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          {campaign.description && (
                            <p className="text-muted small mb-3">{campaign.description}</p>
                          )}

                          <div className="campaign-metrics">
                            <div className="metric-row d-flex justify-content-between mb-2">
                              <span>Total Recipients</span>
                              <strong>{metrics.totalRecipients}</strong>
                            </div>
                            <div className="metric-row d-flex justify-content-between mb-2">
                              <span>Emails Sent</span>
                              <strong>{metrics.sentCount}</strong>
                            </div>
                            <div className="metric-row d-flex justify-content-between mb-2">
                              <span>Emails Opened</span>
                              <div className="text-end">
                                <strong>{metrics.openCount}</strong>
                                <small className="text-muted ms-2">
                                  ({calculatePercentage(metrics.openCount, metrics.sentCount)})
                                </small>
                              </div>
                            </div>
                            <div className="metric-row d-flex justify-content-between mb-2">
                              <span>Unique Opens</span>
                              <div className="text-end">
                                <strong>{metrics.uniqueOpenersCount}</strong>
                                <small className="text-muted ms-2">
                                  ({calculatePercentage(metrics.uniqueOpenersCount, metrics.sentCount)})
                                </small>
                              </div>
                            </div>
                            <div className="metric-row d-flex justify-content-between mb-2">
                              <span>Emails Clicked</span>
                              <div className="text-end">
                                <strong>{metrics.clickCount}</strong>
                                <small className="text-muted ms-2">
                                  ({calculatePercentage(metrics.clickCount, metrics.sentCount)})
                                </small>
                              </div>
                            </div>
                            <div className="metric-row d-flex justify-content-between">
                              <span>Unique Clicks</span>
                              <div className="text-end">
                                <strong>{metrics.uniqueClickersCount}</strong>
                                <small className="text-muted ms-2">
                                  ({calculatePercentage(metrics.uniqueClickersCount, metrics.sentCount)})
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RecipientEngagementTable from '../components/dashboard/RecipientEngagementTable';
import EmailEventLogs from '../components/dashboard/EmailEventLogs';

export default function Dashboard() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('engagement');
  const [activeLogsTab, setActiveLogsTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
    setLoading(false);
  }, []);

  // Redirect to campaign selection if no campaign is selected
  useEffect(() => {
    if (!loading && !campaignId) {
      router.push('/campaigns');
    }
  }, [loading, campaignId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleBackToCampaigns = () => {
    router.push('/campaigns');
  };

  if (loading) {
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
        <title>Campaign Dashboard - Email Tracking</title>
        <meta name="description" content="Campaign dashboard with engagement metrics and logs" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-link text-decoration-none me-3"
              onClick={handleBackToCampaigns}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Campaigns
            </button>
            <a className="navbar-brand" href="#">
              <i className="fas fa-envelope-open-text me-2"></i>
              Email Tracking
            </a>
          </div>
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

      <div className="container py-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Main Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'engagement' ? 'active' : ''}`}
              onClick={() => setActiveTab('engagement')}
            >
              <i className="fas fa-chart-line me-2"></i>
              Engagement Priority
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <i className="fas fa-list me-2"></i>
              Logs
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Engagement Priority Tab */}
          {activeTab === 'engagement' && (
            <div className="tab-pane fade show active">
              <RecipientEngagementTable campaignId={campaignId} />
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="tab-pane fade show active">
              {/* Logs Sub-tabs */}
              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeLogsTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveLogsTab('all')}
                  >
                    All Events
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeLogsTab === 'opens' ? 'active' : ''}`}
                    onClick={() => setActiveLogsTab('opens')}
                  >
                    Opens
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeLogsTab === 'clicks' ? 'active' : ''}`}
                    onClick={() => setActiveLogsTab('clicks')}
                  >
                    Clicks
                  </button>
                </li>
              </ul>

              {/* Logs Content */}
              <EmailEventLogs 
                campaignId={campaignId} 
                eventType={activeLogsTab === 'all' ? null : activeLogsTab}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
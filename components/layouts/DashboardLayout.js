import Head from 'next/head';
import { useRouter } from 'next/router';

export default function DashboardLayout({ 
  children, 
  currentUser, 
  onLogout, 
  campaigns, 
  selectedCampaign, 
  onCampaignChange, 
}) {
  const router = useRouter();

  return (
    <div style={{ color: 'black' }}>
      <Head>
        <title>Email Tracking Dashboard</title>
        <meta name="description" content="Email tracking system dashboard" />
      </Head>

      <div className="header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1><i className="fas fa-chart-line me-3"></i>Email Tracking Dashboard</h1>
            <div className="d-flex align-items-center">
              {currentUser && (
                <div className="me-3">
                  <span className="text-muted me-2">Logged in as:</span>
                  <strong>{currentUser.name}</strong>
                </div>
              )}
              <button 
                className="btn btn-outline-danger me-3"
                onClick={onLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
              <select
                className="form-select me-3"
                value={selectedCampaign || ''}
                onChange={(e) => onCampaignChange(e.target.value)}
                style={{ minWidth: '200px' }}
              >
                <option value="">Select Campaign</option>
                {campaigns.map(campaign => (
                  <option key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
} 
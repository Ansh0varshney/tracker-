import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    openCount: 0,
    clickCount: 0,
    uniqueOpenersCount: 0,
    topCompanies: []
  });
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/events')
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
  }, []);

  const shortenUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
    } catch (e) {
      return url;
    }
  };

  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'Mac';
    return 'Unknown';
  };

  const renderAllEvents = () => {
    if (events.length === 0) {
      return (<tr><td colSpan="5" className="text-center">No events recorded yet</td></tr>);
    }
    return events.map((event, index) => {
      const date = new Date(event.timestamp);
      const formattedDate = date.toLocaleString();
      let details = event.type === 'open' ? 'Email opened' : `Clicked: ${shortenUrl(event.linkClicked)}`;
      return (
        <tr key={event._id || index}>
          <td><span className={`badge ${event.type === 'open' ? 'badge-open' : 'badge-click'}`}>{event.type.toUpperCase()}</span></td>
          <td>{event.recipient}</td>
          <td><span className="badge badge-company">{event.company}</span></td>
          <td>{details}</td>
          <td>{formattedDate}</td>
        </tr>
      );
    });
  };

  const renderOpens = () => {
    const openEvents = events.filter(event => event.type === 'open');
    if (openEvents.length === 0) return (<tr><td colSpan="5" className="text-center">No opens recorded yet</td></tr>);
    return openEvents.map((event, index) => {
      const date = new Date(event.timestamp);
      const formattedDate = date.toLocaleString();
      const deviceInfo = getDeviceInfo(event.userAgent);
      return (
        <tr key={event._id || index}>
          <td>{event.recipient}</td>
          <td><span className="badge badge-company">{event.company}</span></td>
          <td>{event.emailId}</td>
          <td>{formattedDate}</td>
          <td>{deviceInfo}</td>
        </tr>
      );
    });
  };

  const renderClicks = () => {
    const clickEvents = events.filter(event => event.type === 'click');
    if (clickEvents.length === 0) return (<tr><td colSpan="4" className="text-center">No clicks recorded yet</td></tr>);
    return clickEvents.map((event, index) => {
      const date = new Date(event.timestamp);
      const formattedDate = date.toLocaleString();
      return (
        <tr key={event._id || index}>
          <td>{event.recipient}</td>
          <td><span className="badge badge-company">{event.company}</span></td>
          <td><a href={event.linkClicked} target="_blank" rel="noopener noreferrer">{shortenUrl(event.linkClicked)}</a></td>
          <td>{formattedDate}</td>
        </tr>
      );
    });
  };

  const renderCompanies = () => {
    if (stats.topCompanies.length === 0) return (<tr><td colSpan="4" className="text-center">No company data available</td></tr>);
    return stats.topCompanies.map((company, index) => (
      <tr key={index}>
        <td><span className="badge badge-company">{company.company}</span></td>
        <td>{company.opens}</td>
        <td>{company.clicks}</td>
        <td><strong>{company.engagement}</strong></td>
      </tr>
    ));
  };

  return (
    <div>
      <Head>
        <title>Email Tracking Dashboard</title>
        <meta name="description" content="Email tracking system dashboard" />
      </Head>

      <div className="header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1><i className="fas fa-chart-line me-3"></i>Email Tracking Dashboard</h1>
            <button 
              className="btn btn-primary" 
              onClick={loadDashboardData}
              disabled={loading}
            >
              <i className={`fas fa-sync-alt me-2 ${loading ? 'fa-spin' : ''}`}></i>
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="container mt-3">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="container mb-5">
        <div className="row mb-4" id="statsCards">
          <div className="col-md-3"><div className="card stats-card"><i className="fas fa-envelope-open"></i><div className="number">{stats.openCount}</div><div className="label">Total Opens</div></div></div>
          <div className="col-md-3"><div className="card stats-card"><i className="fas fa-mouse-pointer"></i><div className="number">{stats.clickCount}</div><div className="label">Total Clicks</div></div></div>
          <div className="col-md-3"><div className="card stats-card"><i className="fas fa-users"></i><div className="number">{stats.uniqueOpenersCount}</div><div className="label">Unique Recipients</div></div></div>
          <div className="col-md-3"><div className="card stats-card"><i className="fas fa-building"></i><div className="number">{stats.topCompanies?.length || 0}</div><div className="label">Active Companies</div></div></div>
        </div>

        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item"><button className={`nav-link ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>All Events</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'opens' ? 'active' : ''}`} onClick={() => setActiveTab('opens')}>Opens</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'clicks' ? 'active' : ''}`} onClick={() => setActiveTab('clicks')}>Clicks</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies</button></li>
        </ul>

        <div className="tab-content">
          {activeTab === 'events' && <div className="tab-pane fade show active"><div className="card"><div className="card-body"><h5 className="card-title mb-3">Recent Activity</h5><div className="table-responsive"><table className="table table-striped"><thead><tr><th>Type</th><th>Recipient</th><th>Company</th><th>Details</th><th>Time</th></tr></thead><tbody>{loading ? (<tr><td colSpan="5" className="text-center">Loading data...</td></tr>) : renderAllEvents()}</tbody></table></div></div></div></div>}
          {activeTab === 'opens' && <div className="tab-pane fade show active"><div className="card"><div className="card-body"><h5 className="card-title mb-3">Open Events</h5><div className="table-responsive"><table className="table table-striped"><thead><tr><th>Recipient</th><th>Company</th><th>Email ID</th><th>Time</th><th>Device</th></tr></thead><tbody>{loading ? (<tr><td colSpan="5" className="text-center">Loading data...</td></tr>) : renderOpens()}</tbody></table></div></div></div></div>}
          {activeTab === 'clicks' && <div className="tab-pane fade show active"><div className="card"><div className="card-body"><h5 className="card-title mb-3">Click Events</h5><div className="table-responsive"><table className="table table-striped"><thead><tr><th>Recipient</th><th>Company</th><th>Link</th><th>Time</th></tr></thead><tbody>{loading ? (<tr><td colSpan="4" className="text-center">Loading data...</td></tr>) : renderClicks()}</tbody></table></div></div></div></div>}
          {activeTab === 'companies' && <div className="tab-pane fade show active"><div className="card"><div className="card-body"><h5 className="card-title mb-3">Top Companies</h5><div className="table-responsive"><table className="table table-striped"><thead><tr><th>Company</th><th>Opens</th><th>Clicks</th><th>Engagement</th></tr></thead><tbody>{loading ? (<tr><td colSpan="4" className="text-center">Loading data...</td></tr>) : renderCompanies()}</tbody></table></div></div></div></div>}
        </div>
      </div>
    </div>
  );
}

export default function EventTable({ 
  events, 
  loading, 
  type = 'all',
  searchTerm = '',
  onSearchChange 
}) {
  const filteredEvents = events.filter(event => 
    event.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEvents = () => {
    if (loading) {
      return <tr><td colSpan="5" className="text-center">Loading data...</td></tr>;
    }

    if (filteredEvents.length === 0 && searchTerm) {
      return <tr><td colSpan="5" className="text-center">No matching events found</td></tr>;
    }

    if (filteredEvents.length === 0) {
      return <tr><td colSpan="5" className="text-center">No events recorded yet</td></tr>;
    }

    return filteredEvents.map((event, index) => {
      const date = new Date(event.timestamp);
      const formattedDate = date.toLocaleString();
      
      if (type === 'opens' && event.type === 'open') {
        return (
          <tr key={event._id || index}>
            <td>{event.recipient}</td>
            <td><span className="badge badge-company">{event.company}</span></td>
            <td>{event.emailId}</td>
            <td>{formattedDate}</td>
            <td>{getDeviceInfo(event.userAgent)}</td>
          </tr>
        );
      }

      if (type === 'clicks' && event.type === 'click') {
        return (
          <tr key={event._id || index}>
            <td>{event.recipient}</td>
            <td><span className="badge badge-company">{event.company}</span></td>
            <td><a href={event.linkClicked} target="_blank" rel="noopener noreferrer">{shortenUrl(event.linkClicked)}</a></td>
            <td>{formattedDate}</td>
          </tr>
        );
      }

      if (type === 'all') {
        const details = event.type === 'open' ? 'Email opened' : `Clicked: ${shortenUrl(event.linkClicked)}`;
        return (
          <tr key={event._id || index}>
            <td><span className={`badge ${event.type === 'open' ? 'badge-open' : 'badge-click'}`}>{event.type.toUpperCase()}</span></td>
            <td>{event.recipient}</td>
            <td><span className="badge badge-company">{event.company}</span></td>
            <td>{details}</td>
            <td>{formattedDate}</td>
          </tr>
        );
      }

      return null;
    });
  };

  const getTableHeaders = () => {
    switch (type) {
      case 'opens':
        return ['Recipient', 'Company', 'Email ID', 'Time', 'Device'];
      case 'clicks':
        return ['Recipient', 'Company', 'Link', 'Time'];
      default:
        return ['Type', 'Recipient', 'Company', 'Details', 'Time'];
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">
          {type === 'opens' ? 'Open Events' : 
           type === 'clicks' ? 'Click Events' : 
           'Recent Activity'}
        </h5>
        
        <div className="search-container mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by recipient or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              width: '100%',
              maxWidth: '500px'
            }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderEvents()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function shortenUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch (e) {
    return url;
  }
}

function getDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'Mac';
  return 'Unknown';
} 
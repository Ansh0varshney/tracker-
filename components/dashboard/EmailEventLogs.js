import { useState, useEffect } from 'react';

export default function EmailEventLogs({ campaignId, eventType }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const url = new URL('/api/events', window.location.origin);
        url.searchParams.append('campaignId', campaignId);
        if (eventType) {
          url.searchParams.append('eventType', eventType);
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchEvents();
    }
  }, [campaignId, eventType]);

  // Fix: Use correct event property names for filtering and display
  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.recipient?.toLowerCase().includes(searchLower) ||
      event.company?.toLowerCase().includes(searchLower) ||
      event.userAgent?.toLowerCase().includes(searchLower) ||
      event.ipAddress?.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, user agent, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>Recipient</th>
              <th>Event Type</th>
              <th>IP Address</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No events found
                </td>
              </tr>
            ) : (
              filteredEvents.map(event => (
                <tr key={event._id}>
                  <td>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <div>{event.recipient}</div>
                    <small className="text-muted">{event.company}</small>
                  </td>
                  <td>
                    <span className={`badge bg-${event.type === 'open' ? 'success' : 'primary'}`}>
                      {event.type}
                    </span>
                  </td>
                  <td>
                    <code>{event.ipAddress}</code>
                  </td>
                  <td>
                    <small className="text-muted" style={{ maxWidth: '200px' }}>
                      {event.userAgent}
                    </small>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
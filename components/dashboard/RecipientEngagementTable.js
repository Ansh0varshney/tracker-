import { useState, useEffect } from 'react';

export default function RecipientEngagementTable({ campaignId }) {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEngagements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipient-engagement?campaignId=${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch engagement data');
      const data = await response.json();
      setEngagements(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchEngagements();
    }
  }, [campaignId]);

  const filteredEngagements = engagements.filter(engagement =>
    engagement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engagement.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engagement.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading engagement data...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Recipient Engagement</h5>
        
        <div className="search-container mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>Name</th>
                <th>Email</th>
                <th>Clicks</th>
                <th>Views</th>
                <th>Engagement Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredEngagements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    {searchTerm ? 'No matching recipients found' : 'No engagement data available'}
                  </td>
                </tr>
              ) : (
                filteredEngagements.map(engagement => (
                  <tr key={engagement.email}>
                    <td>{engagement.name}</td>
                    <td>{engagement.email}</td>
                    <td>{engagement.clicks}</td>
                    <td>{engagement.views}</td>
                    <td>
                      <span className="badge bg-primary">
                        {engagement.engagementScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

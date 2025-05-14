export default function CampaignManager({ 
  campaigns, 
  newCampaign, 
  onNewCampaignChange, 
  onCreateCampaign, 
  onDeleteCampaign, 
  loading 
}) {
  if (loading) {
    return <div className="text-center py-4">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No campaigns created yet.</p>
        <p className="text-muted">Create your first campaign to start tracking emails!</p>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Create New Campaign</h5>
            <form onSubmit={onCreateCampaign}>
              <div className="mb-3">
                <label htmlFor="campaignName" className="form-label">Campaign Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="campaignName"
                  value={newCampaign.name}
                  onChange={(e) => onNewCampaignChange({ ...newCampaign, name: e.target.value })}
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
                  onChange={(e) => onNewCampaignChange({ ...newCampaign, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Campaign</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Your Campaigns</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td>{campaign.name}</td>
                      <td>{campaign.description || '-'}</td>
                      <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDeleteCampaign(campaign._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
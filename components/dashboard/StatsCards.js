export default function StatsCards({ stats }) {
  return (
    <div className="row mb-4" id="statsCards">
      <div className="col-md-3">
        <div className="card stats-card">
          <i className="fas fa-envelope-open"></i>
          <div className="number">{stats.openCount}</div>
          <div className="label">Total Opens</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card stats-card">
          <i className="fas fa-mouse-pointer"></i>
          <div className="number">{stats.clickCount}</div>
          <div className="label">Total Clicks</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card stats-card">
          <i className="fas fa-users"></i>
          <div className="number">{stats.uniqueOpenersCount}</div>
          <div className="label">Unique Recipients</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card stats-card">
          <i className="fas fa-building"></i>
          <div className="number">{stats.topCompanies?.length || 0}</div>
          <div className="label">Active Companies</div>
        </div>
      </div>
    </div>
  );
} 
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStoreOwnerDashboard } from '../api/storeOwnerApi';
import { getErrorMessage } from '../api/errorHelper';
import ThemeToggle from '../components/ThemeToggle';

function StoreOwnerDashboard() {
  const { logoutUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });

  useEffect(() => {
    getStoreOwnerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const sortedRaters = useMemo(() => {
    if (!data) return [];
    const list = [...data.raters];
    list.sort((a, b) => {
      let av = a[sort.sortBy];
      let bv = b[sort.sortBy];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sort.order === 'asc' ? -1 : 1;
      if (av > bv) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [data, sort]);

  function toggleSort(field) {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }

  function arrow(field) {
    if (sort.sortBy !== field) return '';
    return sort.order === 'asc' ? ' ▲' : ' ▼';
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>{data ? data.storeName : 'Store Owner Dashboard'}</h2>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/update-password" className="btn btn-secondary">Update Password</Link>
          <button className="btn btn-secondary" onClick={logoutUser}>Log out</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {data && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{data.averageRating > 0 ? data.averageRating : '—'}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.totalRatings}</div>
            <div className="stat-label">Total Ratings</div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name{arrow('name')}</th>
              <th onClick={() => toggleSort('email')}>Email{arrow('email')}</th>
              <th onClick={() => toggleSort('ratingGiven')}>Rating Given{arrow('ratingGiven')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedRaters.map((r) => (
              <tr key={r.userId}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.ratingGiven}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.raters.length === 0 && (
          <p className="empty-state">No ratings submitted yet.</p>
        )}
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { browseStores } from '../api/storeApi';
import { submitRating } from '../api/ratingApi';
import { getErrorMessage } from '../api/errorHelper';
import StarRating from '../components/StarRating';
import ThemeToggle from '../components/ThemeToggle';

function Stores() {
  const { logoutUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  const loadStores = useCallback(() => {
    browseStores({ search, ...sort })
      .then((res) => setStores(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [search, sort]);

  useEffect(() => { loadStores(); }, [loadStores]);

  async function handleRate(storeId, value) {
    setSubmittingId(storeId);
    setError('');
    try {
      await submitRating(storeId, value);
      loadStores(); // refresh overall + own rating
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmittingId(null);
    }
  }

  function toggleSort(field) {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Stores</h2>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/update-password" className="btn btn-secondary">Update Password</Link>
          <button className="btn btn-secondary" onClick={logoutUser}>Log out</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="filters-bar">
        <input
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 280 }}
        />
        <select value={sort.sortBy} onChange={(e) => toggleSort(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="address">Sort by Address</option>
        </select>
        <button className="btn btn-secondary" onClick={() => toggleSort(sort.sortBy)}>
          Order: {sort.order === 'asc' ? 'Ascending ▲' : 'Descending ▼'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Rate this store</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.overallRating > 0 ? s.overallRating : 'No ratings yet'}</td>
                <td>{s.userRating ?? '—'}</td>
                <td>
                  <StarRating
                    value={s.userRating}
                    onSubmit={(val) => handleRate(s.id, val)}
                    disabled={submittingId === s.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stores.length === 0 && <p className="empty-state">No stores found.</p>}
      </div>
    </div>
  );
}

export default Stores;

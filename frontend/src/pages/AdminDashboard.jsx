import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, listUsers, listStoresAdmin } from '../api/adminApi';
import { getErrorMessage } from '../api/errorHelper';
import AddUserModal from '../components/AddUserModal';
import AddStoreModal from '../components/AddStoreModal';
import UserDetailModal from '../components/UserDetailModal';
import ThemeToggle from '../components/ThemeToggle';

function SortableHeader({ field, label, sortBy, order, onSort }) {
  const active = sortBy === field;
  const arrow = active ? (order === 'asc' ? ' ▲' : ' ▼') : '';
  return (
    <th onClick={() => onSort(field)}>
      {label}
      {arrow}
    </th>
  );
}

function AdminDashboard() {
  const { logoutUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stores'
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // users table state
  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'asc' });

  // stores table state
  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc' });

  const loadStats = useCallback(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const loadUsers = useCallback(() => {
    listUsers({ ...userFilters, ...userSort })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [userFilters, userSort]);

  const loadStores = useCallback(() => {
    listStoresAdmin({ ...storeFilters, ...storeSort })
      .then((res) => setStores(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [storeFilters, storeSort]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadStores(); }, [loadStores]);

  function handleUserSort(field) {
    setUserSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }

  function handleStoreSort(field) {
    setStoreSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/update-password" className="btn btn-secondary">Update Password</Link>
          <button className="btn btn-secondary" onClick={logoutUser}>Log out</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalUsers : '—'}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalStores : '—'}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalRatings : '—'}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="header-actions" style={{ marginBottom: 16 }}>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
        <span style={{ flex: 1 }} />
        {activeTab === 'users' ? (
          <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>
            + Add User
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setShowAddStore(true)}>
            + Add Store
          </button>
        )}
      </div>

      {activeTab === 'users' && (
        <>
          <div className="filters-bar">
            <input
              placeholder="Filter by name"
              value={userFilters.name}
              onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
            />
            <input
              placeholder="Filter by email"
              value={userFilters.email}
              onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
            />
            <input
              placeholder="Filter by address"
              value={userFilters.address}
              onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
            />
            <select
              value={userFilters.role}
              onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
            >
              <option value="">All roles (Admin + Normal)</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <SortableHeader field="name" label="Name" sortBy={userSort.sortBy} order={userSort.order} onSort={handleUserSort} />
                  <SortableHeader field="email" label="Email" sortBy={userSort.sortBy} order={userSort.order} onSort={handleUserSort} />
                  <SortableHeader field="address" label="Address" sortBy={userSort.sortBy} order={userSort.order} onSort={handleUserSort} />
                  <SortableHeader field="role" label="Role" sortBy={userSort.sortBy} order={userSort.order} onSort={handleUserSort} />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="clickable-row" onClick={() => setSelectedUserId(u.id)}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="empty-state">No users found.</p>}
          </div>
        </>
      )}

      {activeTab === 'stores' && (
        <>
          <div className="filters-bar">
            <input
              placeholder="Filter by name"
              value={storeFilters.name}
              onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
            />
            <input
              placeholder="Filter by email"
              value={storeFilters.email}
              onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
            />
            <input
              placeholder="Filter by address"
              value={storeFilters.address}
              onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
            />
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <SortableHeader field="name" label="Name" sortBy={storeSort.sortBy} order={storeSort.order} onSort={handleStoreSort} />
                  <SortableHeader field="email" label="Email" sortBy={storeSort.sortBy} order={storeSort.order} onSort={handleStoreSort} />
                  <SortableHeader field="address" label="Address" sortBy={storeSort.sortBy} order={storeSort.order} onSort={handleStoreSort} />
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.rating > 0 ? s.rating : 'No ratings yet'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stores.length === 0 && <p className="empty-state">No stores found.</p>}
          </div>
        </>
      )}

      {showAddUser && (
        <AddUserModal onClose={() => setShowAddUser(false)} onCreated={() => { loadUsers(); loadStats(); }} />
      )}
      {showAddStore && (
        <AddStoreModal onClose={() => setShowAddStore(false)} onCreated={() => { loadStores(); loadStats(); }} />
      )}
      {selectedUserId && (
        <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}

export default AdminDashboard;

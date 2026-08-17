import { useState, useEffect } from 'react';
import { getUserDetail } from '../api/adminApi';
import { getErrorMessage } from '../api/errorHelper';

function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserDetail(userId)
      .then((res) => setUser(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [userId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>User Details</h3>
        {error && <p className="error-text">{error}</p>}

        {!user && !error && <p>Loading...</p>}

        {user && (
          <>
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span>{user.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address</span>
              <span>{user.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role</span>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
            {user.role === 'STORE_OWNER' && (
              <div className="detail-row">
                <span className="detail-label">Store Rating</span>
                <span>{user.rating > 0 ? user.rating : 'No ratings yet'}</span>
              </div>
            )}
          </>
        )}

        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;

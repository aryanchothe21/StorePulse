import { useState, useEffect } from 'react';
import { createStore, listUsers } from '../api/adminApi';
import { getErrorMessage } from '../api/errorHelper';

function AddStoreModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listUsers({ role: 'STORE_OWNER' })
      .then((res) => setOwners(res.data))
      .catch(() => setOwners([]));
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createStore(formData);
      onCreated();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Store</h3>
        {error && <p className="error-text">{error}</p>}

        {owners.length === 0 && (
          <p className="error-text">
            No Store Owner accounts exist yet. Create one first via "Add User" (role: Store Owner).
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Store Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={60}
            placeholder="Store name (20-60 characters)"
          />

          <label>Store Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            maxLength={400}
          />

          <label>Store Owner</label>
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            disabled={owners.length === 0}
          >
            <option value="">Select an owner...</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || owners.length === 0}>
              {loading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStoreModal;

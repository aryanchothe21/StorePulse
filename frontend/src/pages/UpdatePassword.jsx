import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { updatePassword } from '../api/authApi';
import { getErrorMessage } from '../api/errorHelper';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function UpdatePassword() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // route back to the correct dashboard for this user's role
  function homePath() {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'STORE_OWNER') return '/store-owner/dashboard';
    return '/stores';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updatePassword(formData);
      setSuccess('Password updated successfully.');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Update Password</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: '#16a34a', fontSize: 14, marginBottom: 12 }}>{success}</p>}

        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={16}
          placeholder="8-16 chars, 1 uppercase, 1 special char"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        <p>
          <Link to={homePath()} onClick={(e) => { e.preventDefault(); navigate(homePath()); }}>
            Back to dashboard
          </Link>
        </p>
      </form>
    </div>
  );
}

export default UpdatePassword;

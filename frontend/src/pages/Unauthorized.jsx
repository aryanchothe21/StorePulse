import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="auth-page">
      <div className="auth-form" style={{ textAlign: 'center' }}>
        <h2>403 — Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default Unauthorized;

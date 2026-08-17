import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Usage:
 * <Route path="/admin/dashboard" element={
 *   <ProtectedRoute allowedRoles={['ADMIN']}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * } />
 *
 * - No user in context (not logged in)     -> redirect to /login
 * - Logged in, role not in allowedRoles    -> redirect to /unauthorized
 * - Logged in, role allowed                -> render the page
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;

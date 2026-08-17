import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import Stores from './pages/Stores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      {/* BrowserRouter enables client-side routing for the whole app */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin only */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Normal User only — role value is NORMAL, not NORMAL_USER */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['NORMAL']}>
                <Stores />
              </ProtectedRoute>
            }
          />

          {/* Store Owner only */}
          <Route
            path="/store-owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Any logged-in role can update their own password */}
          <Route
            path="/update-password"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />

          {/* Redirect the root path to /login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

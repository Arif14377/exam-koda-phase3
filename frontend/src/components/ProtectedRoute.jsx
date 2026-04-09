import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  // Jika tidak ada token, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render component
  return element;
};

export default ProtectedRoute;

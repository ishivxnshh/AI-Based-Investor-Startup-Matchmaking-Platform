// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const hasFilledForm = localStorage.getItem(`hasFilled${role}Form`) === 'true';

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  if (!hasFilledForm && role === 'investor') {
    return <Navigate to="/investor-form" replace />;
  }

  if (!hasFilledForm && role === 'startup') {
    return <Navigate to="/startup-form" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
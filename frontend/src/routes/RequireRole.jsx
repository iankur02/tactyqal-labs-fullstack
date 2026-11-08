import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
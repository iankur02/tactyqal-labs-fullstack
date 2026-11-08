import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

export default function PublicOnlyRoute({ children, redirectTo = '/admin' }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Checking session…" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
}
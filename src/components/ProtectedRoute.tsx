import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  role?: 'admin' | 'warga';
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, profile, loading, isAdmin, isWarga } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'warga' && !isWarga && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

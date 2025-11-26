import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Debug log
  console.log('ProtectedRoute check:', {
    loading,
    isAuthenticated,
    user: user ? { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      roleType: typeof user.role,
      isAdmin: user.role === 'admin' || user.role === 'super_admin',
    } : null,
    requireAdmin,
    requireSuperAdmin,
    localStorageUser: JSON.parse(localStorage.getItem('user') || 'null'),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/admin-panel/login" replace />;
  }

  if (requireSuperAdmin && user.role !== 'super_admin') {
    console.log('Redirecting - super admin required');
    return <Navigate to="/admin-panel" replace />;
  }

  // Admin panel için admin kontrolü
  // Role'u string olarak kontrol et
  const userRole = String(user.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  
  if (requireAdmin && !isAdmin) {
    console.log('Redirecting - admin required', {
      currentRole: user.role,
      userRole,
      isAdmin,
      userEmail: user.email,
    });
    return <Navigate to="/admin-panel/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


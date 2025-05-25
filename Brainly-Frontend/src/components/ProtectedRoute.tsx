import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated();
        setAuthStatus(authenticated);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthStatus(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (authStatus === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!authStatus) {
    return <Navigate to="/signin" replace />;
  }

  // Render the protected content if authenticated
  return <>{children}</>;
} 
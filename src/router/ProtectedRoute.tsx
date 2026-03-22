import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingScreen>
        <Spinner size={32} />
      </LoadingScreen>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

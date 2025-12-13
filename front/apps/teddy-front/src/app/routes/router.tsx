import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { ClientsPage } from '../../features/clients/pages/ClientsPage';
import { SelectedClientsPage } from '../../features/selected-clients/pages/SelectedClientsPage';
import { RequireAuth } from '../guards/RequireAuth';
import { AppLayout } from '../../shared/layouts';
import { useAuthStore } from '../../shared/lib/auth.store';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/clients" replace />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="selected-clients" element={<SelectedClientsPage />} />
        </Route>
        <Route
          path="*"
          element={
            useAuthStore.getState().isAuthenticated() ? (
              <Navigate to="/clients" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

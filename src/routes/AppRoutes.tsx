import type { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/shared/Navigation';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { PasswordResetPage } from '@/pages/PasswordResetPage';
import { ItemsPage } from '@/pages/ItemsPage';
import { CartPage } from '@/pages/CartPage';
import { EventsPage } from '@/pages/EventsPage';
import ProtectedRoute from './ProtectedRoute';

export function AppRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

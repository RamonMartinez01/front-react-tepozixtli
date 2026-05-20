// src/features/auth/components/AdminGuard.tsx
import React from 'react'; // <--- Importante incluir esto
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

// Usamos React.ReactNode para mayor compatibilidad y robustez
export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>; // Fragmento para envolver los children
};
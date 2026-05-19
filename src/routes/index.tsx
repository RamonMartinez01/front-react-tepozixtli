// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../features/auth/LoginForm';

// =====================================================================
// 1. PLACEHOLDERS TEMPORALES (Luego los moveremos a la capa "pages/")
// =====================================================================
const LandingPage = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold mb-4">Bienvenido a Tepozixtli</h1>
    <div className="flex justify-center gap-4">
      <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Iniciar Sesión</a>
      <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded">Registrarse</a>
    </div>
  </div>
);

const RegisterPage = () => <div className="p-10">Formulario de Registro temporal...</div>;

const DashboardPage = () => (
  <div className="p-10 bg-slate-100 min-h-screen">
    <h1 className="text-2xl font-bold">Panel Principal</h1>
    <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
      Dibuja tu Parcela
    </button>
    <div className="mt-4 h-64 bg-slate-300 border-2 border-dashed border-slate-500 flex items-center justify-center">
      (Aquí irá React Leaflet)
    </div>
  </div>
);

// =====================================================================
// 2. EL GUARDIÁN DE RUTAS REAL (Conectado a Zustand)
// =====================================================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Ahora Zustand decide si hay token o no
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// =====================================================================
// 3. LA TORRE DE CONTROL
// =====================================================================
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Reemplazamos el placeholder por el componente real */}
        <Route path="/login" element={<LoginForm />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../features/auth/LoginForm';
import { MapWorkspace } from '../features/parcelas/components/MapWorkspace';

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

const DashboardPage = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Panel Agroespacial</h1>
          <button 
            onClick={logout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        {/* Aquí inyectamos el mapa FSD */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <MapWorkspace />
        </div>
      </div>
    </div>
  );
};

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
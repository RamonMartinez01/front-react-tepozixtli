// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/Home/ui/HomePage';
import { DashboardAgricola } from '../pages/DashboardAgricola/ui/DashboardAgricola';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Padre: Aplica el MainLayout a todas sus rutas hijas */}
        <Route element={<MainLayout />}>
          
          {/* Índice genérico (/) -> Muestra el Dashboard Principal */}
          <Route path="/" element={<HomePage />} />
          
          {/* Nueva ruta específica para la consola de los mapas */}
          <Route path="/mapa" element={<DashboardAgricola />} />
          
        </Route>

        {/* Ruta comodín de seguridad */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
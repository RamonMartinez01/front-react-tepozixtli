// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardAgricola } from '../pages/DashboardAgricola/ui/DashboardAgricola';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* La llamada a la raíz (/) ahora carga nuestra consola WebGL */}
        <Route path="/" element={<DashboardAgricola />} />

        {/* Ruta comodín: cualquier URL errónea te regresa al mapa */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
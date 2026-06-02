// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importamos solo lo que necesitamos: Layout y el Manager de Regiones
import { AdminLayout } from '../layouts/AdminLayout';
import { RegionManager } from '../features/regiones/routes/RegionManager';

// =====================================================================
// LA TORRE DE CONTROL (VERSIÓN DESBLOQUEADA)
// =====================================================================
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Envolvemos la aplicación en tu Layout principal */}
        <Route path="/" element={<AdminLayout />}>
          {/* Redirigimos la raíz (/) directamente a /regiones */}
          <Route index element={<Navigate to="regiones" replace />} />
          
          {/* Tu espacio de trabajo principal */}
          <Route path="regiones" element={<RegionManager />} />
        </Route>

        {/* Ruta comodín para cualquier URL que no exista: te regresa a regiones */}
        <Route path="*" element={<Navigate to="/regiones" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
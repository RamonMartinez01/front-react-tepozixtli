import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Encabezado Admin: Aquí podrías poner un aviso visual de "Modo Administrador" */}
      <header className="bg-slate-900 text-white p-4">
        <h1 className="font-bold text-lg">Panel de Administración - Ojos de Cobre</h1>
      </header>
      
      <main className="p-6">
        {/* Aquí se inyectarán las rutas hijas (como la gestión de regiones) */}
        <Outlet />
      </main>
    </div>
  );
};
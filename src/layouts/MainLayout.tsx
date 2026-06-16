// src/app/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    // Fondo oscuro sólido, sin transparencias (cero Glassmorphism), tipografía limpia
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 w-screen overflow-hidden">
      
      {/* Aquí inyectaremos el TopBar (Widget) en la siguiente fase */}
      <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-[#0f0f0f]">
         <span className="text-cyan-500 font-bold uppercase tracking-widest text-sm">
           Hñäki // <span className="text-slate-500">Navigation Prototype</span>
         </span>
      </header>

      {/* <Outlet /> es el portal donde React Router inyectará las Pages */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
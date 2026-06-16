// src/app/layouts/MainLayout.tsx
import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => {
  return (
    
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 w-screen overflow-hidden">
      
   
     <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-[#0f0f0f] z-20 shadow-md">
         {/* Transformamos el texto en un Link interactivo y sobrio */}
         <Link 
            to="/" 
            className="text-cyan-500 font-bold uppercase tracking-widest text-sm hover:text-cyan-400 transition-colors cursor-pointer"
         >
           Hñäki 
         </Link>
      </header>

      {/* <Outlet /> es el portal donde React Router inyecta las Pages */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};